"use client";

import { useState, useEffect, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import ProductImageSection from "@/components/admin/ProductImageSection";
import ProductInfoForm from "@/components/admin/ProductInfoForm";
import ColorVariantsSection from "@/components/admin/ColorVariantsSection";
import TagsInputSection from "@/components/admin/TagsInputSection";

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
  [key: string]: string | number | null | undefined;
}

interface Category {
  category_id: number;
  category_name: string;
}

interface ColorVariant {
  color_id?: number;
  color_name: string;
  color_code: string;
  add_price: number;
  isSelected?: boolean;
}

interface ProductImage {
  image_id?: number;
  product_id: string;
  image_url: string;
  is_primary: number;
  color_id?: number;
}

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [productImages, setProductImages] = useState<ProductImage[]>([]);

  const [availableColors, setAvailableColors] = useState<ColorVariant[]>([]);
  const [selectedColors, setSelectedColors] = useState<ColorVariant[]>([]);

  const [tagsList, setTagsList] = useState<string[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        console.log("Product data from API:", data);

        setProduct(data);

        if (data.images && data.images.length > 0) {
          console.log("Product has multiple images:", data.images.length);

          const mainImage =
            data.images.find(
              (img: { is_primary: number }) => img.is_primary === 1
            ) || data.images[0];
          let finalImageUrl;

          if (mainImage.image_url.startsWith("/images/")) {
            finalImageUrl = mainImage.image_url;
          } else if (mainImage.image_url.includes("/")) {
            finalImageUrl = `/images/${mainImage.image_url}`;
          } else {
            finalImageUrl = `/images/products/${id}/${mainImage.image_url}`;
          }

          console.log("Setting primary image URL to:", finalImageUrl);
          setImageUrl(finalImageUrl);

          setProductImages(data.images);
        }
        else if (data.image_url) {
          let finalImageUrl;

          if (data.image_url.startsWith("/images/")) {
            finalImageUrl = data.image_url;
          } else if (data.image_url.includes("/")) {
            finalImageUrl = `/images/${data.image_url}`;
          } else {
            finalImageUrl = `/images/products/${data.product_id}/${data.image_url}`;
          }

          console.log("Setting image URL to:", finalImageUrl);
          setImageUrl(finalImageUrl);
        } else {
          console.log("No image URL found in product data");
          setImageUrl("");
        }

        if (data.is_customizable === 1) {
          fetchProductColors(data.product_id);
        }

        if (data.tags) {
          setTagsList(data.tags.split(",").map((tag: string) => tag.trim()));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setFormError("Failed to load product data");
      }
    };

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

    const fetchAvailableColors = async () => {
      try {
        const response = await fetch("/api/colors");
        if (!response.ok) {
          throw new Error("Failed to fetch colors");
        }
        const data = await response.json();
        setAvailableColors(data);
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };

    const fetchProductColors = async (productId: string) => {
      try {
        const response = await fetch(`/api/products/${productId}/colors`);
        if (!response.ok) {
          throw new Error("Failed to fetch product colors");
        }
        const data = await response.json();
        setSelectedColors(data);
      } catch (error) {
        console.error("Error fetching product colors:", error);
      }
    };

    if (id) {
      fetchProduct();
      fetchCategories();
      fetchAvailableColors();
    }
  }, [id]);

  const handleImageSuccess = (newImageUrl: string, colorId?: number) => {
    console.log("Image uploaded successfully:", newImageUrl);

    if (colorId) {
      const newImage = {
        image_url: newImageUrl,
        product_id: product?.product_id || "",
        is_primary: 0,
        color_id: colorId,
      };

      setProductImages((prev) => [...prev, newImage]);
    } else {
      setImageUrl(newImageUrl);

      const newImage = {
        image_url: newImageUrl,
        product_id: product?.product_id || "",
        is_primary: 1,
      };

      setProductImages((prev) => {
        if (prev.length === 0) {
          return [newImage];
        }

        return [
          { ...newImage, is_primary: 1 },
          ...prev.filter((img) => img.is_primary !== 1),
        ];
      });

      if (product) {
        setProduct({
          ...product,
          image_url: newImageUrl,
        });
      }
    }

    setSuccessMessage("Product image updated successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleProductChange = (updatedProduct: Product) => {
    setProduct(updatedProduct);
  };

  const handleTagsChange = (newTags: string[]) => {
    if (product) {
      setProduct({
        ...product,
        tags: newTags.join(","),
      });
    }
    setTagsList(newTags);
  };

  const handleColorsChange = (colors: ColorVariant[]) => {
    setSelectedColors(colors);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!product) return;

    try {
      setIsSubmitting(true);
      setFormError(null);

      if (!product.product_name || product.price <= 0) {
        setFormError("Product name and valid price are required");
        setIsSubmitting(false);
        return;
      }

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
        colors: product.is_customizable === 1 ? selectedColors : [],
      };

      console.log("Submitting product update:", productData);

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update product");
      }

      setSuccessMessage("Product updated successfully!");

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

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen ambient-bg">
        <div className="text-xl">Loading product data...</div>
      </div>
    );
  }

  return (
    <main className="ambient-bg">
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          แก้ไขสินค้า: {product.product_name}
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
          <ProductImageSection
            productId={product.product_id}
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
              productId={product.product_id}
              availableColors={availableColors}
              selectedColors={selectedColors}
              productImages={productImages}
              onColorsChange={handleColorsChange}
              onImageSuccess={handleImageSuccess}
            />
          )}

          <TagsInputSection
            tagsList={tagsList} // Changed from initialTags to tagsList
            onTagsChange={handleTagsChange}
          />

          <div className="flex justify-end space-x-4 pt-4 font-kanit-regular">
            <Button
              type="button"
              color="secondary"
              onPress={() => router.push("/admin/products")}
            >
              ยกเลิก
            </Button>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
