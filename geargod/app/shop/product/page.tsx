// app/shop/deals/page.tsx
"use client";

import BreadCrumbs from "@/components/BreadCrumbs";
import ProductFilters from "@/components/ProductFilters";
import ShopProductCard from "@/components/ShopProductCard";

export default function DealsPage() {
  // Make sure it's a named function
  return (
    <main className="ambient-bg">
      {/* Create a flex container to hold filters and products side by side */}
      <div className="flex gap-8 px-48 py-8 pt-40 pl-48">
        {/* Left sidebar with filters */}

        {/* Main content area with products */}
        <div
          className="flex-1 bg-[#1D1C21] rounded-md border-[#1D1C21] p-5 shadow-foreground-700 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-60"
          style={{
            boxShadow:
              "0 10px 20px rgba(156, 39, 176, 0.2), 0 6px 6px rgba(32, 17, 126, 0.15)",
          }}
        >
          <h1 className="font-figtree-bold text-[30px]">Loga Garuda Pro Wireless Gaming Mouse</h1>
        </div>
      </div>
    </main>
  );
}
