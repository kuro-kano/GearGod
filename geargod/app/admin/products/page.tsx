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
}

export default function ProductsPage() {
  const router = useRouter();
  // State for products
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });

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
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handler functions for filters
  const handleTypeChange = (types: string[]) => {
    setSelectedTypes(types);
    // Implement filtering logic here
  };

  const handleBrandChange = (brands: string[]) => {
    setSelectedBrands(brands);
    // Implement filtering logic here
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    // Implement filtering logic here
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
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  return (
    <main className="ambient-bg">
      <div className="p-4 sm:p-6 md:p-10 lg:p-16 min-h-screen flex flex-col items-center">
        <div
          className="p-6 backdrop-filter backdrop-blur-lg bg-black bg-opacity-25 w-full max-w-7xl rounded-lg overflow-hidden custom-box-shadow"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-kanit-regular text-2xl">รายการสินค้าทั้งหมด</h1>
            <Button
              color="primary"
              onPress={() => router.push("/admin/products/new")}
            >
              Add New Product
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 lg:w-1/4">
              <ProductFilters
                selectedTypes={selectedTypes}
                selectedBrands={selectedBrands}
                initialPriceRange={priceRange}
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
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <AdminProductCard
                      key={product.product_id}
                      product={product}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
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
