// app/api/products/[id]/route.ts
import { connectSQLite } from "@/lib/db"; // Use shared DB connection
import { NextResponse } from "next/server";

// GET product by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    const db = await connectSQLite();
    
    // Get the product with additional category information via JOIN
    const product = await db.get(`
      SELECT p.*, c.category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `, [productId]);
    
    await db.close();
    
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the product" },
      { status: 500 }
    );
  }
}

// UPDATE product
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const {
      product_name,
      description,
      category_id,
      price,
      stock_quantity,
      is_customizable,
      tags
    } = await req.json();
    
    const db = await connectSQLite();
    
    // Check if product exists
    const existingProduct = await db.get(
      "SELECT * FROM products WHERE product_id = ?",
      [productId]
    );
    
    if (!existingProduct) {
      await db.close();
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    
    // Check if category exists if category_id is provided
    if (category_id !== undefined && category_id !== null) {
      const categoryExists = await db.get(
        "SELECT category_id FROM categories WHERE category_id = ?",
        [category_id]
      );
      
      if (!categoryExists) {
        await db.close();
        return NextResponse.json(
          { message: "Invalid category ID" },
          { status: 400 }
        );
      }
    }
    
    // Validate price if provided
    if (price !== undefined && (isNaN(price) || price < 0)) {
      await db.close();
      return NextResponse.json(
        { message: "Price must be a valid non-negative number" },
        { status: 400 }
      );
    }
    
    // Validate stock quantity if provided
    if (stock_quantity !== undefined && (isNaN(stock_quantity) || stock_quantity < 0)) {
      await db.close();
      return NextResponse.json(
        { message: "Stock quantity must be a valid non-negative number" },
        { status: 400 }
      );
    }
    
    const query = `
      UPDATE products
      SET product_name = ?,
          description = ?,
          category_id = ?,
          price = ?,
          stock_quantity = ?,
          is_customizable = ?,
          tags = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE product_id = ?;
    `;
    
    await db.run(
      query,
      [
        product_name || existingProduct.product_name,
        description !== undefined ? description : existingProduct.description,
        category_id !== undefined ? category_id : existingProduct.category_id,
        price !== undefined ? price : existingProduct.price,
        stock_quantity !== undefined ? stock_quantity : existingProduct.stock_quantity,
        is_customizable !== undefined ? (is_customizable ? 1 : 0) : existingProduct.is_customizable,
        tags !== undefined ? tags : existingProduct.tags,
        productId
      ]
    );
    
    // Get updated product with category info
    const updatedProduct = await db.get(`
      SELECT p.*, c.category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `, [productId]);
    
    await db.close();
    
    return NextResponse.json({
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the product" },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    const db = await connectSQLite();
    
    // Check if product exists
    const existingProduct = await db.get(
      "SELECT * FROM products WHERE product_id = ?",
      [productId]
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
    
    await db.run(
      "DELETE FROM products WHERE product_id = ?",
      [productId]
    );
    
    await db.close();
    
    return NextResponse.json({
      message: "Product deleted successfully",
      deleted_product_id: productId
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the product" },
      { status: 500 }
    );
  }
}