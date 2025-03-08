"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { showToast } from './ToastAlert';

interface CartItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

const CheckoutForm = () => {
  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setIsApplyingDiscount(true);
    try {
      const response = await fetch('/api/coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: discountCode }),
      });

      const data = await response.json();

      if (data.valid) {
        if (data.type === "percentage") {
          setDiscount(data.discount / 100 * cartItems.reduce((total, item) => total + (item.price * item.quantity), 0));
        } else if (data.type === "fixed") {
          setDiscount(data.discount);
        }
        showToast({
          title: "Coupon Applied",
          description: data.message,
          color: "success"
        });
      } else {
        setDiscount(0);
        showToast({
          title: "Invalid Coupon",
          description: data.message,
          color: "danger"
        });
      }
    } catch {
      setDiscount(0);
      showToast({
        title: "Error",
        description: "Failed to apply coupon",
        color: "danger"
      });
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalAfterDiscount = subtotal - discount;
    return Math.max(totalAfterDiscount, 0).toFixed(2);
  };

  const handleDeliveryMethodChange = (method: string) => {
    setDeliveryMethod(method);
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  return (
    <div className="bg-[#1D1C21] rounded-md p-6 shadow-foreground-700 backdrop-filter backdrop-blur-sm bg-opacity-60">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Order Summary Section */}
      <div className="space-y-6 mb-8">
        {isLoading ? (
          <div className="text-center py-4">Loading cart items...</div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-4">Your cart is empty</div>
        ) : (
          cartItems.map((item) => (
            <div key={item.product_id} className="flex items-center gap-4 p-4 bg-black/20 rounded-lg">
              <Image
                width={96}
                height={96}
                src={item.image_url || '/placeholder-image.jpg'}
                alt={item.product_name}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product_name}</h3>
                <p className="text-gray-400">฿{item.price.toFixed(2)}</p>
              </div>
              <div className="text-center mx-4">
                <p className="text-sm text-gray-400">Quantity</p>
                <p className="font-medium">{item.quantity}</p>
              </div>
              <div className="w-24 text-right">
                <p className="text-sm text-gray-400">Price</p>
                <p className="font-medium">฿{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Payment Details Section */}
      <div className="space-y-6">
        {/* Payment Method */}
        <div className="space-y-2">
          <h3 className="font-medium mb-3">Payment Method</h3>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="paymentMethod"
                checked={paymentMethod === 'cash'}
                onChange={() => handlePaymentMethodChange('cash')}
                className="form-radio text-blue-600" 
              />
              <span className="text-gray-300">Cash</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'promptpay'}
                onChange={() => handlePaymentMethodChange('promptpay')}
                className="form-radio text-blue-600" 
              />
              <span className="text-gray-300">QR Promptpay</span>
            </label>
          </div>
        </div>

        {/* Delivery Address Section */}
        <div className="space-y-4">
          <h3 className="font-medium mb-3">Delivery Information</h3>
          
          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="p-3 rounded bg-black/20 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="p-3 rounded bg-black/20 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 rounded bg-black/20 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          {deliveryMethod === 'home' && (
            <textarea 
              className="w-full p-3 rounded bg-black/20 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your delivery address"
              rows={4}
            ></textarea>
          )}

          <div className="flex gap-4 mt-4">
            <button 
              className={`flex-1 py-2 rounded transition-colors ${
                deliveryMethod === 'home' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-black/20 text-gray-300'
              }`}
              onClick={() => handleDeliveryMethodChange('home')}
            >
              Home Delivery
            </button>
            <button 
              className={`flex-1 py-2 rounded transition-colors ${
                deliveryMethod === 'store' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-black/20 text-gray-300'
              }`}
              onClick={() => handleDeliveryMethodChange('store')}
            >
              Store Pickup
            </button>
          </div>
        </div>

        {/* Total Section */}
        <div className="space-y-4 pt-6 border-t border-gray-700">
          {/* Discount Code Section - Moved here */}
          <div className="flex gap-4 items-center">
            <input 
              type="text" 
              placeholder="Enter discount code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              className="flex-1 p-2 rounded bg-black/20 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button 
              onClick={handleApplyDiscount}
              disabled={isApplyingDiscount || !discountCode.trim()}
              className={`px-6 py-2 rounded transition-colors ${
                isApplyingDiscount 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isApplyingDiscount ? 'Applying...' : 'Apply Code'}
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <p className="text-gray-400">Subtotal: ฿{cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</p>
              {discount > 0 && (
                <p className="text-green-500">Discount: -฿{discount.toFixed(2)}</p>
              )}
              <p className="text-2xl font-bold">Total: ฿{calculateTotal()}</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => window.location.href = '/cart'}
                className="px-6 py-2 rounded border border-gray-600 hover:bg-gray-700 transition-colors"
              >
                Back to Cart
              </button>
              <button 
                className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition-colors"
                disabled={cartItems.length === 0}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;