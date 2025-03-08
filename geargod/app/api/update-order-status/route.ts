import { NextResponse } from "next/server";
import { connectSQLite } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();  // ✅ ดึงข้อมูลจาก request body
    console.log("🔹 API Received Data:", body);

    const { id, orderStatus } = body;

    if (!id || !orderStatus) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await connectSQLite();
    await db.run("UPDATE orders SET order_status = ? WHERE order_id = ?", [orderStatus, id]);

    console.log(`✅ Updated Order ID: ${id} -> Status: ${orderStatus}`);

    return NextResponse.json({ message: "อัปเดตสถานะสำเร็จ!" });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด!" }, { status: 500 });
  }
}
