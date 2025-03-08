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
    // const result = await db.run(sql, values);

    // Handle color associations if product is customizable
    if (productData.is_customizable === 1 && productData.colors && Array.isArray(productData.colors)) {
      console.log("Processing color variants for customizable product");
      
      try {
        // Check if product_colors table exists
        const tableCheck = await db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='product_colors'`);
        
        if (!tableCheck) {
          console.log("Creating product_colors table");
          // Create product_colors junction table
          await db.exec(`
            CREATE TABLE product_colors (
              product_id TEXT NOT NULL,
              color_id INTEGER NOT NULL,
              PRIMARY KEY (product_id, color_id)
            )
          `);
        }
        
        // Delete existing color associations
        await db.run(`DELETE FROM product_colors WHERE product_id = ?`, [id]);
        
        // Add new color associations
        if (productData.colors.length > 0) {
          console.log(`Adding ${productData.colors.length} colors for product ${id}`);
          
          for (const color of productData.colors) {
            if (color && color.color_id) {
              await db.run(
                `INSERT OR REPLACE INTO product_colors (product_id, color_id) VALUES (?, ?)`, 
                [id, color.color_id]
              );
            }
          }
        }
      } catch (colorError) {
        console.error("Error handling color associations:", colorError);
        // Continue with the response, but log the error
      }
    }

    // Handle product images with color associations (for future implementation)
    if (productData.images && Array.isArray(productData.images)) {
      console.log(`Processing ${productData.images.length} images`);
      
      try {
        // Check if color_id column exists in products_image table
        try {
          await db.get(`PRAGMA table_info(products_image)`);
          
          // Add color_id column if it doesn't exist
          try {
            await db.run(`ALTER TABLE products_image ADD COLUMN color_id INTEGER NULL`);
            console.log("Added color_id column to products_image table");
          } catch {
            // Column might already exist, continue
          }
        } catch {
          console.log("products_image table might not exist yet");
        }
      } catch (imageError) {
        console.error("Error handling image updates:", imageError);
        // Continue with the response, but log the error
      }
    }

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