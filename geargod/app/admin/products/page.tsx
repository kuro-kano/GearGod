"use client";

import ProductFilters from "@/components/ProductFilters";
import AdminProductCard from "@components/admin/AdminProductCard";
import { Button } from "@heroui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FilterIcon, X } from "lucide-react";

interface Product {
  product_id: string;
  product_name: string;
  category_name?: string;
  price: number;
  stock_quantity: number;
  is_customizable: number;
  tags: string | null;
  image_url?: string;
  product_type?: string;
  brand?: string;
}

interface FilterState {
  types: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

export default function ProductsPage() {
  const router = useRouter();
  
  // State for products
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1500);

  // State for filters
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    brands: [],
    priceRange: { min: 0, max: 5000 },
  });

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); // Initially, filtered products = all products
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

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
    setFilters((prev) => ({
      ...prev,
      types: selectedTypes,
    }));
  };

  const handleBrandChange = (selectedBrands: string[]) => {
    setFilters((prev) => ({
      ...prev,
      brands: selectedBrands,
    }));
  };

  const handlePriceChange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: { min, max },
    }));
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts(products.filter((p) => p.product_id !== productId));
      setFilteredProducts(filteredProducts.filter((p) => p.product_id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Determine if sidebar should be shown based on window width
  const shouldShowDesktopSidebar = windowWidth >= 1486;
  
  // Determine if filter button should be shown (when width < 1297)
  const shouldShowFilterButton = windowWidth < 1297;

  return (
    <main className="dark ambient-bg">
      <div className="p-4 sm:p-6 md:p-10 lg:p-16 min-h-screen flex flex-col items-center">
        <div
          className="p-4 sm:p-6 backdrop-filter backdrop-blur-lg bg-black bg-opacity-25 w-full max-w-7xl rounded-lg overflow-hidden custom-box-shadow"
        >
          {/* Header with title and add product button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-8">
            <h1 className="font-kanit-regular text-xl sm:text-2xl text-white">รายการสินค้าทั้งหมด</h1>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Filter button - shown when width < 1297px */}
              {shouldShowFilterButton && (
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
              )}
              <Button
                color="primary"
                onPress={() => router.push("/admin/products/new")}
                className="font-kanit-regular flex-1 sm:flex-none"
              >
                เพิ่มสินค้า
              </Button>
            </div>
          </div>

          {/* Filters drawer - shown when filters button is clicked */}
          {showFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex">
              <div className="ml-auto w-[320px] max-w-full h-full bg-[#1D1C21] p-4 overflow-y-auto">
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
                  selectedTypes={filters.types}
                  selectedBrands={filters.brands}
                  initialPriceRange={filters.priceRange}
                  onTypeChange={handleTypeChange}
                  onBrandChange={handleBrandChange}
                  onPriceChange={handlePriceChange}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Desktop sidebar with filters - shown when width >= 1297px & < 1486px */}
            {!shouldShowFilterButton && !shouldShowDesktopSidebar && (
              <div className="w-full">
                <ProductFilters
                  selectedTypes={filters.types}
                  selectedBrands={filters.brands}
                  initialPriceRange={filters.priceRange}
                  onTypeChange={handleTypeChange}
                  onBrandChange={handleBrandChange}
                  onPriceChange={handlePriceChange}
                />
              </div>
            )}

            {/* Main flex container for products with optional sidebar */}
            <div className="flex flex-row gap-6 w-full">
              {/* Desktop sidebar with filters - shown when width >= 1486px */}
              {shouldShowDesktopSidebar && (
                <div className="w-1/4 shrink-0">
                  <ProductFilters
                    selectedTypes={filters.types}
                    selectedBrands={filters.brands}
                    initialPriceRange={filters.priceRange}
                    onTypeChange={handleTypeChange}
                    onBrandChange={handleBrandChange}
                    onPriceChange={handlePriceChange}
                  />
                </div>
              )}
              
              {/* Products listing */}
              <div className={shouldShowDesktopSidebar ? "w-3/4" : "w-full"}>
                {loading ? (
                  <div className="bg-black bg-opacity-20 rounded-lg p-4 h-64 flex items-center justify-center">
                    <p>Loading products...</p>
                  </div>
                ) : error ? (
                  <div className="bg-black bg-opacity-20 rounded-lg p-4 h-64 flex items-center justify-center text-red-400">
                    <p>Error: {error}</p>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div>
                    <p className="text-sm text-gray-300 mb-3 sm:mb-4">
                      {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {filteredProducts.map((product) => (
                        <div key={product.product_id} className="flex justify-center w-full">
                          <AdminProductCard
                            product={product}
                            onDelete={handleDeleteProduct}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-black bg-opacity-20 rounded-lg p-4 h-64 flex items-center justify-center">
                    <p className="text-gray-300">
                      No products found matching the selected filters.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}