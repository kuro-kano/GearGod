// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectSQLite } from "@/lib/db"; // Use shared DB connection

// GET product by ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  console.log("Fetching product with ID:", id);

  try {
    const db = await connectSQLite();

    // Query product details
    const product = await db.get(
      `SELECT p.*, c.category_name 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.category_id
       WHERE p.product_id = ?`,
      [id]
    );

    console.log("Product query result:", product);

    if (!product) {
      console.log("Product not found for ID:", id);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get product images
    const productImages = await db.all(
      `SELECT * FROM products_image WHERE product_id = ? ORDER BY is_primary DESC`,
      [id]
    );

    const productColors = await db.all(
      `SELECT c.color_id, c.color_name, c.color_code
      FROM colors c
      JOIN product_colors pc ON c.color_id = pc.color_id
      WHERE pc.product_id = ?`,
      [id]
    );

    // Enhance product with images data
    const enhancedProduct = {
      ...product,
      images: productImages,
      // Still keep the main image_url for backward compatibility
      image_url: productImages.length > 0 ? productImages[0].image_url : null,
      colors: productColors.length > 0 ? productColors : [],
    };

    await db.close();
    return NextResponse.json(enhancedProduct);

  } catch (error) {
    console.error("Detailed error in GET product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// UPDATE product
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  try {
    const productData = await request.json();
    const db = await connectSQLite();

    const result = await updateProductBase(db, id, productData);
    await handleColorAssociations(db, id, productData);
    await handleProductImages(db, productData);

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

async function updateProductBase(db: any, id: string, productData: any) {
  const tableInfo = await db.all("PRAGMA table_info(products)");
  const columnNames = tableInfo.map((col: any) => col.name);

  const updates = buildUpdateObject(columnNames, productData);
  const { sql, values } = constructUpdateQuery(updates, id);

  return await db.run(sql, values);
}

function buildUpdateObject(columnNames: string[], productData: any) {
  const updates: Record<string, any> = {};

  const columnMappings = {
    product_name: () => productData.product_name,
    description: () => productData.description || null,
    category_id: () => productData.category_id || null,
    price: () => productData.price,
    stock_quantity: () => productData.stock_quantity || 0,
    is_customizable: () =>
      productData.is_customizable === "TRUE" ||
      productData.is_customizable === true ||
      productData.is_customizable === 1
        ? 1
        : 0,
    tags: () => productData.tags || null,
    image_url: () =>
      productData.image_url !== undefined
        ? productData.image_url || null
        : undefined,
    updated_at: () => "CURRENT_TIMESTAMP",
  };

  for (const column of columnNames) {
    if (column in columnMappings) {
      const value = columnMappings[column as keyof typeof columnMappings]();
      if (value !== undefined) {
        updates[column] = value;
      }
    }
  }

  return updates;
}

function constructUpdateQuery(updates: Record<string, any>, id: string) {
  const columns = [];
  const values = [];

  for (const [column, value] of Object.entries(updates)) {
    if (value === "CURRENT_TIMESTAMP") {
      columns.push(`${column} = CURRENT_TIMESTAMP`);
    } else {
      columns.push(`${column} = ?`);
      values.push(value);
    }
  }

  const sql = `UPDATE products SET ${columns.join(", ")} WHERE product_id = ?`;
  values.push(id);

  return { sql, values };
}

async function handleColorAssociations(db: any, id: string, productData: any) {
  if (productData.is_customizable === 1 && Array.isArray(productData.colors)) {
    await db.run(`DELETE FROM product_colors WHERE product_id = ?`, [id]);

    if (productData.colors.length > 0) {
      for (const color of productData.colors) {
        if (color?.color_id) {
          await db.run(
            `INSERT OR REPLACE INTO product_colors (product_id, color_id) VALUES (?, ?)`,
            [id, color.color_id]
          );
        }
      }
    }
  }
}

async function handleProductImages(db: any, productData: any) {
  if (Array.isArray(productData.images)) {
    try {
      await db.run(
        `ALTER TABLE products_image ADD COLUMN color_id INTEGER NULL`
      );
    } catch (error) {
      // Column might already exist, continue
    }
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
