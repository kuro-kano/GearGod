import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { connectSQLite } from '@/lib/db';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const productId = formData.get('productId') as string;
    const file = formData.get('file') as File;
    
    if (!file || !productId) {
      return NextResponse.json(
        { error: "Missing file or product ID" },
        { status: 400 }
      );
    }
    
    // Create directory structure if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public/images/products', productId);
    await mkdir(uploadDir, { recursive: true });
    
    // Get file extension and create filename
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `main.${fileExt}`;
    const filePath = path.join(uploadDir, fileName);
    
    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    // Update product in database
    const db = await connectSQLite();
    const relativePath = `products/${productId}/main.${fileExt}`;
    
    await db.run(
      'UPDATE products SET image_url = ? WHERE product_id = ?',
      [relativePath, productId]
    );
    
    await db.close();
    
    return NextResponse.json({
      success: true,
      imageUrl: `/images/${relativePath}`
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}