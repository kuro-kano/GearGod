import { NextResponse } from "next/server";
import { connectSQLite } from "@/lib/db";

export async function GET() {
  let db;
  try {
    db = await connectSQLite();

    const tableCheck = await db.get(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='coupon_usage'
    `);

    if (!tableCheck) {
      throw new Error("Orders table does not exist");
    }

    const count_using = await db.all(`
        SELECT
            coupon_usage.coupon_id,
            coupons.coupon_code,
            COUNT(*) AS Count_Using
        FROM
            coupon_usage
            LEFT JOIN coupons ON coupon_usage.coupon_id = coupons.coupon_id
        GROUP BY
            coupon_usage.coupon_id,
            coupons.coupon_code;`);

    // console.log("Successfully fetched using_coupon:", count_using);

    const formattedCoupon = count_using.map((coupon) => ({
      coupon_id: coupon.coupon_id || 0,
      coupon_count_using: coupon.Count_Using || 0,
      coupon_name: coupon.coupon_code || "No Have Coupon",
    }));

    return NextResponse.json(formattedCoupon);
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
