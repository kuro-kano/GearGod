"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import ProductImageSection from "@/components/admin/ProductImageSection";
import ProductInfoForm from "@/components/admin/ProductInfoForm";
import ColorVariantsSection from "@/components/admin/ColorVariantsSection";
import TagsInputSection from "@/components/admin/TagsInputSection";

// Define product interface matching your database schema
interface Product {
  product_id: string;
  product_name: string;
  description: string | null;
  category_id: number | null;
  category_name?: string;
  price: number;
  stock_quantity: number;
  is_customizable: number;
  tags: string | null;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: string | number | null | undefined; // Add this li
}

// Define category interface for dropdown
interface Category {
  category_id: number;
  category_name: string;
}

// Define color variant interface
interface ColorVariant {
  color_id?: number;
  color_name: string;
  color_code: string;
  add_price: number;
  isSelected?: boolean;
}

// Define product image interface
interface ProductImage {
  image_id?: number;
  product_id: string;
  image_url: string;
  is_primary: number;
  color_id?: number;
}

export default function NewProductPage() {
  const router = useRouter();

  // Form states - initialize with empty product
  const [product, setProduct] = useState<Product>({
    product_id: '', // Will be assigned by the server
    product_name: '',
    description: null,
    category_id: null,
    price: 0,
    stock_quantity: 0,
    is_customizable: 0,
    tags: null
  });
  
  const [imageUrl, setImageUrl] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Image states
  const [productImages, setProductImages] = useState<ProductImage[]>([]);

  // Color variant states
  const [availableColors, setAvailableColors] = useState<ColorVariant[]>([]);
  const [selectedColors, setSelectedColors] = useState<ColorVariant[]>([]);

  // Tags state management
  const [tagsList, setTagsList] = useState<string[]>([]);

  // Fetch necessary data for the form
  useEffect(() => {
    // Fetch categories for dropdown
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setFormError("Error fetching categories");
      }
    };

    // Fetch all available colors
    const fetchAvailableColors = async () => {
      try {
        const response = await fetch("/api/colors");
        if (!response.ok) {
          throw new Error("Failed to fetch colors");
        }
        const data = await response.json();
        setAvailableColors(data);
        
        // Find and add the mandatory color (ID: 51)
        const mandatoryColor = data.find((c: ColorVariant) => c.color_id === 51);
        if (mandatoryColor) {
          setSelectedColors([mandatoryColor]);
        }
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };

    fetchCategories();
    fetchAvailableColors();
  }, []);

  const handleImageSuccess = (newImageUrl: string, colorId?: number) => {
    console.log("Image uploaded successfully:", newImageUrl);

    // If colorId is provided, this is a color variant image
    if (colorId) {
      // Create a new image object for the specific color
      const newImage = {
        image_url: newImageUrl,
        product_id: product?.product_id || "",
        is_primary: 0,
        color_id: colorId,
      };

      // Add to productImages state
      setProductImages((prev) => [...prev, newImage]);
    } else {
      // Set the main image URL
      setImageUrl(newImageUrl);

      // Create a new image object for main product image
      const newImage = {
        image_url: newImageUrl,
        product_id: product?.product_id || "",
        is_primary: 1,
      };

      // Update productImages state - new image becomes primary
      setProductImages((prev) => {
        if (prev.length === 0) {
          return [newImage];
        }

        // Make the new image primary and demote others
        return [
          { ...newImage, is_primary: 1 },
          ...prev.filter((img) => img.is_primary !== 1),
        ];
      });

      // Update product state
      setProduct({
        ...product,
        image_url: newImageUrl,
      });
    }

    // Show success message
    setSuccessMessage("Product image uploaded successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Handle product data changes from ProductInfoForm
  const handleProductChange = (updatedProduct: Product) => {
    setProduct(updatedProduct);
  };

  // Handle tags changes from TagsInputSection
  const handleTagsChange = (newTags: string[]) => {
    setProduct({
      ...product,
      tags: newTags.join(","),
    });
    setTagsList(newTags);
  };

  // Handle color changes from ColorVariantsSection
  const handleColorsChange = (colors: ColorVariant[]) => {
    setSelectedColors(colors);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setFormError(null);

      // Basic validation
      if (!product.product_name || product.price <= 0) {
        setFormError("Product name and valid price are required");
        setIsSubmitting(false);
        return;
      }

      // Prepare product data
      const productData = {
        product_name: product.product_name,
        description: product.description,
        category_id: product.category_id,
        price: parseFloat(product.price.toString()),
        stock_quantity: parseInt(product.stock_quantity.toString()),
        is_customizable: product.is_customizable,
        tags: product.tags,
        image_url: product.image_url,
        images: productImages,
        colors: product.is_customizable === 1 ? selectedColors : [51],
      };

      console.log("Creating new product:", productData);

      // Submit new product
      const response = await fetch(`/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create product");
      }

      // Show success message
      setSuccessMessage("Product created successfully!");

      // Navigate back to products list after short delay
      setTimeout(() => {
        router.push("/admin/products");
      }, 2000);
    } catch (error) {
      console.error("Error creating product:", error);
      setFormError(
        error instanceof Error
          ? error.message
          : "An error occurred while creating the product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="dark ambient-bg text-white font-kanit-regular">
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">เพิ่มสินค้าใหม่</h1>

        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {formError}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <ProductImageSection
            productId="new" // Use "new" as a placeholder for product ID
            imageUrl={imageUrl}
            productImages={productImages}
            availableColors={availableColors}
            onImageSuccess={handleImageSuccess}
          />

          <ProductInfoForm
            product={product}
            categories={categories}
            onProductChange={handleProductChange}
          />

          {product.is_customizable === 1 && (
            <ColorVariantsSection
              productId="new" // Use "new" as a placeholder for product ID
              availableColors={availableColors}
              selectedColors={selectedColors}
              productImages={productImages}
              onColorsChange={handleColorsChange}
              onImageSuccess={handleImageSuccess}
            />
          )}

          <TagsInputSection
            tagsList={tagsList}
            onTagsChange={handleTagsChange}
          />

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              color="secondary"
              onPress={() => router.push("/admin/products")}
            >
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
