"use client";

import { useState, useEffect, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import ProductImageUpload from "@/components/ProductImageUpload";
// Update import to include SelectItem
import {
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Checkbox,
  Chip,
} from "@heroui/react";

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
}

// Define category interface for dropdown
interface Category {
  category_id: number;
  category_name: string;
}

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  // Form states
  const [product, setProduct] = useState<Product | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Tags state management
  const [tagInput, setTagInput] = useState("");
  const [tagsList, setTagsList] = useState<string[]>([]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        setProduct(data);

        // Set image URL if it exists - UPDATED to match ShopProductCard logic
        if (data.image_url) {
          const url = data.image_url.startsWith("http")
            ? data.image_url
            : data.image_url.startsWith("/")
            ? data.image_url
            : `/images/products/${data.product_id}/${data.image_url}`;
          setImageUrl(url);
        }

        // Set tags list from comma-separated string
        if (data.tags) {
          setTagsList(data.tags.split(",").map((tag: string) => tag.trim()));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setFormError("Failed to load product data");
      }
    };

    // Fetch categories for dropdown
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setFormError(
          error instanceof Error ? error.message : "Error fetching categories"
        );
      }
    };

    if (id) {
      fetchProduct();
      fetchCategories();
    }
  }, [id]);

  // Handle image upload success - UPDATED to extract filename for database
  const handleImageSuccess = (newImageUrl: string) => {
    setImageUrl(newImageUrl);

    // Extract appropriate image URL format for database storage
    let dbImageUrl = newImageUrl;
    if (newImageUrl.startsWith("/images/products/") && product) {
      // Format: /images/products/{product_id}/{filename}
      // Extract just the filename part for database storage
      const pathParts = newImageUrl.split("/");
      dbImageUrl = pathParts[pathParts.length - 1];
    }

    // Update product state with the appropriate URL format
    if (product) {
      setProduct({
        ...product,
        image_url: dbImageUrl,
      });
    }

    setSuccessMessage("Image uploaded successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (product) {
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (product) {
      setProduct({
        ...product,
        [name]: checked ? 1 : 0,
      });
    }
  };

  // Add tag to the list
  const handleAddTag = () => {
    if (tagInput.trim() && !tagsList.includes(tagInput.trim())) {
      const newTagsList = [...tagsList, tagInput.trim()];
      setTagsList(newTagsList);

      // Update product tags
      if (product) {
        setProduct({
          ...product,
          tags: newTagsList.join(","),
        });
      }

      setTagInput("");
    }
  };

  // Remove tag from the list
  const handleRemoveTag = (tagToRemove: string) => {
    const newTagsList = tagsList.filter((tag) => tag !== tagToRemove);
    setTagsList(newTagsList);

    // Update product tags
    if (product) {
      setProduct({
        ...product,
        tags: newTagsList.join(","),
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!product) return;

    try {
      setIsSubmitting(true);
      setFormError(null);

      // Basic validation
      if (!product.product_name || product.price <= 0) {
        setFormError("Product name and valid price are required");
        setIsSubmitting(false);
        return;
      }

      // Log request details for debugging
      console.log("Submitting product update:", {
        id,
        data: {
          product_name: product.product_name,
          description: product.description,
          category_id: product.category_id,
          price: parseFloat(product.price.toString()),
          stock_quantity: parseInt(product.stock_quantity.toString()),
          is_customizable: product.is_customizable,
          tags: product.tags,
          image_url: product.image_url,
        },
      });

      // Submit product update
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_name: product.product_name,
          description: product.description,
          category_id: product.category_id,
          price: parseFloat(product.price.toString()),
          stock_quantity: parseInt(product.stock_quantity.toString()),
          is_customizable: product.is_customizable,
          tags: product.tags,
          image_url: product.image_url,
        }),
      });

      const responseData = await response.json();
      console.log("Update response:", response.status, responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update product");
      }

      // Show success message
      setSuccessMessage("Product updated successfully!");

      // Navigate back to products list after short delay
      setTimeout(() => {
        router.push("/admin/products");
      }, 2000);
    } catch (error) {
      console.error("Error updating product:", error);
      setFormError(
        error instanceof Error
          ? error.message
          : "An error occurred while updating the product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading product data...</div>
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Edit Product: {product.product_name}
      </h1>

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
        {/* Product image section */}
        <div className="mb-6 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Product Image</h2>

          {/* Display current image */}
          <div className="mb-4">
            <div className="relative w-64 h-64 border border-gray-600 rounded-lg overflow-hidden">
              <Image
                src={imageUrl || "/images/products/placeholder.jpg"}
                alt={product.product_name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Upload new image */}
          <ProductImageUpload
            productId={product.product_id.toString()}
            onSuccess={handleImageSuccess}
          />
        </div>

        {/* Basic product information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Name *
            </label>
            <Input
              type="text"
              name="product_name"
              value={product.product_name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select
              name="category_id"
              selectedKeys={
                product.category_id ? [product.category_id.toString()] : []
              }
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (product) {
                  setProduct({
                    ...product,
                    category_id: selectedValue ? parseInt(selectedValue) : null,
                  });
                }
              }}
              className="w-full"
              placeholder="-- Select Category --"
            >
              {categories.map((category) => (
                <SelectItem key={category.category_id.toString()}>
                  {category.category_name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            name="description"
            value={product.description || ""}
            onChange={handleChange}
            rows={5}
            placeholder="Enter product description"
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Price (THB) *
            </label>
            <Input
              type="number"
              name="price"
              value={product.price.toString()}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Stock Quantity
            </label>
            <Input
              type="number"
              name="stock_quantity"
              value={product.stock_quantity.toString()}
              onChange={handleChange}
              min="0"
              step="1"
              className="w-full"
            />
          </div>

          <div className="flex items-center pt-8">
            <Checkbox
              id="is_customizable"
              name="is_customizable"
              checked={product.is_customizable === 1}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="is_customizable" className="ml-2">
              Customizable Product
            </label>
          </div>
        </div>

        {/* Tags section */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tagsList.map((tag, index) => (
              <Chip
                key={index}
                color="secondary"
                onClose={() => handleRemoveTag(tag)}
              >
                {tag}
              </Chip>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" onClick={handleAddTag}>
              Add
            </Button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            color="secondary"
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </Button>
          <Button type="submit" color="primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
