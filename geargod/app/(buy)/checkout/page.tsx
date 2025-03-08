"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchOverlay from "@/components/SearchOverlay";
import BreadCrumbs from "@/components/BreadCrumbs";
import ProgressCheckout from "@/components/ProgressCheckout";
import CheckoutForm from "@/components/CheckoutForm";

const PaymentPage = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Define the steps for the checkout process
  const steps = [
    { name: "SHOPPING CART", href: "/cart", status: "complete" as const },
    { name: "CHECKOUT", href: "/checkout", status: "current" as const },
    { name: "FINISH", href: "/finish", status: "upcoming" as const },
  ];

  return (
    <main className="ambient-bg min-h-screen">
      <Navbar/>
      <div className="pt-40 pl-48">
        <BreadCrumbs />
      </div>

      <div className="px-48 py-8">
        <ProgressCheckout steps={steps} />
        <CheckoutForm />
      </div>
      
      <SearchOverlay 
        isVisible={isSearchVisible} 
        onClose={() => setIsSearchVisible(false)} 
      />
    </main>
  );
};

export default PaymentPage;