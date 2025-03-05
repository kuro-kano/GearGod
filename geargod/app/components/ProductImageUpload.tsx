"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { showToast } from "@components/ToastAlert"; // Import your custom toast

interface ProductImageUploadProps {
  productId: string;
  onSuccess: (imageUrl: string) => void;
  initialImages?: string[];
}

export default function ProductImageUpload({
  productId,
  onSuccess,
  initialImages = [],
}: ProductImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const file = files[0]; // Take first file

    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/products/${productId}/image`, {
        method: "POST",
        body: formData,
      });

      // Handle non-OK responses more safely
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage;

        if (contentType && contentType.includes("application/json")) {
          // Try to parse as JSON
          const errorData = await response.json();
          errorMessage = errorData.message || "Failed to upload image";
        } else {
          // Use status text
          errorMessage = `Upload failed (${response.status}: ${response.statusText})`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Use the custom toast for success
      showToast({
        title: "Image Uploaded",
        description: "Image has been uploaded successfully",
        color: "success",
      });

      onSuccess(data.imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);

      // Use the custom toast for error
      showToast({
        title: "Upload Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to upload image. Please try again.",
        color: "danger",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <input
          type="file"
          id="product-image"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload(e.target.files)}
        />
        <label htmlFor="product-image">
          <Button
            color="primary"
            disabled={isUploading}
            onPress={() => document.getElementById("product-image")?.click()}
            className="cursor-pointer"
          >
            {isUploading ? "Uploading..." : "Upload New Image"}
          </Button>
        </label>
        <p className="text-sm text-gray-500">Max file size: 5MB</p>
      </div>
    </div>
  );
}
