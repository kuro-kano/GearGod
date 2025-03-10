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
  const [currentImageUrl, setCurrentImageUrl] =
    useState<string>(PLACEHOLDER_IMAGE);

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
            product.images.find((img) => img.is_primary === 1) ||
            product.images[0];

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
          className="dark w-full max-w-[250px] space-y-4 p-3 sm:p-4"
          radius="lg"
          style={{
            boxShadow: isHovered
              ? "0 15px 30px rgba(156, 39, 176, 0.4), 0 10px 10px rgba(32, 17, 126, 0.25)"
              : "0 10px 20px rgba(156, 39, 176, 0.2), 0 6px 6px rgba(32, 17, 126, 0.15)",
            transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
          }}
        >
          {/* Product image with optimized Next.js Image */}
          <div className="relative w-full h-40 sm:h-48">
            <Image
              src={currentImageUrl || PLACEHOLDER_IMAGE}
              alt={product.product_name || "Product image"}
              fill
              sizes="(max-width: 640px) 100vw, 250px"
              className="rounded-xl object-cover"
              onError={handleImageError}
              priority={isPriority}
            />
          </div>

          {/* Product tags */}
          <div className="my-1 sm:my-2">
            <CategoryTags
              tags={product.tags}
              categoryName={product.category_name}
            />
          </div>

          {/* Product name */}
          <div className="text-white font-bold text-sm sm:text-base line-clamp-2">
            {product.product_name}
          </div>

          {/* Product price */}
          <div className="text-white text-xs sm:text-sm font-medium">
            ฿{product.price.toLocaleString()}
          </div>
        </Card>
      </div>
    </Link>
  );
}
