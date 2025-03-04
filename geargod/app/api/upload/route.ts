import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const productId = formData.get("productId") as string;

    if (!file || !productId) {
      return NextResponse.json(
        { error: "File or product ID is missing" },
        { status: 400 }
      );
    }

    // Create directory for product if it doesn't exist
    const productDir = path.join(
      process.cwd(),
      "public",
      "images",
      "products",
      productId
    );
    await mkdir(productDir, { recursive: true });

    // Create a unique filename
    const filename = `${Date.now()}_${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(productDir, filename);

    // Save the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return the public URL
    const imageUrl = `/images/products/${productId}/${filename}`;

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
