import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  console.log('Started processing upload request');
  
  try {
    const formData = await request.formData();
    console.log('FormData received');

    const file = formData.get('slip');
    console.log('File from form:', file);

    if (!file || !(file instanceof File)) {
      console.log('No valid file received');
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Create nested directory structure
    const baseDir = path.join(process.cwd(), 'public');
    const uploadsDir = path.join(baseDir, 'uploads');
    const paymentsDir = path.join(uploadsDir, 'payments');
    
    // Create directories if they don't exist
    try {
      await mkdir(baseDir, { recursive: true });
      await mkdir(uploadsDir, { recursive: true });
      await mkdir(paymentsDir, { recursive: true });
      console.log('Directories created:', paymentsDir);
    } catch (err) {
      console.error('Error creating directories:', err);
      throw new Error('Failed to create upload directories');
    }

    // Generate safe filename
    const timestamp = Date.now();
    const safeFileName = `payment-${timestamp}.jpg`;
    const filePath = path.join(paymentsDir, safeFileName);
    
    console.log('Saving file to:', filePath);

    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      console.log('File saved successfully');
    } catch (err) {
      console.error('Error writing file:', err);
      throw new Error('Failed to save file');
    }

    return NextResponse.json({
      success: true,
      message: 'Payment slip uploaded successfully',
      path: `/uploads/payments/${safeFileName}`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500 }
    );
  }
}