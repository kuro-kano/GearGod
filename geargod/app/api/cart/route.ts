import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";

interface CartItem {
  product_id: string;
  product_name: string; // Added to match frontend
  price: number; // Added to match frontend
  quantity: number;
  image_url?: string; // Added to match frontend
  category?: string; // Added category property
  color?: {
    id: number; // Add this
    color_name: string;
    color_code: string;
    add_price: number;
  };
  material?: {
    id: number; // Add this
    name: string;
    add_price: number;
  };
  components?: Array<{
    id: number; // Add this
    name: string;
    add_price: number;
  }>;
}

// In-memory cart storage
const carts = new Map<string, CartItem[]>();

// Helper function to get user ID
async function getUserId() {
  const session = await getServerSession();
  const cookieStore = await cookies();
  const guestId = cookieStore.get("guestId")?.value;
  return session?.user?.id || guestId || "guest";
}

export async function GET() {
  const userId = await getUserId();
  const cart = carts.get(userId) || [];
  // console.log('GET cart:', { userId, cart });
  return NextResponse.json(cart);
}

export async function POST(req: Request) {
  const userId = await getUserId();
  const data = (await req.json()) as CartItem;

  console.log("Received cart item:", data); // Add this for debugging

  if (!data.product_id || typeof data.quantity !== "number") {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }

  // Format incoming data to ensure IDs are properly structured
  const formattedItem = {
    ...data,
    category: data.category, // Preserve category
    material: data.material && {
      id: data.material.id,
      name: data.material.name,
      add_price: data.material.add_price,
    },
    color: data.color && {
      id: data.color.id,
      color_name: data.color.color_name,
      color_code: data.color.color_code,
      add_price: data.color.add_price,
    },
    components: data.components?.map((comp) => ({
      id: comp.id,
      name: comp.name,
      add_price: comp.add_price,
    })),
  };

  const cart = carts.get(userId) || [];
  const existingItemIndex = cart.findIndex(
    (item) =>
      item.product_id === formattedItem.product_id &&
      JSON.stringify(item.color) === JSON.stringify(formattedItem.color) &&
      JSON.stringify(item.material) ===
        JSON.stringify(formattedItem.material) &&
      JSON.stringify(item.components) ===
        JSON.stringify(formattedItem.components)
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += formattedItem.quantity;
  } else {
    cart.push(formattedItem);
  }

  carts.set(userId, cart);
  return NextResponse.json(cart);
}

export async function PUT(req: Request) {
  const userId = await getUserId();
  const { product_id, quantity } = await req.json();

  if (!product_id || typeof quantity !== "number") {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
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
    const productId = url.searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const cart = carts.get(userId) || [];
    const itemExists = cart.some(
      (item) => String(item.product_id) === String(productId)
    );

    if (!itemExists) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    const updatedCart = cart.filter(
      (item) => String(item.product_id) !== String(productId)
    );

    carts.set(userId, updatedCart);

    return NextResponse.json({
      message: "Item removed successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// เพิ่มฟังก์ชันใหม่สำหรับล้าง cart
export async function PATCH() {
  const userId = await getUserId();
  carts.delete(userId);
  return NextResponse.json({
    success: true,
    message: "Cart cleared successfully",
  });
}
