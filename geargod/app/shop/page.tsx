// app/page.tsx
import BreadCrumbs from "@/components/BreadCrumbs";
import ProductFilters from "@/components/ProductFilters";
import ShopProductCard from "@/components/ShopProductCard";

export default function Deals() {
  return (
    <main className="ambient-bg">
      <div className="pt-40 pl-48">
        <BreadCrumbs />
      </div>

      {/* Create a flex container to hold filters and products side by side */}
      <div className="flex gap-8 px-48 py-8">
        {/* Left sidebar with filters */}
        <div className="w-64 shrink-0">
          <ProductFilters />
        </div>

        {/* Main content area with products */}
        <div
          className="flex-1 bg-[#1D1C21] rounded-md border-[#1D1C21] p-5 shadow-foreground-700 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-60"
          style={{
            boxShadow:
              "0 10px 20px rgba(156, 39, 176, 0.2), 0 6px 6px rgba(32, 17, 126, 0.15)",
          }}
        >
          <div className="grid grid-cols-3 gap-6">
            <ShopProductCard />
            {/* Additional product cards would go here */}
          </div>
        </div>
      </div>
    </main>
  );
}
