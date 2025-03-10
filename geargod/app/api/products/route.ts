// app/api/products/route.ts
import { connectSQLite } from "@/lib/db"; 
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
    
    // Fetch product images for each product
    const enhancedProducts = await Promise.all(
      products.map(async (product) => {
        // Get product images from products_image table
        const images = await db.all(
          `SELECT * FROM products_image WHERE product_id = ? ORDER BY is_primary DESC`,
          [product.product_id]
        );
        
        console.log(`Product ${product.product_id} has ${images.length} images`);
        
        return {
          ...product,
          images: images.length > 0 ? images : [],
          // Keep existing image_url for backward compatibility
          image_url: product.image_url || (images.length > 0 ? images[0].image_url : null)
        };
      })
    );

    await db.close();

    console.log(`Enhanced ${enhancedProducts.length} products with image data`);
    return NextResponse.json(enhancedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching products" },
      { status: 500 }
    );
  }
}

// POST new product - keep existing implementation
export async function POST(req: Request) {
  try {
    const db = await connectSQLite();
    
    // Begin transaction
    await db.run('BEGIN TRANSACTION');

    try {
      const {
        product_id, // from futureProductId
        product_name,
        description,
        category_id,
        price,
        stock_quantity,
        is_customizable,
        tags,
        images, // Array of ProductImage objects
        colors // Array of ColorVariant objects
      } = await req.json();

      // Validate required fields
      if (!product_name || price === undefined) {
        return NextResponse.json(
          { message: "Product name and price are required" },
          { status: 400 }
        );
      }

      // 1. Insert product
      const result = await db.run(`
        INSERT INTO products (
          product_id, product_name, description, category_id, 
          price, stock_quantity, is_customizable, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        product_id,
        product_name,
        description || null,
        category_id || null,
        price,
        stock_quantity || 0,
        is_customizable ? 1 : 0,
        tags || null
      ]);

      // 2. Insert images
      if (images && images.length > 0) {
        const imageInsertQuery = `
          INSERT INTO products_image (
            product_id, image_url, is_primary, color_id
          ) VALUES (?, ?, ?, ?)
        `;

        for (const image of images) {
          await db.run(imageInsertQuery, [
            product_id,
            image.image_url,
            image.is_primary,
            image.color_id || null
          ]);
        }
      }

      // 3. Insert color variants if product is customizable
      if (colors && colors.length > 0) {
        const colorInsertQuery = `
          INSERT INTO product_colors (product_id, color_id)
          VALUES (?, ?)
        `;

        for (const color of colors) {
          await db.run(colorInsertQuery, [
            product_id,
            color.color_id
          ]);
        }
      }

      // Commit transaction
      await db.run('COMMIT');

      // Get the complete product data
      const newProduct = await db.get(
        "SELECT * FROM products WHERE product_id = ?",
        [product_id]
      );

      await db.close();

      return NextResponse.json(
        { message: "Product created successfully", product: newProduct },
        { status: 201 }
      );

    } catch (error) {
      // Rollback on error
      await db.run('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { 
        message: "An error occurred while creating the product",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
