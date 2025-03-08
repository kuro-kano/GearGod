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
