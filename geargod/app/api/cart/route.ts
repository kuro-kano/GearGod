import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';

// In-memory cart storage
const carts = new Map();

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
  return NextResponse.json(cart);
}

export async function POST(req: Request) {
  const userId = await getUserId();
  const data = await req.json();
  const cart = carts.get(userId) || [];

  const existingItemIndex = cart.findIndex(
    (item: any) => item.product_id === data.product_id
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
  const data = await req.json();
  const cart = carts.get(userId) || [];

  const itemIndex = cart.findIndex((item: any) => item.product_id === data.productId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity = data.quantity;
    carts.set(userId, cart);
    return NextResponse.json(cart);
  }

  return NextResponse.json({ error: "Item not found" }, { status: 404 });
}

export async function DELETE(req: Request) {
  const userId = await getUserId();
  const url = new URL(req.url);
  const productId = url.searchParams.get('productId');
  const cart = carts.get(userId) || [];

  const updatedCart = cart.filter((item: any) => item.product_id !== productId);
  carts.set(userId, updatedCart);
  return NextResponse.json(updatedCart);
}
