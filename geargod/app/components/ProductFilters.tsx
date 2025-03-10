"use client";
import { Divider } from "@heroui/divider";
import { CheckboxGroup, Checkbox, Chip } from "@heroui/react";
import { useState, useEffect } from "react";
import PriceSlider from "./PriceSlider";
import "@/styles/globals.css";

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
    console.log(values);
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
    "Computer-Cases": "เคสคอมพิวเตอร์",
    headset: "หูฟัง",
    mouse: "เมาส์",
    keyboard: "คีย์บอร์ด",
    mousepad: "แผ่นรองเมาส์",
  };

  const brandDisplayNames: Record<string, string> = {
    steelseries: "Steelseries",
    hyperx: "HyperX",
    beyerdynamics: "BeyerDynamics",
    "Cooler Master": "Cooler Master",
    aerocool: "Aerocool",
    razer: "Razer",
    logitech: "Logitech",
    nzxt: "NZXT",
    loga: "Loga",
  };

  return (
    <div className="dark text-white w-64 h-auto px-3 py-3 bg-[#1D1C21] rounded-md border-[#1D1C21] p-5 shadow-foreground-700 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-60">
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
        <Checkbox value="Computer-Cases" className="!text-white">
          <span className="!text-white">เคสคอมพิวเตอร์</span>
        </Checkbox>
        <Checkbox value="headset" className="!text-white">
          <span className="!text-white">หูฟัง</span>
        </Checkbox>
        <Checkbox value="mouse" className="!text-white">
          <span className="!text-white">เมาส์</span>
        </Checkbox>
        <Checkbox value="keyboard" className="!text-white">
          <span className="!text-white">คีย์บอร์ด</span>
        </Checkbox>
        <Checkbox value="mousepad" className="!text-white">
          <span className="!text-white">แผ่นรองเมาส์</span>
        </Checkbox>
      </CheckboxGroup>

      <Divider className="my-4" />
      <h1 className="text-white font-kanit-regular text-md">แบรนด์</h1>
      <br />

      <CheckboxGroup
        size="sm"
        className="font-kanit-regular dark"
        value={selectedBrands}
        onChange={handleBrandChange}
      >
        <Checkbox value="steelseries" className="!text-white">
          <span className="!text-white">Steelseries</span>
        </Checkbox>
        <Checkbox value="hyperx" className="!text-white">
          <span className="!text-white">HyperX</span>
        </Checkbox>
        <Checkbox value="beyerdynamics" className="!text-white">
          <span className="!text-white">BeyerDynamics</span>
        </Checkbox>
        <Checkbox value="Cooler Master" className="!text-white">
          <span className="!text-white">Cooler Master</span>
        </Checkbox>
        <Checkbox value="aerocool" className="!text-white">
          <span className="!text-white">Aerocool</span>
        </Checkbox>
        <Checkbox value="razer" className="!text-white">
          <span className="!text-white">Razer</span>
        </Checkbox>
        <Checkbox value="logitech" className="!text-white">
          <span className="!text-white">Logitech</span>
        </Checkbox>
        <Checkbox value="nzxt" className="!text-white">
          <span className="!text-white">NZXT</span>
        </Checkbox>
        <Checkbox value="loga" className="!text-white">
          <span className="!text-white">Loga</span>
        </Checkbox>
      </CheckboxGroup>

      <Divider className="my-4" />
      <h1 className="text-white font-kanit-regular text-md">ช่วงราคา</h1>
      <br />
      <PriceSlider
        onPriceChange={handlePriceChange}
        initialMin={0}
        initialMax={5000}
      />
    </div>
  );
}
