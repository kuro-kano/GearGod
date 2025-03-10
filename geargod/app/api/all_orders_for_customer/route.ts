import { NextResponse } from "next/server";
import { connectSQLite } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  let db;
  try {
    const session = await getServerSession(req);
    db = await connectSQLite();
    let username = "";
    if (session?.user) {
      username = session.user.username || session.user.email || "";
    }
    // console.log("Username:", username);

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
              orders.user_id,
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
              products.product_name
          FROM
              order_items
              JOIN orders USING (order_id)
              JOIN product_colors USING (product_color_id)
              JOIN products USING (product_id)
              JOIN users USING (user_id)
          WHERE
              username = ? OR
              email = ?
          ORDER BY
              order_date DESC;
        `, [username, username]);

    // console.log("Successfully fetched orders:", orders);

    const formattedOrders = orders.map((order) => ({
      ...order,
      orderDate: new Date(order.order_date).toLocaleDateString(),
      productName: order.product_name,
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
