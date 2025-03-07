"use client";
import React, { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import SearchOverlay from "@/components/SearchOverlay";
import BreadCrumbs from "@/components/BreadCrumbs";
import ProgressCheckout from "@/components/ProgressCheckout";

const PaymentPage = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Define the steps for the checkout process
  const steps = [
    { name: "SHOPPING CART", href: "/cart", status: "complete" as const },
    { name: "CHECKOUT", href: "/checkout", status: "current" as const },
    { name: "FINISH", href: "/finish", status: "upcoming" as const },
  ];

  const handleDeliveryMethodChange = (method: string) => {
    setDeliveryMethod(method);
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  return (
    <main className="ambient-bg min-h-screen">
      <Navbar/>
      <div className="pt-40 pl-48">
        <BreadCrumbs />
      </div>

      <div className="px-48 py-8">
        <ProgressCheckout steps={steps} />
        
        <div className="bg-[#1D1C21] rounded-md p-6 shadow-foreground-700 backdrop-filter backdrop-blur-sm bg-opacity-60">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>

          {/* Order Summary Section */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-4 p-4 bg-black/20 rounded-lg">
              <Image
                width={96}
                height={96}
                src="/path-to-your-image.jpg" 
                alt="Product" 
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="font-medium">Product Name</h3>
                <p className="text-gray-400">Description</p>
              </div>
              <div className="text-center mx-4">
                <p className="text-sm text-gray-400">Quantity</p>
                <p className="font-medium">1</p>
              </div>
              <div className="w-24 text-right">
                <p className="text-sm text-gray-400">Price</p>
                <p className="font-medium">$1,000</p>
              </div>
            </div>
          </div>

          {/* Payment Details Section */}
          <div className="space-y-6">
            {/* Discount Code Section */}
            <div className="flex gap-4 items-center">
              <input 
                type="text" 
                placeholder="Enter discount code"
                className="flex-1 p-2 rounded bg-black/20 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                Apply Code
              </button>
            </div>

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

            {/* Delivery Address */}
            <div className="space-y-2">
              <h3 className="font-medium mb-3">Delivery Address</h3>
              <textarea 
                className="w-full p-3 rounded bg-black/20 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your delivery address"
                rows={4}
              ></textarea>
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
            <div className="flex justify-between items-center pt-6 border-t border-gray-700">
              <div>
                <p className="text-2xl font-bold">Total: $1,000</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => window.location.href = '/cart'}
                  className="px-6 py-2 rounded border border-gray-600 hover:bg-gray-700 transition-colors"
                >
                  Back to Cart
                </button>
                <button className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition-colors">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <SearchOverlay 
        isVisible={isSearchVisible} 
        onClose={() => setIsSearchVisible(false)} 
      />
    </main>
  );
};

export default PaymentPage;