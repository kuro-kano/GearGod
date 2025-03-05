import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs/promises";
import { connectSQLite } from "@/lib/db";

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;

    console.log("📸 Image upload request received for product ID:", id);

    // Process the form data
    console.log("Parsing form data...");
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const colorId = formData.get("colorId") as string | null;

    console.log("Form data received:", {
      productId: id,
      colorId: colorId || "none (main product image)",
    });

    if (!file) {
      console.error("No file found in request");
      return NextResponse.json(
        { message: "No image file provided" },
        { status: 400 }
      );
    }

    // Log file details
    console.log("File details:", {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`,
    });

    // Convert file to buffer
    console.log("Converting file to buffer...");
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate filename - simplified to be more user-friendly
    const fileExt = path.extname(file.name) || ".jpg";
    const filename = `${Date.now()}${colorId ? `_color${colorId}` : ""}${fileExt}`;

    // Define paths with product-specific folder
    const publicDir = path.join(process.cwd(), "public");
    const productsBaseDir = path.join(publicDir, "images", "products");
    const productDir = path.join(productsBaseDir, id); // Create product-specific folder
    const filePath = path.join(productDir, filename);

    // Generate relative path for database storage
    const relativePath = path
      .join("products", id, filename)
      .replace(/\\/g, "/");

    console.log("Directory paths:", {
      publicDir,
      productsBaseDir,
      productDir,
      filePath,
      relativePath,
    });

    // Ensure product directory exists
    try {
      console.log("Ensuring product directory exists:", productDir);
      await fs.mkdir(productDir, { recursive: true });
      console.log("Directory confirmed");
    } catch (dirError) {
      console.error("Directory creation error:", dirError);
    }

    // Save the file
    try {
      console.log("Writing file to:", filePath);
      await fs.writeFile(filePath, buffer);
      console.log("File written successfully");
    } catch (fileError) {
      console.error("Error writing file:", fileError);
      return NextResponse.json(
        {
          message: "Failed to save image file",
          error:
            fileError instanceof Error ? fileError.message : String(fileError),
        },
        { status: 500 }
      );
    }

    // Update database - using relative path
    try {
      console.log("Updating database with relative path:", relativePath);
      const db = await connectSQLite();

      // First check if product exists
      const product = await db.get(
        "SELECT * FROM products WHERE product_id = ?",
        [id]
      );

      if (!product) {
        console.error("Product not found:", id);
        return NextResponse.json(
          { message: `Product with ID ${id} not found` },
          { status: 404 }
        );
      }

      // Check if products_image table has color_id column
      try {
        const tableInfo = await db.all("PRAGMA table_info(products_image)");
        if (!tableInfo.some(col => col.name === 'color_id')) {
          console.log("Adding color_id column to products_image table");
          await db.run("ALTER TABLE products_image ADD COLUMN color_id INTEGER NULL");
        }
      } catch (alterError) {
        console.error("Error checking/altering table:", alterError);
      }

      // Determine if this is a primary image
      let isPrimary = 0;
      if (!colorId) {
        // If it's not a color variant image, check if this is the first image
        const existingImages = await db.get(
          "SELECT COUNT(*) as count FROM products_image WHERE product_id = ?",
          [id]
        );
        isPrimary = existingImages.count === 0 ? 1 : 0;
      }

      // Insert into products_image table with relative path and color info
      await db.run(
        "INSERT INTO products_image (product_id, image_url, is_primary, color_id) VALUES (?, ?, ?, ?)",
        [id, relativePath, isPrimary, colorId ? parseInt(colorId) : null]
      );

      await db.close();
      console.log("Database updated successfully");
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        {
          message: "Failed to update product image record",
          error: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500 }
      );
    }

    // Return the image URL with /images prefix for browser access
    const publicImageUrl = `/images/${relativePath}`;
    console.log(
      "Image upload completed successfully. Public URL:",
      publicImageUrl
    );

    return NextResponse.json({
      message: "Image uploaded successfully",
      imageUrl: publicImageUrl,
      colorId: colorId ? parseInt(colorId) : null
    });
  } catch (error) {
    console.error("CRITICAL ERROR in image upload:", error);
    return NextResponse.json(
      {
        message: "Failed to upload image",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}