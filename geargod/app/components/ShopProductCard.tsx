"use client";
import { Card } from "@heroui/react";
import { useState, useEffect } from "react";
import { Link } from "@heroui/link";
import Image from "next/image";
import CategoryTags from "./CategoryTags";

interface Product {
  product_id: string;
  product_name: string;
  category_name?: string;
  price: number;
  tags: string | null;
  image_url?: string;
  images?: Array<{ image_url: string; is_primary?: number }>;
}

interface ShopProductCardProps {
  product: Product;
  onClick?: () => void;
  isPriority?: boolean;
}

// Default placeholder image path
const PLACEHOLDER_IMAGE = "/images/products/placeholder.jpg";

export default function ShopProductCard({
  product,
  onClick = () => {},
  isPriority = false,
}: ShopProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(PLACEHOLDER_IMAGE);

  // DEBUG: Log product data when component mounts
  useEffect(() => {
    console.group(`ShopProductCard Debug - Product ID: ${product.product_id}`);
    console.log("Full Product Data:", product);
    console.log("Product Name:", product.product_name);
    console.log("Has images array:", Boolean(product.images && product.images.length > 0));
    if (product.images && product.images.length > 0) {
      console.log("Images array:", product.images);
      console.log("First image:", product.images[0]);
    }
    console.log("Has image_url:", Boolean(product.image_url));
    if (product.image_url) {
      console.log("Image URL:", product.image_url);
    }
    console.groupEnd();
  }, [product]);

  // Process image URL when component mounts or when product/imageError changes
  useEffect(() => {
    // Function to determine the image URL
    const determineImageUrl = () => {
      // Reset to placeholder if we had an error
      if (imageError) {
        console.log(`[${product.product_id}] Using placeholder due to previous error`);
        return PLACEHOLDER_IMAGE;
      }

      // First try using the images array (if available)
      if (product.images && product.images.length > 0) {
        console.log(`[${product.product_id}] Product has images array:`, product.images.length);
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
          console.log(`[${product.product_id}] Using image from images array:`, url);
          return url;
        } catch (error) {
          console.error(`[${product.product_id}] Error processing image from images array:`, error);
          return PLACEHOLDER_IMAGE;
        }
      }
      // Fallback to single image_url (for backward compatibility)
      else if (product.image_url) {
        console.log(`[${product.product_id}] Using single image_url:`, product.image_url);
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
          console.log(`[${product.product_id}] Processed image URL:`, url);
          return url;
        } catch (error) {
          console.error(`[${product.product_id}] Error processing image_url:`, error);
          return PLACEHOLDER_IMAGE;
        }
      }

      // No image data available
      console.log(`[${product.product_id}] No image data, using placeholder`);
      return PLACEHOLDER_IMAGE;
    };

    try {
      const url = determineImageUrl();
      
      // Make sure we never set an empty string as the URL
      if (!url || url === "") {
        console.warn(`[${product.product_id}] Empty URL detected, using placeholder`);
        setCurrentImageUrl(PLACEHOLDER_IMAGE);
      } else {
        console.log(`[${product.product_id}] Final image URL set to:`, url);
        setCurrentImageUrl(url);
      }
    } catch (error) {
      console.error(`[${product.product_id}] Error setting image URL:`, error);
      setCurrentImageUrl(PLACEHOLDER_IMAGE);
    }
  }, [product, imageError]);

  const handleImageError = () => {
    console.error(`[${product.product_id}] Image failed to load:`, currentImageUrl);
    setImageError(true);
    setCurrentImageUrl(PLACEHOLDER_IMAGE);
  };

  return (
    <Link href={`/shop/product/${product.product_id}`}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        className="transition-transform duration-300 cursor-pointer"
        style={{ transform: isHovered ? "translateY(-5px)" : "none" }}
      >
        <Card
          className="w-[250px] space-y-5 p-4"
          radius="lg"
          style={{
            boxShadow: isHovered
              ? "0 15px 30px rgba(156, 39, 176, 0.4), 0 10px 10px rgba(32, 17, 126, 0.25)"
              : "0 10px 20px rgba(156, 39, 176, 0.2), 0 6px 6px rgba(32, 17, 126, 0.15)",
            transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
          }}
        >
          {/* Product image with optimized Next.js Image */}
          <div className="relative w-full h-48">
            <Image
              src={currentImageUrl || PLACEHOLDER_IMAGE} // Ensure we always have a valid URL
              alt={product.product_name || "Product image"}
              fill
              sizes="(max-width: 768px) 100vw, 250px"
              className="rounded-xl object-cover"
              onError={handleImageError}
              priority={isPriority}
            />
          </div>

          {/* Product tags */}
          <div className="my-2">
            <CategoryTags
              tags={product.tags}
              categoryName={product.category_name}
            />
          </div>

          {/* Product name */}
          <div className="font-bold line-clamp-2">{product.product_name}</div>

          {/* Product price */}
          <div className="text-sm font-medium">
            ฿{product.price.toLocaleString()}
          </div>
        </Card>
      </div>
    </Link>
  );
}