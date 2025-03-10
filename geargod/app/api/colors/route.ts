import { NextResponse } from 'next/server';
import { connectSQLite } from '@/lib/db';

// Mock data to use until database table exists
const mockColors = [
  { color_id: 1, color_name: 'Black', color_code: '#000000', add_price: 0 },
  { color_id: 2, color_name: 'White', color_code: '#FFFFFF', add_price: 0 },
  { color_id: 3, color_name: 'Red', color_code: '#FF0000', add_price: 50 },
  { color_id: 4, color_name: 'Blue', color_code: '#0000FF', add_price: 50 },
  { color_id: 5, color_name: 'Green', color_code: '#00FF00', add_price: 75 },
  { color_id: 6, color_name: 'Purple', color_code: '#800080', add_price: 100 },
];

export async function GET() {
  try {
    const db = await connectSQLite();
    
    // Check if colors table exists
    const tableCheck = await db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='colors'`);
    
    if (!tableCheck) {
      console.log("Colors table doesn't exist yet. Creating it and adding sample data.");
      
      // Create the colors table
      await db.exec(`
        CREATE TABLE colors (
          color_id INTEGER PRIMARY KEY AUTOINCREMENT,
          color_name TEXT NOT NULL,
          color_code TEXT NOT NULL,
          add_price REAL NOT NULL DEFAULT 0
        )
      `);
      
      // Insert sample data
      for (const color of mockColors) {
        await db.run(
          `INSERT INTO colors (color_id, color_name, color_code, add_price) VALUES (?, ?, ?, ?)`,
          [color.color_id, color.color_name, color.color_code, color.add_price]
        );
      }
      
      // Return the mock data we just inserted
      return NextResponse.json(mockColors, { status: 200 });
    }
    
    // If the table exists, query the colors
    const colors = await db.all('SELECT color_id, color_name, color_code, add_price FROM colors ORDER BY color_name');
    return NextResponse.json(colors, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching colors:', error);
    
    // In development, return mock data if there's an error
    if (process.env.NODE_ENV === 'development') {
      console.log("Using mock color data due to database error");
      return NextResponse.json(mockColors, { status: 200 });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch colors' },
      { status: 500 }
    );
  }
}