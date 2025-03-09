import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tempOrderId = Date.now().toString(); // ใช้ timestamp เป็น temp ID

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `payment-${tempOrderId}${path.extname(file.name)}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads/payments');
    const filePath = `/uploads/payments/${filename}`;
    
    // Save file
    await writeFile(path.join(uploadDir, filename), buffer);
    
    return NextResponse.json({ 
      success: true, 
      filename: filePath // ส่ง path กลับไปเก็บไว้ใน state
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}