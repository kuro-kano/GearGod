"use client";

import { useEffect, useState } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";
import ProductFilters from "@/components/ProductFilters";
import ShopProductCard from "@/components/ShopProductCard";
import { Button } from "@heroui/react";
import { FilterX, FilterIcon, X } from "lucide-react";
import "@/styles/globals.css";

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
  const [showFilters, setShowFilters] = useState(false);

  // State for filters
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    brands: [],
    priceRange: { min: 0, max: 5000 },
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

  // Toggle filters panel for mobile view
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <main className="ambient-bg min-h-screen">
      <div className="pt-20 sm:pt-28 lg:pt-40 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-48">
        <BreadCrumbs />
      </div>

      {/* Mobile filter button */}
      <div className="lg:hidden flex justify-between items-center px-4 sm:px-6 md:px-8 mt-4">
        <h2 className="text-lg font-medium text-white">Products</h2>
        <Button
          size="sm"
          className="flex items-center gap-2 bg-purple-700 text-white"
          onPress={toggleFilters}
        >
          <FilterIcon size={16} />
          Filters
          {(filters.types.length > 0 || filters.brands.length > 0) && (
            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-white text-purple-700 rounded-full">
              {filters.types.length + filters.brands.length}
            </span>
          )}
        </Button>
      </div>

      {/* Create a flex container to hold filters and products side by side */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-48 py-4 lg:py-8">
        {/* Mobile filters drawer */}
        {showFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex lg:hidden">
            <div className="pt-32 ml-auto w-[280px] max-w-full h-full bg-[#1D1C21] p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-white">Filters</h2>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-white"
                  onPress={toggleFilters}
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

        {/* Desktop filters sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
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
        <div className="flex-1 bg-[#1D1C21] rounded-md border-[#1D1C21] p-4 lg:p-5 shadow-foreground-700 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-60 products-container">
          {/* Results summary */}
          <div className="mb-4 lg:mb-6 flex justify-between items-center">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
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
                    <ShopProductCard product={product} isPriority={index < 4} />
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
