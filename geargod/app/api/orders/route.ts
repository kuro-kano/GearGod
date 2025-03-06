import { NextResponse } from "next/server";
import { connectSQLite } from "@/lib/db";

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
                order_items.order_item_id,
                order_items.order_id,
                orders.order_date,
                orders.order_status,
                users.first_name,
                users.last_name,
                product_colors.color_id,
                products.product_name

            FROM
                orders, product_colors
                LEFT JOIN order_items ON orders.order_id = order_items.order_id
                LEFT JOIN users ON order_items.order_id = users.user_id
                LEFT JOIN products ON product_colors.product_id = products.product_id
            LIMIT 5
        `);

    console.log("Successfully fetched orders:", orders);

    const formattedOrders = orders.map((order) => ({
      ...order,
      orderDate: new Date(order.order_date).toLocaleDateString(),
      productName: order.product_name || "Unknown Product",
      customerName: order.customer_name || "Unknown Customer",
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Detailed API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  } finally {
    if (db) {
      await db.close();
    }
  }
}
