// app/api/orders/route.ts
import { connectSQLite } from "@/lib/db";
import { log } from "console";
import { NextResponse } from "next/server";

// GET all products
export async function GET() {
    try {
        const db = await connectSQLite();

        const orders = await db.all(`
            SELECT o.*, oi.*
            FROM orders o
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
        `);

        await db.close();
        return NextResponse.json(orders);
    } catch (error) {
        console.log("Failed to fetch orders:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}