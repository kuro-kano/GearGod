import React, { useState } from 'react';
import Image from 'next/image';
import { showToast } from './ToastAlert';

interface QRPromptPayProps {
  amount: number;
  orderId: string;
}

const QRPromptPay: React.FC<QRPromptPayProps> = ({ amount, orderId }) => {
  const [, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload the file
      await handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('orderId', orderId);

      const response = await fetch('/api/upload/payment', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      showToast({
        title: "Success",
        description: "Payment slip uploaded successfully",
        color: "success"
      });

    } catch (error) {
      console.error('Upload error:', error);
      showToast({
        title: "Error",
        description: "Failed to upload payment slip",
        color: "danger"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-black/20 rounded-lg">
      <div className="flex justify-center">
        <Image
          src="/uploads/qr-code/qr.png"
          alt="PromptPay QR Code"
          width={200}
          height={200}
          className="rounded-lg"
        />
      </div>
      
      <div className="text-center">
        <p className="text-lg font-semibold mb-2">Amount: ฿{amount.toFixed(2)}</p>
        <p className="text-sm text-gray-400 mb-4">Scan QR code to pay via PromptPay</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Upload Payment Confirmation</p>
        <div className="flex flex-col items-center gap-4">
          <label className="w-full cursor-pointer">
            <div className={`border-2 border-dashed border-gray-600 rounded-lg p-4 text-center 
              ${isUploading ? 'opacity-50' : 'hover:border-blue-500'} transition-colors`}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
              <p className="text-gray-400">
                {isUploading ? 'Uploading...' : 'Click to upload payment slip'}
              </p>
            </div>
          </label>
          
          {previewUrl && (
            <div className="relative w-full h-48">
              <Image
                src={previewUrl}
                alt="Payment confirmation"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRPromptPay;