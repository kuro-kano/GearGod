"use client";
import { Card, Button, Badge } from "@heroui/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CategoryTags from "@/components/CategoryTags";

interface Product {
  product_id: string;
  product_name: string;
  category_name?: string;
  price: number;
  stock_quantity?: number;
  tags: string | null;
  image_url?: string;
  images?: Array<{ image_url: string; is_primary?: number }>;
  is_customizable?: number;
}

interface AdminProductCardProps {
  product: Product;
  onDelete?: (productId: string) => void;
  isPriority?: boolean;
}

// Default placeholder image path
const PLACEHOLDER_IMAGE = "/images/products/placeholder.jpg";

export default function AdminProductCard({
  product,
  onDelete,
  isPriority = false,
}: AdminProductCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(PLACEHOLDER_IMAGE);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Process image URL when component mounts or when product/imageError changes
  useEffect(() => {
    // Function to determine the image URL
    const determineImageUrl = () => {
      // Reset to placeholder if we had an error
      if (imageError) {
        return PLACEHOLDER_IMAGE;
      }

      // First try using the images array (if available)
      if (product.images && product.images.length > 0) {
        try {
          // Find primary image or use first one
          const mainImage =
            product.images.find((img) => img.is_primary === 1) || product.images[0];
          
          if (!mainImage || !mainImage.image_url) {
            throw new Error("Invalid image data in images array");
          }

          let url;
          if (mainImage.image_url.startsWith("/images/")) {
            url = mainImage.image_url;
          } else if (mainImage.image_url.includes("/")) {
            url = `/images/${mainImage.image_url}`;
          } else {
            url = `/images/products/${product.product_id}/${mainImage.image_url}`;
          }
          return url;
        } catch (error) {
          return PLACEHOLDER_IMAGE;
        }
      }
      // Fallback to single image_url (for backward compatibility)
      else if (product.image_url) {
        try {
          let url;
          if (product.image_url.startsWith("http")) {
            url = product.image_url;
          } else if (product.image_url.startsWith("/images/")) {
            url = product.image_url;
          } else if (product.image_url.includes("/")) {
            url = `/images/${product.image_url}`;
          } else {
            url = `/images/products/${product.product_id}/${product.image_url}`;
          }
          return url;
        } catch (error) {
          return PLACEHOLDER_IMAGE;
        }
      }

      // No image data available
      return PLACEHOLDER_IMAGE;
    };

    try {
      const url = determineImageUrl();
      
      // Make sure we never set an empty string as the URL
      if (!url || url === "") {
        setCurrentImageUrl(PLACEHOLDER_IMAGE);
      } else {
        setCurrentImageUrl(url);
      }
    } catch (error) {
      setCurrentImageUrl(PLACEHOLDER_IMAGE);
    }
  }, [product, imageError]);

  const handleImageError = () => {
    setImageError(true);
    setCurrentImageUrl(PLACEHOLDER_IMAGE);
  };

  const handleEditClick = () => {
    router.push(`/admin/products/${product.product_id}/edit`);
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(product.product_id);
    }
    setIsDeleteConfirmOpen(false);
  };

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
  };

  return (
    <Card
      className="text-white w-full sm:w-[280px] max-w-[280px] space-y-3 p-4"
      radius="lg"
      style={{
        boxShadow: isHovered
          ? "0 15px 30px rgba(156, 39, 176, 0.4), 0 10px 10px rgba(32, 17, 126, 0.25)"
          : "0 10px 20px rgba(156, 39, 176, 0.2), 0 6px 6px rgba(32, 17, 126, 0.15)",
        transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product image with optimized Next.js Image */}
      <div className="relative w-full h-40 sm:h-48">
        <Image
          src={currentImageUrl || PLACEHOLDER_IMAGE}
          alt={product.product_name || "Product image"}
          fill
          sizes="(max-width: 640px) 100vw, 280px"
          className="rounded-xl object-cover"
          onError={handleImageError}
          priority={isPriority}
        />
        
        {/* Admin badges */}
        <div className="absolute top-2 right-4 flex flex-col gap-1">
          {product.is_customizable === 1 && (
            <Badge color="success" content="Custom">""</Badge>
          )}
          {(product.stock_quantity === 0 || product.stock_quantity === undefined) && (
            <Badge color="danger" content="หมด">Out of Stock</Badge>
          )}
        </div>
      </div>

      {/* Product info */}
      <div className="flex flex-col space-y-2">
        {/* Product tags */}
        <div className="my-1">
          <CategoryTags
            tags={product.tags}
            categoryName={product.category_name}
          />
        </div>

        {/* Product name */}
        <div className="font-bold text-sm sm:text-base line-clamp-2">
          {product.product_name}
        </div>

        {/* Product price and stock */}
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">
            ฿{product.price.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">
            Stock: {product.stock_quantity ?? "N/A"}
          </div>
        </div>

        {/* Admin actions */}
        <div className="flex justify-between pt-2">
          <Button 
            size="sm" 
            color="primary" 
            onPress={handleEditClick}
            className="flex-1 mr-2"
          >
            Edit
          </Button>
          <Button 
            size="sm" 
            color="danger" 
            onPress={handleDeleteClick}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
        
        {/* Delete confirmation */}
        {isDeleteConfirmOpen && (
          <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center p-4">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="mb-4">Are you sure you want to delete this product?</p>
              <div className="flex justify-center space-x-2">
                <Button size="sm" color="danger" onPress={confirmDelete}>
                  Yes, Delete
                </Button>
                <Button size="sm" color="secondary" onPress={cancelDelete}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
