import { NextResponse } from "next/server";
import { connectSQLite } from "@/lib/db";

export async function GET() {
  try {
    // Connect to the SQLite database
    const db = await connectSQLite();

    // Query the categories table
    const categories = await db.all(`
      SELECT category_id, category_name 
      FROM categories 
      ORDER BY category_name ASC
    `);

    // Close the database connection
    await db.close();

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
