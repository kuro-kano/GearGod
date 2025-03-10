"use client";
import { useState } from "react";
import {
  Button,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { XCircle, ImagePlus } from "lucide-react";
import Image from "next/image";
import ProductImageUpload from "@/components/ProductImageUpload";

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

interface ColorVariantsSectionProps {
  productId: string;
  availableColors: ColorVariant[];
  selectedColors: ColorVariant[];
  productImages: ProductImage[];
  onColorsChange: (colors: ColorVariant[]) => void;
  onImageSuccess: (newImageUrl: string, colorId?: number) => void;
}

export default function ColorVariantsSection({
  productId,
  availableColors,
  selectedColors,
  productImages,
  onColorsChange,
  onImageSuccess,
}: ColorVariantsSectionProps) {
  const [selectedColorId, setSelectedColorId] = useState<string>("");
  const [newColorUpload, setNewColorUpload] = useState<number | null>(null);

  const addColorFromDropdown = () => {
    const colorId = parseInt(selectedColorId);
    if (!colorId) return;

    // Check if color is already selected
    if (selectedColors.some((c) => c.color_id === colorId)) {
      return; // Color already selected
    }

    // Find the color in available colors
    const colorToAdd = availableColors.find((c) => c.color_id === colorId);
    if (!colorToAdd) return;

    // Add to selected colors
    onColorsChange([...selectedColors, colorToAdd]);

    // Reset dropdown
    setSelectedColorId("");
  };

  const toggleColorSelection = (colorId: number) => {
    // Prevent removing color_id 51
    if (colorId === 51) return;
    onColorsChange(selectedColors.filter((c) => c.color_id !== colorId));
  };

  // Set up color for image upload
  const setupColorImageUpload = (colorId: number) => {
    setNewColorUpload(colorId);
  };

  // Reset color image upload
  const cancelColorImageUpload = () => {
    setNewColorUpload(null);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Color Variants</h2>

      {/* Replace color grid with dropdown selector */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Add Color Variants</h3>
        <div className="flex gap-2">
          <Select
            label="Select a color"
            placeholder="Choose a color variant"
            className="min-w-[240px]"
            selectedKeys={selectedColorId ? [selectedColorId] : []}
            onChange={(e) => setSelectedColorId(e.target.value)}
          >
            {availableColors
              .filter(
                (color) =>
                  !selectedColors.some((c) => c.color_id === color.color_id)
              )
              .map((color) => (
                <SelectItem
                  key={color.color_id!.toString()}
                  textValue={color.color_name}
                  startContent={
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: color.color_code }}
                    />
                  }
                >
                  {color.color_name} (+{color.add_price} THB)
                </SelectItem>
              ))}
          </Select>
          <Button
            color="primary"
            isDisabled={!selectedColorId}
            onPress={addColorFromDropdown}
          >
            Add Color
          </Button>
        </div>
      </div>

      {/* Selected colors table with image upload option */}
      {selectedColors.length > 0 && (
        <div>
          <h3 className="text-md font-semibold mb-2">
            Selected Color Variants
          </h3>
          <Table aria-label="Selected color variants">
            <TableHeader>
              <TableColumn>COLOR</TableColumn>
              <TableColumn>NAME</TableColumn>
              <TableColumn>ADDITIONAL PRICE</TableColumn>
              <TableColumn>IMAGES</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {selectedColors.map((color) => (
                <TableRow key={color.color_id}>
                  <TableCell>
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: color.color_code }}
                    />
                  </TableCell>
                  <TableCell>{color.color_name}</TableCell>
                  <TableCell>+{color.add_price} THB</TableCell>
                  <TableCell>
                    {/* Show color-specific images */}
                    <div className="flex space-x-2">
                      {productImages
                        .filter((img) => img.color_id === color.color_id)
                        .map((img, idx) => (
                          <div
                            key={idx}
                            className="relative w-8 h-8 border border-gray-600 rounded"
                          >
                            <Image
                              src={img.image_url}
                              alt={`${color.color_name} variant`}
                              fill
                              sizes="32px"
                              className="object-cover rounded"
                            />
                          </div>
                        ))}

                      {/* Add image button */}
                      {newColorUpload === color.color_id ? (
                        <div className="bg-gray-700 p-2 rounded">
                          <ProductImageUpload
                            productId={productId}
                            onSuccess={(url) =>
                              onImageSuccess(url, color.color_id)
                            }
                            colorId={color.color_id}
                            small={true}
                          />
                          <Button
                            size="sm"
                            variant="flat"
                            color="danger"
                            className="mt-2"
                            onPress={cancelColorImageUpload}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          isIconOnly
                          variant="flat"
                          color="secondary"
                          onPress={() => setupColorImageUpload(color.color_id!)}
                        >
                          <ImagePlus size={14} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      isIconOnly
                      variant="flat"
                      color="danger"
                      isDisabled={color.color_id === 51}
                      onPress={() => toggleColorSelection(color.color_id!)}
                    >
                      <XCircle size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
