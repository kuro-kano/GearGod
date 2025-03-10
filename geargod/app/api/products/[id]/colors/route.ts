import { NextRequest, NextResponse } from "next/server";
import { connectSQLite } from "@/lib/db";

// Mock data for development
const getMockProductColors = (productId: string) => {
  // Return 2-3 colors for mock data to simulate different products having different colors
  const productNumericId = parseInt(productId) || 1;
  const offset = productNumericId % 3; // 0, 1, or 2
  
  return [
    { color_id: 1 + offset, color_name: offset === 0 ? 'Black' : offset === 1 ? 'White' : 'Red', 
      color_code: offset === 0 ? '#000000' : offset === 1 ? '#FFFFFF' : '#FF0000', add_price: offset * 50 },
    { color_id: 4 - offset, color_name: offset === 0 ? 'Blue' : offset === 1 ? 'Green' : 'Purple', 
      color_code: offset === 0 ? '#0000FF' : offset === 1 ? '#00FF00' : '#800080', add_price: 50 + offset * 25 }
  ];
};

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const productId = context.params.id;

  try {
    const db = await connectSQLite();
    
    // Check if product_colors table exists
    const tableCheck = await db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='product_colors'`);
    
    if (!tableCheck) {
      console.log("product_colors table doesn't exist yet. Creating it.");
      
      // Create product_colors junction table
      await db.exec(`
        CREATE TABLE product_colors (
          product_id TEXT NOT NULL,
          color_id INTEGER NOT NULL,
          PRIMARY KEY (product_id, color_id)
        )
      `);
      
      // Create the product_images table if it doesn't exist and add color_id column
      const imagesTableCheck = await db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='product_images'`);
      
      if (!imagesTableCheck) {
        await db.exec(`
          CREATE TABLE product_images (
            image_id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id TEXT NOT NULL,
            image_url TEXT NOT NULL,
            is_primary INTEGER DEFAULT 0,
            color_id INTEGER NULL
          )
        `);
      } else {
        // Check if color_id column exists
        try {
          await db.get(`SELECT color_id FROM product_images LIMIT 1`);
        } catch {
          // Column doesn't exist, add it
          await db.exec(`ALTER TABLE product_images ADD COLUMN color_id INTEGER NULL`);
        }
      }
      
      // Return mock data for the first request
      return NextResponse.json(getMockProductColors(productId), { status: 200 });
    }
    
    // Query colors associated with this product
    const productColors = await db.all(`
      SELECT c.color_id, c.color_name, c.color_code, c.add_price
      FROM colors c
      INNER JOIN product_colors pc ON c.color_id = pc.color_id
      WHERE pc.product_id = ?
    `, [productId]);
    
    return NextResponse.json(productColors, { status: 200 });
    
  } catch (error) {
    console.error(`Error fetching colors for product ${productId}:`, error);
    
    // In development, return mock data if there's an error
    if (process.env.NODE_ENV === 'development') {
      console.log("Using mock product color data due to database error");
      return NextResponse.json(getMockProductColors(productId), { status: 200 });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch product colors' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const productId = context.params.id;
  
  try {
    const data = await request.json();
    const { colors } = data; // Expecting an array of color_ids
    
    if (!colors || !Array.isArray(colors)) {
      return NextResponse.json(
        { error: 'Invalid request format. Expected an array of color IDs' },
        { status: 400 }
      );
    }
    
    const db = await connectSQLite();
    
    // Delete existing product color associations
    await db.run(`DELETE FROM product_colors WHERE product_id = ?`, [productId]);
    
    // Add new product color associations
    if (colors.length > 0) {
      const stmt = await db.prepare(`INSERT INTO product_colors (product_id, color_id) VALUES (?, ?)`);
      
      for (const colorId of colors) {
        await stmt.run(productId, colorId);
      }
      
      await stmt.finalize();
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch (error) {
    console.error(`Error updating colors for product ${productId}:`, error);
    return NextResponse.json(
      { error: 'Failed to update product colors' },
      { status: 500 }
    );
  }
}