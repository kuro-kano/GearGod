"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { ImagePlus, Upload } from "lucide-react";
import { showToast } from "@components/ToastAlert"; // Import your custom toast

interface ProductImageUploadProps {
  productId: string;
  onSuccess: (imageUrl: string, colorId?: number) => void;
  initialImages?: string[];
  colorId?: number; // Optional color ID for color-specific images
  small?: boolean; // Optional flag for smaller UI
}

export default function ProductImageUpload({
  productId,
  onSuccess,
  initialImages = [],
  colorId,
  small = false
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
      
      // Add color ID if provided
      if (colorId !== undefined) {
        formData.append("colorId", colorId.toString());
      }

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
        description: colorId 
          ? `Color variant image has been uploaded successfully` 
          : "Image has been uploaded successfully",
        color: "success",
      });

      // Pass back the color ID with the image URL if provided
      onSuccess(data.imageUrl, colorId);
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

  // Return compact UI for color variant images
  if (small) {
    return (
      <div className="flex flex-col items-center">
        <input
          type="file"
          id={`color-image-${colorId || 'main'}`}
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload(e.target.files)}
          disabled={isUploading}
        />
        <label 
          htmlFor={`color-image-${colorId || 'main'}`}
          className={`
            cursor-pointer flex items-center justify-center 
            ${isUploading ? 'bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} 
            w-8 h-8 rounded transition-colors
          `}
          title="Upload color variant image"
        >
          {isUploading ? (
            <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <ImagePlus size={14} />
          )}
        </label>
        {isUploading && <p className="text-xs mt-1">Uploading...</p>}
      </div>
    );
  }

  // Regular full-sized UI
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <input
          type="file"
          id={`product-image-${colorId || 'main'}`}
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload(e.target.files)}
          disabled={isUploading}
        />
        <label htmlFor={`product-image-${colorId || 'main'}`}>
          <Button
            color="primary"
            disabled={isUploading}
            onPress={() => document.getElementById(`product-image-${colorId || 'main'}`)?.click()}
            className="cursor-pointer"
            startContent={!isUploading && <Upload size={16} />}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                Uploading...
              </>
            ) : colorId ? "Upload Color Image" : "Upload New Image"}
          </Button>
        </label>
        <p className="text-sm text-gray-500">Max file size: 5MB</p>
      </div>
    </div>
  );
}