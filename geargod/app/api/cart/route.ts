import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';

interface CartItem {
  product_id: string;
  product_name: string;  // Added to match frontend
  price: number;         // Added to match frontend
  quantity: number;
  image_url?: string;    // Added to match frontend
  color?: {
    color_name: string;
    color_code: string;
    add_price: number;
  };
}

// In-memory cart storage
const carts = new Map<string, CartItem[]>();

// Helper function to get user ID
async function getUserId() {
  const session = await getServerSession();
  const cookieStore = await cookies();
  const guestId = cookieStore.get('guestId')?.value;
  return session?.user?.id || guestId || 'guest';
}

export async function GET() {
  const userId = await getUserId();
  const cart = carts.get(userId) || [];
  // console.log('GET cart:', { userId, cart });
  return NextResponse.json(cart);
}

export async function POST(req: Request) {
  const userId = await getUserId();
  const data = await req.json() as CartItem;
  
  if (!data.product_id || typeof data.quantity !== 'number') {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }

  const cart = carts.get(userId) || [];
  const existingItemIndex = cart.findIndex(
    (item) => item.product_id === data.product_id
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += data.quantity;
  } else {
    cart.push(data);
  }

  carts.set(userId, cart);
  return NextResponse.json(cart);
}

export async function PUT(req: Request) {
  const userId = await getUserId();
  const { product_id, quantity } = await req.json();
  
  if (!product_id || typeof quantity !== 'number') {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }

  const cart = carts.get(userId) || [];
  const itemIndex = cart.findIndex((item) => item.product_id === product_id);
  
  if (itemIndex > -1) {
    cart[itemIndex].quantity = quantity;
    carts.set(userId, cart);
    return NextResponse.json(cart);
  }

  return NextResponse.json({ error: "Item not found" }, { status: 404 });
}

export async function DELETE(req: Request) {
  try {
    const userId = await getUserId();
    const url = new URL(req.url);
    const productId = url.searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const cart = carts.get(userId) || [];
    const itemExists = cart.some(item => String(item.product_id) === String(productId));

    if (!itemExists) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    const updatedCart = cart.filter(
      item => String(item.product_id) !== String(productId)
    );
    
    carts.set(userId, updatedCart);
    
    return NextResponse.json({ 
      message: "Item removed successfully",
      cart: updatedCart 
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
