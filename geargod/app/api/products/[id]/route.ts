// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectSQLite } from "@/lib/db"; // Use shared DB connection

// GET product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // For Next.js 13+ dynamic API routes, we don't need to await params.id
  // The warning is incorrect in this context - params object is already resolved
  const id = params.id;

  try {
    const db = await connectSQLite();

    // Query product by ID
    const product = await db.get(
      `
      SELECT p.*, c.category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `,
      [id]
    );

    await db.close();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// UPDATE product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Same here, params.id is already available
  const id = params.id;

  try {
    const productData = await request.json();
    const db = await connectSQLite();

    console.log("Updating product with data:", productData);

    // First, get the table info to check available columns
    const tableInfo = await db.all("PRAGMA table_info(products)");
    const columnNames = tableInfo.map((col) => col.name);
    console.log("Available columns:", columnNames);

    // Build SQL query dynamically based on available columns
    let sql = "UPDATE products SET ";
    const columns = [];
    const values = [];

    if (columnNames.includes("product_name")) {
      columns.push("product_name = ?");
      values.push(productData.product_name);
    }

    if (columnNames.includes("description")) {
      columns.push("description = ?");
      values.push(productData.description || null);
    }

    if (columnNames.includes("category_id")) {
      columns.push("category_id = ?");
      values.push(productData.category_id || null);
    }

    if (columnNames.includes("price")) {
      columns.push("price = ?");
      values.push(productData.price);
    }

    if (columnNames.includes("stock_quantity")) {
      columns.push("stock_quantity = ?");
      values.push(productData.stock_quantity || 0);
    }

    if (columnNames.includes("is_customizable")) {
      columns.push("is_customizable = ?");
      values.push(
        productData.is_customizable === "TRUE" ||
          productData.is_customizable === true ||
          productData.is_customizable === 1
          ? 1
          : 0
      );
    }

    if (columnNames.includes("tags")) {
      columns.push("tags = ?");
      values.push(productData.tags || null);
    }

    // Only include image_url if it exists in the database
    if (
      columnNames.includes("image_url") &&
      productData.image_url !== undefined
    ) {
      columns.push("image_url = ?");
      values.push(productData.image_url || null);
    }

    if (columnNames.includes("updated_at")) {
      columns.push("updated_at = CURRENT_TIMESTAMP");
    }

    sql += columns.join(", ") + " WHERE product_id = ?";
    values.push(id);

    console.log("SQL:", sql);
    console.log("Values:", values);

    // Execute the update
    const result = await db.run(sql, values);
    await db.close();

    return NextResponse.json({
      message: "Product updated successfully",
      product_id: id,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      {
        message: "Failed to update product",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Remove the await from params.id - it's not a Promise
  const productId = params.id;

  try {
    const db = await connectSQLite();

    // Check if product exists
    const existingProduct = await db.get(
      "SELECT * FROM products WHERE product_id = ?",
      [productId]
    );

    if (!existingProduct) {
      await db.close();
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Check if this product is referenced in other tables (like orders)
    // If you have order tables that reference products, add that check here

    await db.run("DELETE FROM products WHERE product_id = ?", [productId]);

    await db.close();

    return NextResponse.json({
      message: "Product deleted successfully",
      deleted_product_id: productId,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the product" },
      { status: 500 }
    );
  }
}
