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
  initialMax = 5000,
}: PriceSliderProps) {
  const [value, setValue] = useState([initialMin, initialMax]);

  // Add a console.log to debug the initial values
  useEffect(() => {
    console.log('Initial values:', initialMin, initialMax);
    console.log('Current value:', value);
  }, []);

  // Update local state when props change
  useEffect(() => {
    setValue([initialMin, initialMax]);
  }, [initialMin, initialMax]);

  const handleChange = (newValue: number | number[]) => {
    // Simplified handler
    let min: number, max: number;

    if (Array.isArray(newValue)) {
      [min, max] = newValue;
    } else {
      // For single value, use it as both min and max
      min = max = newValue;
    }

    setValue([min, max]);
    onPriceChange(min, max);
  };

  return (
    <div>
      <label id="price-range-label" className="block mb-2 text-sm text-white">
        Price Range:
      </label>
      <Slider
        defaultValue={value}
        value={value}
        onChange={handleChange}
        maxValue={5000}    // Make sure this matches initialMax
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
