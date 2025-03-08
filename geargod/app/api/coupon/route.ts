import { NextResponse } from 'next/server';
import { connectSQLite } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    const db = await connectSQLite();
    
    const query = `
      SELECT * FROM coupons
      WHERE coupon_code = ?
      AND is_active = 1
    `;
    
    const coupon = await db.get(query, [code]);
    await db.close();

    if (!coupon) {
      return NextResponse.json({ 
        valid: false,
        message: 'Invalid or expired coupon code' 
      });
    }

    return NextResponse.json({ 
      valid: true, 
      type: coupon.discount_type,
      discount: coupon.discount_value,
      message: 'Coupon applied successfully' 
    });

  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ 
      valid: false, 
      message: 'Error validating coupon' 
    }, { status: 500 });
  }
}