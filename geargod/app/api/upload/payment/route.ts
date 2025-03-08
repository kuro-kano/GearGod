import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const orderId = formData.get('orderId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename with timestamp and orderId
    const filename = `payment-${orderId}-${Date.now()}${path.extname(file.name)}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads/payments');
    
    // Save file to public/uploads/payments directory
    await writeFile(path.join(uploadDir, filename), buffer);
    
    return NextResponse.json({ 
      success: true, 
      filename: `/uploads/payments/${filename}` 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}