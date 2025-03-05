"use client";

import { useEffect, useState } from "react";
import ProductFilters from "@/components/ProductFilters";
import ShopProductCard from "@/components/ShopProductCard";
import { Button } from "@heroui/react";
import { FilterIcon, X } from "lucide-react";

// Define the Product interface to match your API response
interface Product {
  product_id: string;
  product_name: string;
  category_name?: string;
  category_id?: number;
  price: number;
  tags: string | null;
  image_url?: string;
  images?: Array<{ image_url: string; is_primary?: number }>;
  product_type?: string;
  brand?: string;
}

// Define filter states interface
interface FilterState {
  types: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

export default function Shop() {
  // State for products and loading
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // State for filters
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    brands: [],
    priceRange: { min: 0, max: 50000 },
  });

  // Close filter panel when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowMobileFilters(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch products when component mounts
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        console.log("Fetched products:", data.length);
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error loading products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Apply filters whenever filters or products change
  useEffect(() => {
    if (!products.length) return;

    const filtered = products.filter((product) => {
      // Filter by type
      const typeMatch =
        filters.types.length === 0 ||
        (product.product_type &&
          filters.types.includes(product.product_type)) ||
        (product.category_name &&
          filters.types.some((type) =>
            product.category_name?.toLowerCase().includes(type.toLowerCase())
          ));

      // Filter by brand
      const brandMatch =
        filters.brands.length === 0 ||
        (product.brand && filters.brands.includes(product.brand)) ||
        (product.tags &&
          filters.brands.some((brand) =>
            product.tags?.toLowerCase().includes(brand.toLowerCase())
          )) ||
        filters.brands.some((brand) =>
          product.product_name.toLowerCase().includes(brand.toLowerCase())
        );

      // Filter by price range
      const priceMatch =
        product.price >= filters.priceRange.min &&
        product.price <= filters.priceRange.max;

      return typeMatch && brandMatch && priceMatch;
    });

    setFilteredProducts(filtered);
  }, [filters, products]);

  // Handler functions
  const handleTypeChange = (selectedTypes: string[]) => {
    setFilters((prev) => ({ ...prev, types: selectedTypes }));
  };

  const handleBrandChange = (selectedBrands: string[]) => {
    setFilters((prev) => ({ ...prev, brands: selectedBrands }));
  };

  const handlePriceChange = (min: number, max: number) => {
    setFilters((prev) => ({ ...prev, priceRange: { min, max } }));
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  return (
    <main className="ambient-bg min-h-screen">
      {/* Top spacing to account for navbar */}
      <div className="h-16 md:h-20 lg:h-24"></div>

      {/* Mobile filter button */}
      <div className="lg:hidden flex justify-between items-center px-4 sm:px-6 md:px-16 my-16">
        <Button
          onPress={toggleMobileFilters}
          size="sm"
          variant="flat"
          endContent={<FilterIcon size={16} />}
          className="bg-purple-900 bg-opacity-60 text-white"
        >
          Filters{" "}
          {filters.types.length + filters.brands.length > 0 &&
            `(${filters.types.length + filters.brands.length})`}
        </Button>

        {!loading && (
          <p className="text-sm text-gray-300">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* Products layout with filters */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-48 py-6">
        {/* Mobile filters (slide in from left) */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="fixed inset-y-0 left-0 w-full max-w-xs overflow-y-auto bg-[#1D1C21] p-4 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-xl font-kanit-regular">
                  ตัวกรอง
                </h2>
                <Button
                  size="sm"
                  isIconOnly
                  variant="light"
                  className="text-white"
                  onPress={toggleMobileFilters}
                >
                  <X size={20} />
                </Button>
              </div>
              <ProductFilters
                onTypeChange={handleTypeChange}
                onBrandChange={handleBrandChange}
                onPriceChange={handlePriceChange}
                selectedTypes={filters.types}
                selectedBrands={filters.brands}
                initialPriceRange={filters.priceRange}
              />
            </div>
          </div>
        )}

        {/* Desktop filters */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-28">
            <ProductFilters
              onTypeChange={handleTypeChange}
              onBrandChange={handleBrandChange}
              onPriceChange={handlePriceChange}
              selectedTypes={filters.types}
              selectedBrands={filters.brands}
              initialPriceRange={filters.priceRange}
            />
          </div>
        </div>

        {/* Products grid */}
        <div
          className="flex-1 bg-[#1D1C21] rounded-md border-[#1D1C21] p-4 sm:p-5 shadow-foreground-700 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-60"
          style={{
            boxShadow:
              "0 10px 20px rgba(156, 39, 176, 0.2), 0 6px 6px rgba(32, 17, 126, 0.15)",
          }}
        >
          {/* Results summary - desktop only */}
          <div className="mb-6 hidden lg:flex justify-between items-center">
            <div>
              {!loading && (
                <p className="text-sm text-gray-300">
                  {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? "s" : ""} found
                </p>
              )}
            </div>
          </div>

          {/* Products display with loading & error states */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg animate-pulse">Loading products...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-red-500">{error}</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-10">
                  No products found matching the selected filters
                </div>
              ) : (
                filteredProducts.map((product, index) => (
                  <div
                    key={product.product_id}
                    className="flex justify-center w-full"
                  >
                    <div className="w-full max-w-[300px]">
                      <ShopProductCard
                        product={product}
                        isPriority={index < 4}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
