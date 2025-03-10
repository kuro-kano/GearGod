"use client";
import { ChangeEvent } from "react";
import { Input, Textarea, Select, SelectItem, Checkbox } from "@heroui/react";

interface Category {
  category_id: number;
  category_name: string;
}

// Updated Product interface to match the parent component
interface Product {
  product_id: string;
  product_name: string;
  description: string | null;
  category_id: number | null;
  price: number;
  stock_quantity: number;
  is_customizable: number;
  tags: string | null; // Added missing required property
  [key: string]: string | number | null | undefined; // More specific types
}

interface ProductInfoFormProps {
  product: Product;
  categories: Category[];
  onProductChange: (updatedProduct: Product) => void;
}

export default function ProductInfoForm({
  product,
  categories,
  onProductChange,
}: ProductInfoFormProps) {
  // Handle text/number input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onProductChange({
      ...product,
      [name]: value,
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onProductChange({
      ...product,
      [name]: checked ? 1 : 0,
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Product Name *
          </label>
          <Input
            type="text"
            name="product_name"
            value={product.product_name}
            onChange={handleChange}
            required
            placeholder="Enter product name"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" id="category-label">
            Category
          </label>
          <Select
            name="category_id"
            selectedKeys={
              product.category_id ? [product.category_id.toString()] : []
            }
            onChange={(e) => {
              const selectedValue = e.target.value;
              onProductChange({
                ...product,
                category_id: selectedValue ? parseInt(selectedValue) : null,
              });
            }}
            className="w-full"
            placeholder="-- Select Category --"
            aria-labelledby="category-label"
          >
            {categories.map((category) => (
              <SelectItem key={category.category_id.toString()}>
                {category.category_name}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          name="description"
          value={product.description || ""}
          onChange={handleChange}
          rows={5}
          placeholder="Enter product description"
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Price (THB) *
          </label>
          <Input
            type="number"
            name="price"
            value={product.price.toString()}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Stock Quantity
          </label>
          <Input
            type="number"
            name="stock_quantity"
            value={product.stock_quantity.toString()}
            onChange={handleChange}
            min="0"
            step="1"
            className="w-full"
          />
        </div>

        <div className="flex items-center pt-8">
          <Checkbox
            id="is_customizable"
            name="is_customizable"
            checked={product.is_customizable === 1}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="is_customizable" className="ml-2">
            Customizable Product
          </label>
        </div>
      </div>
    </>
  );
}
