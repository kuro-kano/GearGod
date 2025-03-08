"use client";

import { useEffect, useState } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@heroui/react";
import ProgressCheckout from "@/components/ProgressCheckout";

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
        const response = await fetch('/api/cart');
        if (!response.ok) {
          throw new Error('Failed to fetch cart items');
        }
        const data = await response.json();
        setCartItems(data);
        setLoading(false);
      } catch (err) {
        setError("Error loading cart items");
        console.error("Error fetching cart:", err);
        setLoading(false);
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
      <div className="pt-20 md:pt-28 lg:pt-40 px-4 sm:px-6 md:px-8 lg:px-48">
        <BreadCrumbs />
      </div>

      <div className="px-4 sm:px-6 md:px-8 lg:px-48 py-4 md:py-8">
        {/* Use the CheckoutStepper component */}
        <ProgressCheckout steps={steps} />

        <div className="bg-[#1D1C21] rounded-md p-4 md:p-6 shadow-foreground-700 backdrop-filter backdrop-blur-sm bg-opacity-60">
          <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center sm:text-left">Shopping Cart</h1>

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
                onPress={() => window.location.href = '/shop'}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 md:space-y-6">
                {cartItems.map((item) => (
                  <div key={item.product_id} className="flex flex-col sm:flex-row items-center p-3 md:p-4 bg-black/20 rounded-lg">
                    <div className="w-20 h-20 md:w-24 md:h-24 relative mb-3 sm:mb-0 sm:mr-4">
                      <Image
                        src={item.image_url || '/placeholder.png'}
                        alt={item.product_name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left mb-3 sm:mb-0">
                      <h3 className="font-medium">{item.product_name}</h3>
                      <p className="text-gray-400">฿{item.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mb-3 sm:mb-0">
                        <Button
                          isIconOnly
                          variant="ghost"
                          onPress={() => updateQuantity(item.product_id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 md:w-12 text-center">{item.quantity}</span>
                        <Button
                          isIconOnly
                          variant="ghost"
                          onPress={() => updateQuantity(item.product_id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Item total price */}
                      <div className="text-center sm:text-right mb-3 sm:mb-0 sm:w-24">
                        ฿{(item.price * item.quantity).toFixed(2)}
                      </div>
                      
                      {/* Remove button */}
                      <Button
                        isIconOnly
                        color="danger"
                        variant="ghost"
                        onPress={() => removeItem(item.product_id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="mt-6 md:mt-8 border-t border-gray-700 pt-4 md:pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg">Total</span>
                  <span className="text-xl md:text-2xl font-bold">฿{total.toFixed(2)}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onPress={() => window.location.href = '/shop'}
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    color="primary"
                    className="w-full"
                    onPress={() => window.location.href = '/checkout'}
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