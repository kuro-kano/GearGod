"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BreadCrumbs from "@/components/BreadCrumbs";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@heroui/react";
import ProgressCheckout from "@/components/ProgressCheckout";

interface CartItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image_url?: string;
  color?: {
    color_name: string;
    color_code: string;
    add_price: number;
  };
}

interface Step {
  name: string;
  href: string;
  status: "complete" | "current" | "upcoming";
}

export default function Cart() {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const steps: Step[] = [
    { name: "SHOPPING CART", href: "/cart", status: "current" },
    { name: "CHECKOUT", href: "/checkout", status: "upcoming" },
    { name: "FINISH", href: "/finish", status: "upcoming" },
  ];

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
          product_id: productId,
          quantity: newQuantity 
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update quantity");
      }

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


  const removeItem = async (productId: string) => {
    try {
      const response = await fetch(`/api/cart?productId=${productId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove item");
      }

      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== productId)
      );
    } catch (error) {
      console.error("Error removing item:", error);
      setError("Failed to remove item from cart");
    }
  };

  const handleCheckout = () => {
    if (!session) {
      window.location.href = '/login';
    } else {
      window.location.href = '/checkout';
    }
  };

  return (
    <main className="dark ambient-bg min-h-screen text-white">
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
                      {item.color && (
                        <p className="text-sm text-gray-400">
                          Color: {item.color.color_name}
                        </p>
                      )}
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
              <div className="mt-6 md:mt-8 border-t border-gray-700 pt-4 md:pt-6 font-kanit-regular">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg">ราคา</span>
                  <span className="text-xl md:text-2xl font-bold">฿{total.toFixed(2)}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onPress={() => window.location.href = '/shop'}
                  >
                    เลือกสินค้าเพิ่ม
                  </Button>
                  <Button
                    color="primary"
                    className="w-full"
                    onPress={handleCheckout}
                  >
                    จ่ายเงิน
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