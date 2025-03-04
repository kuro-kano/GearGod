'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';

interface ProductImageUploadProps {
  productId: string;
  onSuccess?: (imageUrl: string) => void;
}

export default function ProductImageUpload({ productId, onSuccess }: ProductImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', productId);
      
      const response = await fetch('/api/products/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      // Call success callback with new image URL
      if (onSuccess) {
        onSuccess(data.imageUrl);
      }
      
      // Reset file input
      setFile(null);
      
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-white/70
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-purple-50 file:text-purple-700
            hover:file:bg-purple-100"
        />
        
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          color="primary"
          className="mt-2"
        >
          {uploading ? 'Uploading...' : 'Upload Product Image'}
        </Button>
        
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
      </div>
    </div>
  );
}