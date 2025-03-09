import { NextResponse } from 'next/server';
import { connectSQLite } from '@/lib/db';

export async function POST(request: Request) {
  const db = await connectSQLite();
  
  try {
    const {
      user_id,
      total_amount,
      first_name,
      last_name,
      phone,
      shipping_address,
      payment_method,
      cart_items
    } = await request.json();

    // Start transaction
    await db.run('BEGIN TRANSACTION');

    // Insert order
    const orderResult = await db.run(`
      INSERT INTO orders (
        user_id, total_amount, first_name, last_name, phone, 
        shipping_address, payment_method, order_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id || null, total_amount, first_name, last_name, phone, 
       shipping_address, payment_method, 'pending']
    );

    const orderId = orderResult.lastID;

    // Process each cart item
    for (const item of cart_items) {
      if (item.category === "Computer-Cases") {
        // Create custom design first
        const designResult = await db.run(`
          INSERT INTO custom_designs (
            user_id, product_id, color_id, material_id
          ) VALUES (?, ?, ?, ?)`,
          [user_id || null, item.product_id, 
           item.color_id, item.material_id]
        );

        // Create order item with the design_id
        await db.run(`
          INSERT INTO order_items (
            order_id, design_id, quantity, unit_price, subtotal
          ) VALUES (?, ?, ?, ?, ?)`,
          [orderId, designResult.lastID, 
           item.quantity, item.unit_price, item.subtotal]
        );
      } else {
        // For non-custom products, use product_color_id directly
        await db.run(`
          INSERT INTO order_items (
            order_id, product_color_id, quantity, unit_price, subtotal
          ) VALUES (?, ?, ?, ?, ?)`,
          [orderId, item.product_color_id, 
           item.quantity, item.unit_price, item.subtotal]
        );
      }
    }

    // Commit transaction
    await db.run('COMMIT');

    return NextResponse.json({ 
      success: true, 
      orderId: orderId 
    });
  } catch (error) {
    // Rollback on error
    await db.run('ROLLBACK');
    console.error('Error processing order:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to process order' 
    }, { status: 500 });
  }
}
