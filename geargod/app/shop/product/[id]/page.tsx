"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@heroui/button";
import { Link } from "@heroui/react";
import { showToast } from "@/components/ToastAlert";

// Add this interface above the Product interface
interface ProductColor {
  id: number;
  color_name: string;
  color_code: string;
  add_price: number;
}

// Add these interfaces near the top with other interfaces
interface Material {
  id: string;
  name: string;
  add_price: number;
}

interface Component {
  id: string;
  name: string;
  add_price: number;
}

// Define the Product interface
interface Product {
  product_id: string;
  product_name: string;
  description: string;
  category_id: number;
  category_name?: string;
  price: number;
  stock_quantity: number;
  is_customizable: number;
  tags: string | null;
  image_url?: string;
  images?: Array<{ image_url: string; is_primary?: number }>;
  colors?: ProductColor[]; // Add this line
  materials?: Material[];
  components?: Component[];
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null); // Add this line
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<Component[]>([]); // Changed to array
  const [isComponentsOpen, setIsComponentsOpen] = useState(false); // Add this line
  // Add a ref to track if we've already initiated the fetch
  const fetchInitiated = useRef(false);

  // Fetch product data
  useEffect(() => {
    // Skip if we've already started fetching or if id is missing
    if (fetchInitiated.current || !id) return;

    // Mark that we've started fetching
    fetchInitiated.current = true;

    async function fetchProduct() {
      try {
        setLoading(true);
        console.log("Fetching product with ID:", id);
        const [productResponse, colorsResponse] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch(`/api/products/${id}/colors`)
        ]);

        if (!productResponse.ok) {
          throw new Error("Failed to fetch product");
        }

        const productData = await productResponse.json();
        const colorsData = await colorsResponse.json();

        // Merge colors data with product data
        productData.colors = colorsData;

        // Add these fetch calls for Computer Cases
        if (productData.category_name === "Computer-Cases") {
          const [materialsRes, componentsRes] = await Promise.all([
            fetch(`/api/products/${id}/materials`),
            fetch(`/api/products/${id}/components`)
          ]);
          console.log("Fetching materials and components for Computer Cases:", id);
          const materials = await materialsRes.json();
          const components = await componentsRes.json();
          productData.materials = materials;
          productData.components = components;
        }

        setProduct(productData);

        // Rest of your existing fetch product code...
        if (productData.category_id && !productData.category_name) {
          fetchCategoryName(productData.category_id);
        }

        if (productData.images && productData.images.length > 0) {
          const mainImage = productData.images[0];
          setImageUrl(processImageUrl(mainImage.image_url, productData.product_id));
        } else if (productData.image_url) {
          setImageUrl(processImageUrl(productData.image_url, productData.product_id));
        }
        
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product data");
      } finally {
        setLoading(false);
      }
    }

    async function fetchCategoryName(categoryId: number) {
      try {
        const response = await fetch(`/api/categories/${categoryId}`);
        if (response.ok) {
          const categoryData = await response.json();
          setCategoryName(categoryData.category_name);
        }
      } catch (err) {
        console.error("Error fetching category:", err);
      }
    }

    fetchProduct();

    // Added id to dependency array, but fetchInitiated.current prevents re-fetching
  }, [id]);

  // Function to process image URLs
  const processImageUrl = (url: string, productId: string): string => {
    if (url.startsWith("/images/")) {
      return url;
    } else if (url.includes("/")) {
      return `/images/${url}`;
    } else {
      return `/images/products/${productId}/${url}`;
    }
  };

  // Function to handle image selection
  const handleImageSelect = (index: number) => {
    if (product?.images?.[index]) {
      setSelectedImageIndex(index);
      setImageUrl(
        processImageUrl(product.images[index].image_url, product.product_id)
      );
    }
  };

  // Helper function to calculate total additional price
  const calculateTotalPrice = () => {
    if (!product) return 0;
    
    const basePrice = product.price || 0;
    const colorPrice = selectedColor?.add_price || 0;
    const materialPrice = selectedMaterial?.add_price || 0;
    const componentsPrice = selectedComponent?.reduce((sum, comp) => sum + (comp?.add_price || 0), 0) || 0;
    
    return basePrice + colorPrice + materialPrice + componentsPrice;
  };

  // Helper function to toggle component selection
  const toggleComponent = (component: Component) => {
    setSelectedComponent(prev => {
      const exists = prev.find(c => c.id === component.id);
      if (exists) {
        return prev.filter(c => c.id !== component.id);
      } else {
        return [...prev, component];
      }
    });
  };

  const addToCart = async () => {
    try {
      if (!product) return;
      if (product.colors && product.colors.length > 0 && !selectedColor) {
        showToast({
          title: "Error",
          description: "Please select a color",
          color: "danger"
        });
        return;
      }

      const finalPrice = calculateTotalPrice();

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product?.product_id,
          product_name: product?.product_name,
          price: finalPrice,
          quantity: 1,
          image_url: imageUrl,
          category: product?.category_name,
          material: selectedMaterial ? {
            id: selectedMaterial.id,
            name: selectedMaterial.name,
            add_price: selectedMaterial.add_price
          } : undefined,
          color: selectedColor ? {  
            id: selectedColor.id,
            color_name: selectedColor.color_name,
            color_code: selectedColor.color_code,
            add_price: selectedColor.add_price
          } : undefined,
          components: selectedComponent?.map(comp => ({
            id: comp.id,
            name: comp.name,
            add_price: comp.add_price
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
  
      showToast({
        title: "Added to Cart",
        description: `${product?.product_name} has been added to your cart.`,
        color: "success"
      });
  
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast({
        title: "Error",
        description: "Failed to add item to cart",
        color: "danger"
      });
    }
  };

  if (loading) {
    return (
      <main className="ambient-bg">
        <div className="flex justify-center items-center h-screen">
          <div className="text-2xl">Loading...</div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="ambient-bg">
        <div className="flex justify-center items-center h-screen">
          <div className="text-2xl text-red-500">
            {error || "Product not found"}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="ambient-bg">
      <div className="container mx-auto px-4 py-8 pt-40">
        <Link href="/shop">
          <Button>Back to Shop</Button>
        </Link>
        <div
          className="flex flex-col md:flex-row bg-[#1D1C21] rounded-md border-[#1D1C21] p-6 md:p-12 shadow-foreground-700 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-60 mt-8"
          style={{
            boxShadow:
              "0 10px 20px rgba(156, 39, 176, 0.2), 0 6px 6px rgba(32, 17, 126, 0.15)",
          }}
        >
          <section className="flex flex-col md:flex-row justify-between w-full gap-8">
            {/* Main product image */}
            <div className="flex flex-col space-y-4 w-full md:w-1/2">
              <div className="relative w-full flex justify-center items-center h-[400px] md:h-[500px] rounded-xl">
                <Image
                  src={imageUrl || "/images/products/placeholder.jpg"}
                  alt={product.product_name}
                  sizes="(max-width: 768px) 100vw"
                  width={500} // Adjust based on original image size
                  height={500} // Adjust based on original image size
                  priority
                  className="rounded-xl"
                />
              </div>

              {/* Image gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      className={`relative w-20 h-20 cursor-pointer border-2 rounded-md ${
                        index === selectedImageIndex
                          ? "border-purple-500"
                          : "border-transparent"
                      }`}
                    >
                      <Image
                        src={processImageUrl(img.image_url, product.product_id)}
                        alt={`${product.product_name} - view ${index + 1}`}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product details */}
            <div className="w-full md:w-1/2 flex flex-col">
              <h1 className="font-figtree-bold text-3xl mb-4">
                {product.product_name}
              </h1>

              {/* Price */}
              <div className="text-2xl font-bold mb-4 text-purple-400">
                ฿{(calculateTotalPrice() || 0).toLocaleString()}
                <div className="text-sm text-gray-400">
                  Base: ฿{(product?.price || 0).toLocaleString()}
                  {selectedColor && ` + Color: ฿${(selectedColor?.add_price || 0).toLocaleString()}`}
                  {selectedMaterial && ` + Material: ฿${(selectedMaterial?.add_price || 0).toLocaleString()}`}
                  {selectedComponent?.length > 0 && ` + Components: ฿${(selectedComponent.reduce((sum, comp) => sum + (comp?.add_price || 0), 0) || 0).toLocaleString()}`}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl mb-2 font-kanit-regular">
                  ข้อมูลเพิ่มเติม
                </h2>
                <p className="text-gray-300">
                  {product.description || "No description available."}
                </p>
              </div>

              {/* Stock */}
              <div className="mb-4">
                <span
                  className={`font-medium ${
                    product.stock_quantity > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {product.stock_quantity > 0
                    ? `In Stock (${product.stock_quantity})`
                    : "Out of Stock"}
                </span>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {/* Use either the category from product data or the separately fetched one */}
                  {(product.category_name || categoryName) && (
                    <span className="px-3 py-1 bg-blue-700 rounded-full text-sm font-medium">
                      {product.category_name || categoryName}
                    </span>
                  )}

                  {/* Display category ID if we still have no name */}
                  {!product.category_name &&
                    !categoryName &&
                    product.category_id && (
                      <span className="px-3 py-1 bg-purple-700 rounded-full text-sm font-medium">
                        Category #{product.category_id}
                      </span>
                    )}

                  {/* Show product tags */}
                  {product.tags &&
                    product.tags.split(",").map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-900 bg-opacity-40 rounded-full text-sm"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                </div>
              </div>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Select Color</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`
                          w-12 h-12 rounded-full border-2 transition-all duration-200
                          ${selectedColor?.color_name === color.color_name 
                            ? 'border-purple-500 scale-110' 
                            : 'border-gray-600 hover:border-purple-400'
                          }
                        `}
                        style={{
                          backgroundColor: color.color_code,
                          boxShadow: selectedColor?.color_name === color.color_name 
                            ? '0 0 10px rgba(168, 85, 247, 0.5)' 
                            : 'none'
                        }}
                        title={color.color_name}
                      >
                        <span className="sr-only">{color.color_name}</span>
                      </button>
                    ))}
                  </div>
                  {selectedColor && (
                    <p className="mt-2 text-sm text-gray-300">
                      Selected: {selectedColor.color_name} add: {selectedColor.add_price}
                    </p>
                  )}
                </div>
              )}

              {/* Add this after the Color Selector section */}
              {product.category_name === "Computer-Cases" && (
                <>
                  {/* Material Selector - updated to dropdown */}
                  {product.materials && product.materials.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">Select Material</h2>
                      <div className="relative">
                        <select
                          value={selectedMaterial?.id || ''}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            const materialId = e.target.value;
                            const selected = product.materials?.find(m => m.id === materialId);
                            setSelectedMaterial(selected || null);
                          }}
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                        >
                          <option value="">Choose a material...</option>
                          {product.materials.map((material) => (
                            <option 
                              key={material.id} 
                              value={material.id}
                              className="bg-gray-700"
                            >
                              {material.name} (+฿{material.add_price.toLocaleString()})
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {selectedMaterial && (
                        <p className="mt-2 text-sm text-purple-400">
                          Selected: {selectedMaterial.name} (+฿{selectedMaterial.add_price.toLocaleString()})
                        </p>
                      )}
                    </div>
                  )}

                  {/* Component Selector */}
                  {product.components && product.components.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">เลือกอุปกรณ์เสริม</h2>
                      <div className="relative">
                        <div 
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-md cursor-pointer border border-gray-600 hover:border-purple-500"
                          onClick={() => setIsComponentsOpen(!isComponentsOpen)}
                        >
                          <div className="flex justify-between items-center">
                            <span>{selectedComponent.length ? `เลือกแล้ว ${selectedComponent.length} รายการ` : 'เลือกอุปกรณ์เสริม...'}</span>
                            <svg className={`w-5 h-5 transition-transform ${isComponentsOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                  
                        {/* Dropdown Panel - Updated positioning */}
                        {isComponentsOpen && (
                          <div className="absolute z-10 w-full bottom-full mb-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                            <div className="max-h-60 overflow-auto">
                              {product.components.map((component) => (
                                <div
                                  key={component.id}
                                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                  onClick={() => toggleComponent(component)}
                                >
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={selectedComponent.some(c => c.id === component.id)}
                                      readOnly
                                      className="w-4 h-4 accent-purple-500"
                                    />
                                    <span>{component.name}</span>
                                  </div>
                                  <span className="text-purple-400">+฿{component.add_price.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                            
                            {selectedComponent.length > 0 && (
                              <div className="border-t border-gray-700 p-3">
                                <div className="flex justify-between text-sm">
                                  <span>รวม {selectedComponent.length} รายการ</span>
                                  <span className="text-purple-400">
                                    +฿{selectedComponent.reduce((sum, comp) => sum + comp.add_price, 0).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                  
                        {/* Selected Components Summary */}
                        {selectedComponent.length > 0 && !isComponentsOpen && (
                          <div className="mt-2 text-sm text-gray-300">
                            <div className="flex flex-wrap gap-1">
                              {selectedComponent.map((comp) => (
                                <span key={comp.id} className="inline-flex items-center gap-1 bg-purple-900/30 px-2 py-1 rounded">
                                  {comp.name}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleComponent(comp);
                                    }}
                                    className="text-gray-400 hover:text-gray-200"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Add to cart button */}
              <div className="flex flex-row md:flex-row-2 gap-4 justify-evenly">
                <Button
                  className="w-full mt-auto py-3 px-6 border-2 border-purple-600 rounded-md transition duration-300 font-kanit-regular"
                  variant="bordered"
                  disabled={product.stock_quantity <= 0}
                  onPress={addToCart}
                >
                  เพิ่มลงตะกร้า
                </Button>
                <Button
                  className="w-full mt-auto py-3 px-6 bg-purple-600 hover:bg-purple-700 rounded-md transition duration-300 font-kanit-regular"
                  disabled={product.stock_quantity <= 0}
                  onPress={async () => {
                  await addToCart();
                  window.location.href = '/cart';
                  }}
                >
                  ซื้อเลย
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
