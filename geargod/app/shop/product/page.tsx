// app/shop/deals/page.tsx
"use client";

import BreadCrumbs from "@/components/BreadCrumbs";
import ProductFilters from "@/components/ProductFilters";
import ShopProductCard from "@/components/ShopProductCard";

export default function ProductPage() {

  return (
    <main className="ambient-bg">
      <div className="flex justify-evenly gap-8 px-48 py-8 pt-40 pl-48">

        <div
          className="flex bg-[#1D1C21] rounded-md border-[#1D1C21] p-24 shadow-foreground-700 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-60"
          style={{
            boxShadow:
              "0 10px 20px rgba(156, 39, 176, 0.2), 0 6px 6px rgba(32, 17, 126, 0.15)",
          }}
        >
          <section className="flex justify-between w-full">
            <img
              src="/images/products/mouse/loga-garuda-pro-wireless-gaming-mouse-matte-neon-pink-top.jpg"
              className="w-[500px] h-auto rounded-lg"
            />
            <h1 className="font-figtree-bold text-[30px] pl-28">
              Loga Garuda Pro Wireless Gaming Mouse
            </h1>
          </section>
        </div>
      </div>
    </main>
  );
}
