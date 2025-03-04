"use client";
import { Divider } from "@heroui/divider";
import { CheckboxGroup, Checkbox, Chip } from "@heroui/react";
import { useState, useEffect } from "react";
import PriceSlider from "./PriceSlider";

interface ProductFiltersProps {
  selectedTypes: string[];
  selectedBrands: string[];
  initialPriceRange: { min: number; max: number };
  onTypeChange: (types: string[]) => void;
  onBrandChange: (brands: string[]) => void;
  onPriceChange: (min: number, max: number) => void;
}

export default function ProductFilters({
  selectedTypes = [],
  selectedBrands = [],
  initialPriceRange = { min: 0, max: 5000 },
  onTypeChange,
  onBrandChange,
  onPriceChange,
}: ProductFiltersProps) {
  // Local state to track selected filters
  const [priceRange, setPriceRange] = useState(initialPriceRange);

  // Update local state when props change
  useEffect(() => {
    setPriceRange(initialPriceRange);
  }, [initialPriceRange]);

  // Handle filter type selection
  const handleTypeChange = (values: string[]) => {
    onTypeChange(values);
  };

  // Handle brand selection
  const handleBrandChange = (values: string[]) => {
    onBrandChange(values);
  };

  // Handle price range change from PriceSlider
  const handlePriceChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    onPriceChange(min, max);
  };

  // Handle removing a filter chip
  const removeTypeFilter = (value: string) => {
    const newTypes = selectedTypes.filter((type) => type !== value);
    onTypeChange(newTypes);
  };

  // Handle removing a brand chip
  const removeBrandFilter = (value: string) => {
    const newBrands = selectedBrands.filter((brand) => brand !== value);
    onBrandChange(newBrands);
  };

  // Map of values to display names
  const typeDisplayNames: Record<string, string> = {
    "pc-case": "เคสคอมพิวเตอร์",
    headset: "หูฟัง",
    mouse: "เมาส์",
    keyboard: "คีย์บอร์ด",
    mousepad: "แผ่นรองเมาส์",
  };

  const brandDisplayNames: Record<string, string> = {
    steelseries: "Steelseries",
    hyperx: "HyperX",
    beyerdynamics: "BeyerDynamics",
    "cooler-master": "Cooler Master",
    razer: "Razer",
    logitech: "Logitech",
    nzxt: "NZXT",
  };

  return (
    <div className="w-64 h-auto px-3 py-3 bg-[#1D1C21] rounded-md border-[#1D1C21] p-5 shadow-foreground-700 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-60">
      {/* Display selected filters as chips */}
      {(selectedTypes.length > 0 ||
        selectedBrands.length > 0 ||
        priceRange.min > 0 ||
        priceRange.max < 5000) && (
        <div className="mb-4">
          <h2 className="text-white font-kanit-regular text-md mb-2">
            ตัวกรองที่เลือก
          </h2>
          <div className="flex flex-wrap gap-2">
            {selectedTypes.map((type) => (
              <Chip
                key={type}
                onClose={() => removeTypeFilter(type)}
                size="sm"
                variant="bordered"
                className="text-white"
              >
                {typeDisplayNames[type]}
              </Chip>
            ))}

            {selectedBrands.map((brand) => (
              <Chip
                key={brand}
                onClose={() => removeBrandFilter(brand)}
                size="sm"
                variant="bordered"
                className="text-white"
              >
                {brandDisplayNames[brand]}
              </Chip>
            ))}

            {(priceRange.min > 0 || priceRange.max < 5000) && (
              <Chip
                onClose={() => {
                  setPriceRange({ min: 0, max: 5000 });
                  onPriceChange(0, 5000);
                }}
                size="sm"
                variant="bordered"
                className="text-white"
              >
                ฿{priceRange.min}-฿{priceRange.max}
              </Chip>
            )}
          </div>
          <Divider className="my-4" />
        </div>
      )}

      <h1 className="text-white font-kanit-regular text-md">ประเภทสินค้า</h1>
      <br />

      <CheckboxGroup
        size="sm"
        className="font-kanit-regular"
        value={selectedTypes}
        onChange={handleTypeChange}
      >
        <Checkbox value="pc-case">เคสคอมพิวเตอร์</Checkbox>
        <Checkbox value="headset">หูฟัง</Checkbox>
        <Checkbox value="mouse">เมาส์</Checkbox>
        <Checkbox value="keyboard">คีย์บอร์ด</Checkbox>
        <Checkbox value="mousepad">แผ่นรองเมาส์</Checkbox>
      </CheckboxGroup>

      <Divider className="my-4" />
      <h1 className="text-white font-kanit-regular text-md">แบรนด์</h1>
      <br />

      <CheckboxGroup
        size="sm"
        value={selectedBrands}
        onChange={handleBrandChange}
      >
        <Checkbox value="steelseries">Steelseries</Checkbox>
        <Checkbox value="hyperx">HyperX</Checkbox>
        <Checkbox value="beyerdynamics">BeyerDynamics</Checkbox>
        <Checkbox value="cooler-master">Cooler Master</Checkbox>
        <Checkbox value="razer">Razer</Checkbox>
        <Checkbox value="logitech">Logitech</Checkbox>
        <Checkbox value="nzxt">NZXT</Checkbox>
      </CheckboxGroup>

      <Divider className="my-4" />
      <h1 className="text-white font-kanit-regular text-md">ช่วงราคา</h1>
      <br />
      <PriceSlider
        onPriceChange={handlePriceChange}
        initialMin={priceRange.min}
        initialMax={priceRange.max}
      />
    </div>
  );
}
