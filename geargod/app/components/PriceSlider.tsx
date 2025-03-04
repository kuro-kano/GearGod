"use client";
import { useState, useEffect } from "react";
import { Slider } from "@heroui/react";

interface PriceSliderProps {
  onPriceChange: (min: number, max: number) => void;
  initialMin?: number;
  initialMax?: number;
}

export default function PriceSlider({
  onPriceChange,
  initialMin = 0,
  initialMax = 50000,
}: PriceSliderProps) {
  const [value, setValue] = useState([initialMin, initialMax]);

  // Update local state when props change
  useEffect(() => {
    setValue([initialMin, initialMax]);
  }, [initialMin, initialMax]);

  const handleChange = (newValue: any) => {
    // Simplified handler
    let min, max;

    if (Array.isArray(newValue)) {
      [min, max] = newValue;
    } else {
      min = initialMin;
      max = initialMax;
    }

    setValue([min, max]);
    onPriceChange(min, max);
  };

  return (
    <div>
      <label id="price-range-label" className="block mb-2 text-sm text-white">
        Price Range
      </label>
      <Slider
        // Only use props that are known to work with @heroui/react
        defaultValue={value}
        value={value}
        onChange={handleChange}
        maxValue={50000}
        minValue={0}
        className="mb-2"
        aria-labelledby="price-range-label"
      />
      <div className="flex justify-between text-sm text-white">
        <div>฿{value[0]}</div>
        <div>฿{value[1]}</div>
      </div>
    </div>
  );
}
