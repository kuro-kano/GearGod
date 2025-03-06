"use client";

import { useEffect, useState } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";
import Image from "next/image";
import { Minus, Plus, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@heroui/react";
import ProgressCheckout from "@/components/ProgressCheckout";
import Link from "next/link";

// Define Cart Item interface
interface CartItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

// Define the step interface
interface Step {
  name: string;
  href: string;
  status: "complete" | "current" | "upcoming";
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define the steps for the checkout process
  const steps: Step[] = [
    { name: "SHOPPING CART", href: "/cart", status: "current" },
    { name: "CHECKOUT", href: "/checkout", status: "upcoming" },
    { name: "FINISH", href: "/finish", status: "upcoming" },
  ];

  // Calculate total price
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Fetch cart items when component mounts
  useEffect(() => {
    async function fetchCartItems() {
      try {
        // Dummy data แทนการเรียก API
        const dummyData: CartItem[] = [
          {
            product_id: "1",
            product_name: "Mechanical Keyboard RGB",
            price: 2990,
            quantity: 1,
            image_url: "/images/keyboard.jpg" // ใส่path รูปจริงของคุณ
          },
          {
            product_id: "2",
            product_name: "Gaming Mouse 16000DPI",
            price: 1590,
            quantity: 2,
            image_url: "/images/mouse.jpg" // ใส่path รูปจริงของคุณ
          },
          {
            product_id: "3",
            product_name: "Gaming Headset 7.1",
            price: 3290,
            quantity: 1,
            image_url: "/images/headset.jpg" // ใส่path รูปจริงของคุณ
          }
        ];

        setCartItems(dummyData);
        setLoading(false);
      } catch (err) {
        setError("Error loading cart items");
        console.error("Error fetching cart:", err);
      }
    }

    fetchCartItems();
  }, []);

  // Handle quantity changes
  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");

      setCartItems((prev) =>
        prev.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Handle item removal
  const removeItem = async (productId: string) => {
    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove item");

      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== productId)
      );
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <main className="ambient-bg min-h-screen">
      <div className="pt-40 pl-48">
        <BreadCrumbs />
      </div>

      <div className="px-48 py-8">
        {/* Use the CheckoutStepper component */}
        <ProgressCheckout steps={steps} />

        <div className="bg-[#1D1C21] rounded-md p-6 shadow-foreground-700 backdrop-filter backdrop-blur-sm bg-opacity-60">
          <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

          {loading ? (
            <div className="text-center py-8">Loading cart...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p>Your cart is empty</p>
              <Button
                color="primary"
                className="mt-4"
                onClick={() => window.location.href = '/shop'}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.product_id} className="flex items-center gap-4 p-4 bg-black/20 rounded-lg">
                    <div className="w-24 h-24 relative">
                      <Image
                        src={item.image_url || '/placeholder.png'}
                        alt={item.product_name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product_name}</h3>
                      <p className="text-gray-400">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        isIconOnly
                        variant="ghost"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <Button
                        isIconOnly
                        variant="ghost"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="w-24 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <Button
                      isIconOnly
                      color="danger"
                      variant="ghost"
                      onClick={() => removeItem(item.product_id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="mt-8 border-t border-gray-700 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg">Total</span>
                  <span className="text-2xl font-bold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => window.location.href = '/shop'}
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => window.location.href = '/checkout'}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
