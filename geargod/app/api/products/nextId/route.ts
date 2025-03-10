import { NextResponse } from "next/server";
import { connectSQLite } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectSQLite();
    const result = await db.get("SELECT MAX(product_id) as maxId FROM products");
    await db.close();

    const nextId = (result?.maxId || 0) + 1;
    return NextResponse.json({ nextId });
  } catch (error) {
    console.error("Error getting next product ID:", error);
    return NextResponse.json(
      { error: "Failed to get next product ID" },
      { status: 500 }
    );
  }
}
