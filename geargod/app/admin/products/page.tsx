"use client";

import ProductFilters from "@/components/ProductFilters";
import AdminProductCard from "@components/admin/AdminProductCard";
import { Button } from "@heroui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Product {
  product_id: string;
  product_name: string;
  category_name?: string;
  price: number;
  stock_quantity: number;
  is_customizable: number;
  tags: string | null;
  image_url?: string;
  product_type?: string; // Added for filtering
  brand?: string; // Added for filtering
}

// Define filter states interface for consistency
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

  // State for filters - using the same structure as shop page
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    brands: [],
    priceRange: { min: 0, max: 50000 },
  });

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

  // Apply filters whenever filters or products change - same as shop page
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

  // Handle deleting a product
  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Remove the deleted product from state
      setProducts(products.filter((p) => p.product_id !== productId));
      setFilteredProducts(filteredProducts.filter((p) => p.product_id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  return (
    <main className="dark ambient-bg">
      <div className="p-4 sm:p-6 md:p-10 lg:p-16 min-h-screen flex flex-col items-center">
        <div
          className="p-6 backdrop-filter backdrop-blur-lg bg-black bg-opacity-25 w-full max-w-7xl rounded-lg overflow-hidden custom-box-shadow"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-kanit-regular text-2xl text-foreground">รายการสินค้าทั้งหมด</h1>
            <Button
              color="primary"
              onPress={() => router.push("/admin/products/new")}
              className="font-kanit-regular"
            >
              เพิ่มสินค้า
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 lg:w-1/4">
              <ProductFilters
                selectedTypes={filters.types}
                selectedBrands={filters.brands}
                initialPriceRange={filters.priceRange}
                onTypeChange={handleTypeChange}
                onBrandChange={handleBrandChange}
                onPriceChange={handlePriceChange}
              />
            </div>
            <div className="md:w-2/3 lg:w-3/4">
              {/* Products listing */}
              {loading ? (
                <div className="bg-black bg-opacity-20 rounded-lg p-4 h-full flex items-center justify-center">
                  <p>Loading products...</p>
                </div>
              ) : error ? (
                <div className="bg-black bg-opacity-20 rounded-lg p-4 h-full flex items-center justify-center text-red-400">
                  <p>Error: {error}</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-300 mb-4">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                      <AdminProductCard
                        key={product.product_id}
                        product={product}
                        onDelete={handleDeleteProduct}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-black bg-opacity-20 rounded-lg p-4 h-full flex items-center justify-center">
                  <p className="text-gray-300">
                    No products found matching the selected filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}