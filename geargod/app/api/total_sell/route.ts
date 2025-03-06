import { NextResponse } from "next/server";
import { connectSQLite } from "@/lib/db";

export async function GET() {
  let db;
  try {
    db = await connectSQLite();
    const total_sell = await db.all(`
        SELECT
        COUNT(order_items.order_item_id) AS all_order,
        SUM(order_items.subtotal) AS total_sales,
            (
                SELECT
                    COUNT(order_items.order_item_id)
                FROM
                    order_items
                JOIN orders ON order_items.order_id = orders.order_id
                WHERE
                    order_status != 'Completed' and order_status != 'Processing'
            ) AS shipped_orders
        FROM
            orders,
            product_colors
            LEFT JOIN order_items ON orders.order_id = order_items.order_id
            LEFT JOIN users ON order_items.order_id = users.user_id
            LEFT JOIN products ON product_colors.product_id = products.product_id
        ORDER BY
            order_items.order_item_id DESC
    `);
    console.log("Successfully fetched totall:", total_sell);

    const total = total_sell.map((totals) => ({
      all_order: totals.all_order || 0,
      all_sales: totals.total_sales || 0,
      all_shipped: totals.shipped_orders || 0,
    }));

    return NextResponse.json(total);
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
