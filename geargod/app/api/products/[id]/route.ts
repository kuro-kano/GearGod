// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectSQLite } from "@/lib/db"; // Use shared DB connection

// GET product by ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Fix: Use context directly and await the params
  const { id } = await context.params;

  try {
    const db = await connectSQLite();

    // Modified query to join with categories table to get the category name
    const product = await db.get(
      `SELECT p.*, c.category_name 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.category_id
       WHERE p.product_id = ?`,
      [id]
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Also get product images from products_image table
    const productImages = await db.all(
      `SELECT * FROM products_image WHERE product_id = ? ORDER BY is_primary DESC`,
      [id]
    );

    // Enhance product with images data
    const enhancedProduct = {
      ...product,
      images: productImages,
      // Still keep the main image_url for backward compatibility
      image_url: productImages.length > 0 ? productImages[0].image_url : null,
    };

    await db.close();

    return NextResponse.json(enhancedProduct);
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
  context: { params: { id: string } }
) {
  // Fix: Use context directly and await the params
  const { id } = await context.params;

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
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Fix: Use context directly and await the params
  const { id } = await context.params;

  try {
    const db = await connectSQLite();

    // Check if product exists
    const existingProduct = await db.get(
      "SELECT * FROM products WHERE product_id = ?",
      [id]
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

    await db.run("DELETE FROM products WHERE product_id = ?", [id]);

    await db.close();

    return NextResponse.json({
      message: "Product deleted successfully",
      deleted_product_id: id,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the product" },
      { status: 500 }
    );
  }
}
