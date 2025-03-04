"use client";
import { Card } from "@heroui/react";
import { useState } from "react";
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
}

interface ShopProductCardProps {
  product: Product;
  onClick?: () => void;
}

export default function ShopProductCard({
  product,
  onClick = () => {},
}: ShopProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle the image URL properly
  const imageUrl =
    imageError || !product.image_url
      ? "/images/products/placeholder.jpg"
      : product.image_url.startsWith("http")
      ? product.image_url
      : product.image_url.startsWith("/")
      ? product.image_url
      : `/images/products/${product.product_id}/${product.image_url}`;

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
          {/* Replace img with Next.js Image component */}
          <div className="relative w-full h-48">
            <Image
              src={imageUrl}
              alt={product.product_name}
              fill
              sizes="(max-width: 768px) 100vw, 250px"
              className="rounded-xl object-cover"
              onError={() => setImageError(true)}
              priority={false}
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
