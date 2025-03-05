import { NextResponse } from "next/server";
import { connectSQLite } from "@/lib/db";

export async function GET() {
    try {
        // Connect to the SQLite database
        const db = await connectSQLite();

        // Query the orders table
        const orders = await db.all(`
      SELECT o*
      FROM orders o 
    `);

        // Close the database connection
        await db.close();

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
