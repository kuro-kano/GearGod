import { NextResponse } from "next/server";
import { connectSQLite } from "@/lib/db";

export async function POST(request: Request) {
  const db = await connectSQLite();

  try {
    const {
      username,
      total_amount,
      first_name,
      last_name,
      phone,
      shipping_address,
      payment_method,
      cart_items,
      coupon
    } = await request.json();

    console.log("Received cart items:", JSON.stringify(cart_items, null, 2));

    // Start transaction
    await db.run("BEGIN TRANSACTION");

    // Get user ID
    console.log("username: ", username);
    const userResult = await db.get(
      `SELECT user_id FROM users WHERE username = ?`,
      [username]
    );
    const user_id = userResult?.user_id;
    console.log("User ID:", user_id);

    // Insert order
    const orderResult = await db.run(
      `
      INSERT INTO orders (
        user_id, total_amount, first_name, last_name, phone, 
        shipping_address, payment_method, order_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id || null,
        total_amount,
        first_name,
        last_name,
        phone,
        shipping_address,
        payment_method,
        "Checking",
      ]
    );

    const orderId = orderResult.lastID;

    // Track coupon usage if a coupon was used
    if (coupon) {

      await db.run(
        `INSERT INTO coupon_usage (coupon_id, user_id, order_id, discount_amount) 
          VALUES (?, ?, ?, ?)`,
        [coupon.coupon_id, user_id, orderId, coupon.discount_amount]
      );
    }

    // Process each cart item
    for (const item of cart_items) {
      // Update product quantity first
      await db.run(
        `
        UPDATE products 
        SET stock_quantity = stock_quantity - ? 
        WHERE product_id = ?`,
        [item.quantity, item.product_id]
      );

      // Get updated quantity to check if we're out of stock
      const stockResult = await db.get(
        `
        SELECT stock_quantity 
        FROM products 
        WHERE product_id = ?`,
        [item.product_id]
      );

      if (stockResult.stock_quantity < 0) {
        throw new Error(`Product ${item.product_name} is out of stock`);
      }

      console.log(item.category);

      if (item.category === "Computer-Cases") {
        // if (!item.material_id && !item.component_id && !item.color_id) {
        //   db.run(
        //     `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)`,
        //     [
        //       orderId,
        //       item.product_id,
        //       item.quantity,
        //       item.unit_price,
        //       item.subtotal,
        //     ]
        //   );
        // } else {
          // Create custom design first
          const designResult = await db.run(
            `
            INSERT INTO custom_designs (
              user_id, product_id, color_id, material_id
            ) VALUES (?, ?, ?, ?)`,
            [
              user_id || null,
              parseInt(item.product_id),
              item.color_id ? parseInt(item.color_id) : null,
              item.material_id ? parseInt(item.material_id) : null,
            ]
          );
          const designId = designResult.lastID;

          // Create order item with design_id
          await db.run(
            `
            INSERT INTO order_items (
              order_id, design_id, quantity, unit_price, subtotal
            ) VALUES (?, ?, ?, ?, ?)`,
            [orderId, designId, item.quantity, item.unit_price, item.subtotal]
          );
        // }

      } else {
        let product_color_id = null;

        // Only query for product color if color information exists
        if (item.color && item.color.color_name) {
          const product_color_result = await db.get(
            `
            SELECT pc.product_color_id
            FROM product_colors pc
            JOIN colors c ON pc.color_id = c.color_id
            WHERE pc.product_id = ? AND c.color_name = ?`,
            [item.product_id, item.color.color_name]
          );
          product_color_id = product_color_result?.product_color_id;
        }
        // For non-custom products, use product_color_id directly
        await db.run(
          `
          INSERT INTO order_items (
            order_id, product_color_id, quantity, unit_price, subtotal
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            orderId,
            product_color_id,
            item.quantity,
            item.unit_price,
            item.subtotal,
          ]
        );
      }
    }

    // Commit transaction
    await db.run("COMMIT");

    return NextResponse.json({
      success: true,
      orderId: orderId,
    });
  } catch (error) {
    // Rollback on error
    await db.run("ROLLBACK");
    console.error("Error processing order:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to process order",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  let db;
  try {
    db = await connectSQLite();

    // Test if tables exist
    const tableCheck = await db.get(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='orders'
        `);

    if (!tableCheck) {
      throw new Error("Orders table does not exist");
    }

    const orders = await db.all(`
          SELECT
              order_id AS id,
              order_date,
              CASE
                  WHEN concat (
                      coalesce(orders.first_name, ''),
                      ' ',
                      coalesce(orders.last_name, '')
                  ) = ' ' THEN 'Unknown Customer'
                  ELSE concat (
                      coalesce(orders.first_name, ''),
                      ' ',
                      coalesce(orders.last_name, '')
                  )
              END AS customerName,
              orders.order_status AS orderStatus,
              products.product_name AS productName
          FROM
              order_items
              JOIN orders USING (order_id)
              JOIN product_colors USING (product_color_id)
              JOIN products USING (product_id)
          ORDER BY
              order_date DESC
          LIMIT 5;
        `);

    // console.log("Successfully fetched orders:", orders);

    const formattedOrders = orders.map((order) => ({
      ...order,
      orderDate: new Date(order.order_date).toLocaleDateString(),
      customerName: order.customerName,
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Detailed API error:", error);
    return NextResponse.json(
      { error: error || "Failed to fetch orders" },
      { status: 500 }
    );
  } finally {
    if (db) {
      await db.close();
    }
  }
}
