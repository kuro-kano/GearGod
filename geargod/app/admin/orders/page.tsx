"use client";

import { useEffect, useState } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";
import ProductFilters from "@/components/ProductFilters";
import ShopProductCard from "@/components/ShopProductCard";

export default function OrderPage() {
  return (
    <main className="ambient-bg">
      <div className="p-4 sm:p-6 md:p-10 lg:p-16 min-h-screen flex flex-col items-center">
        <div className="backdrop-filter backdrop-blur-lg bg-black bg-opacity-50 w-full max-w-7xl rounded-lg overflow-hidden"></div>
      </div>
    </main>
  );
}
