"use client";
import { useState } from "react";
import Image from "next/image";
import ProductImageUpload from "@/components/ProductImageUpload";

interface ProductImage {
  image_id?: number;
  product_id: string;
  image_url: string;
  is_primary: number;
  color_id?: number;
}

interface ProductImageSectionProps {
  productId: string;
  imageUrl: string;
  productImages: ProductImage[];
  availableColors: Array<{
    color_id?: number;
    color_name: string;
    color_code: string;
  }>;
  onImageSuccess: (newImageUrl: string, colorId?: number) => void;
}

export default function ProductImageSection({
  productId,
  imageUrl,
  productImages,
  availableColors,
  onImageSuccess,
}: ProductImageSectionProps) {
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  return (
    <div className="mb-6 p-6 bg-gray-800 rounded-lg text-white">
      <h2 className="text-xl font-semibold mb-3">รูปภาพสินค้า</h2>

      {/* Display current image */}
      <div className="mb-4">
        <div className="relative w-64 h-64 border border-gray-600 rounded-lg overflow-hidden">
          {imageLoading ? (
            <div className="flex items-center justify-center h-full w-full bg-gray-700">
              <p className="text-gray-400">Loading image...</p>
            </div>
          ) : imageUrl ? (
            <Image
              src={imageUrl}
              alt="Product image"
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              priority
              className="object-cover"
              onError={(e) => {
                console.error("Image failed to load:", imageUrl);
                e.currentTarget.src = "/images/products/placeholder.jpg";
              }}
            />
          ) : (
            <Image
              src="/images/products/placeholder.jpg"
              alt="Product placeholder"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover"
            />
          )}
        </div>
      </div>

      {/* Upload new image */}
      <ProductImageUpload productId={productId} onSuccess={onImageSuccess} />

      {/* Display all product images if multiple */}
      {productImages.length > 1 && (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">
            Additional Product Images
          </h3>
          <div className="flex flex-wrap gap-3">
            {productImages
              .filter((img) => img.is_primary !== 1)
              .map((img, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 border border-gray-600 rounded-lg overflow-hidden"
                >
                  <Image
                    src={img.image_url}
                    alt={`Product image ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/products/placeholder.jpg";
                    }}
                  />
                  {img.color_id && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-3"
                      style={{
                        backgroundColor:
                          availableColors.find(
                            (c) => c.color_id === img.color_id
                          )?.color_code || "#000000",
                      }}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
