"use client";

import { useEffect, useState } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";
import ProductFilters from "@/components/ProductFilters";
import ShopProductCard from "@/components/ShopProductCard";

// Define the Product interface to match your API response
interface Product {
  product_id: string;
  product_name: string;
  category_name?: string;
  category_id?: number;
  price: number;
  tags: string | null;
  image_url?: string;
  product_type?: string; // For filtering by type
  brand?: string; // For filtering by brand
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

  // State for filters
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    brands: [],
    priceRange: { min: 0, max: 50000 },
  });

  // Fetch products when component mounts
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); // Initially, filtered products = all products
      } catch (err) {
        setError("Error loading products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Apply filters whenever filters or products change
  useEffect(() => {
    // Skip filtering when no products or during initial load
    if (!products.length) return;

    // Filter products based on selected criteria
    const filtered = products.filter((product) => {
      // Filter by type
      const typeMatch =
        filters.types.length === 0 ||
        (product.product_type &&
          filters.types.includes(product.product_type)) ||
        // If category_name contains any of the filter types (fallback)
        (product.category_name &&
          filters.types.some((type) =>
            product.category_name?.toLowerCase().includes(type.toLowerCase())
          ));

      // Filter by brand
      const brandMatch =
        filters.brands.length === 0 ||
        (product.brand && filters.brands.includes(product.brand)) ||
        // Try to match brand in tags or product name as fallback
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

      // Product must match all applied filters
      return typeMatch && brandMatch && priceMatch;
    });

    setFilteredProducts(filtered);
  }, [filters, products]);

  // Handler for type filter changes
  const handleTypeChange = (selectedTypes: string[]) => {
    setFilters((prev) => ({
      ...prev,
      types: selectedTypes,
    }));
  };

  // Handler for brand filter changes
  const handleBrandChange = (selectedBrands: string[]) => {
    setFilters((prev) => ({
      ...prev,
      brands: selectedBrands,
    }));
  };

  // Handler for price range changes
  const handlePriceChange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: { min, max },
    }));
  };

  return (
    <main className="ambient-bg">
      <div className="pt-40 pl-48">
        <BreadCrumbs />
      </div>

      {/* Create a flex container to hold filters and products side by side */}
      <div className="flex gap-8 px-48 py-8">
        {/* Left sidebar with filters */}
        <div className="w-64 shrink-0">
          <ProductFilters
            onTypeChange={handleTypeChange}
            onBrandChange={handleBrandChange}
            onPriceChange={handlePriceChange}
            selectedTypes={filters.types}
            selectedBrands={filters.brands}
            initialPriceRange={filters.priceRange}
          />
        </div>

        {/* Main content area with products */}
        <div
          className="flex-1 bg-[#1D1C21] rounded-md border-[#1D1C21] p-5 shadow-foreground-700 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-60"
          style={{
            boxShadow:
              "0 10px 20px rgba(156, 39, 176, 0.2), 0 6px 6px rgba(32, 17, 126, 0.15)",
          }}
        >
          {/* Results summary */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              {!loading && (
                <p className="text-sm text-gray-300">
                  {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? "s" : ""} found
                </p>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg">Loading products...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-red-500">{error}</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="col-span-3 text-center py-10">
                  No products found matching the selected filters
                </div>
              ) : (
                filteredProducts.map((product, index) => (
                  <ShopProductCard
                    key={product.product_id}
                    product={product}
                    isPriority={index < 4} // Set priority for first 4 products that will be above the fold
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
