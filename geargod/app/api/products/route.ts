// app/api/products/route.ts
import { connectSQLite } from "@/lib/db"; // Fix import path
import { NextResponse } from "next/server";

// GET all products
export async function GET(req: Request) {
  try {
    const db = await connectSQLite();
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");

    // Updated query to include category_name using JOIN
    let query = `
      SELECT p.*, c.category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
    `;

    const params = [];

    if (category) {
      query += " WHERE p.category_id = ?";
      params.push(category);

      if (search) {
        query += " AND (p.product_name LIKE ? OR p.description LIKE ?)";
        params.push(`%${search}%`);
        params.push(`%${search}%`);
      }
    } else if (search) {
      query += " WHERE p.product_name LIKE ? OR p.description LIKE ?";
      params.push(`%${search}%`);
      params.push(`%${search}%`);
    }

    const products = await db.all(query, params);
    await db.close();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching products" },
      { status: 500 }
    );
  }
}

// POST new product
export async function POST(req: Request) {
  try {
    const {
      product_name,
      description,
      category_id,
      price,
      stock_quantity,
      is_customizable,
      tags,
    } = await req.json();

    // Validate required fields
    if (!product_name || price === undefined) {
      return NextResponse.json(
        { message: "Product name and price are required" },
        { status: 400 }
      );
    }

    const db = await connectSQLite();

    const query = `
      INSERT INTO products (
        product_name, description, category_id, price, 
        stock_quantity, is_customizable, tags
      )
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const result = await db.run(query, [
      product_name,
      description || null,
      category_id || null,
      price,
      stock_quantity || 0,
      is_customizable ? 1 : 0,
      tags || null,
    ]);

    const newProduct = await db.get(
      "SELECT * FROM products WHERE product_id = ?",
      [result.lastID]
    );

    await db.close();

    return NextResponse.json(
      { message: "Product created successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the product" },
      { status: 500 }
    );
  }
}
