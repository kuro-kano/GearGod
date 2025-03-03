"use client";
import { Slider } from "@heroui/react";
import { useState } from "react";

interface PriceSliderProps {
  onPriceChange?: (min: number, max: number) => void;
}

export default function PriceSlider({ onPriceChange }: PriceSliderProps) {
  const [range, setRange] = useState<[number, number]>([0, 5000]);

  // Handle range changes directly without useEffect
  const handleRangeChange = (value: number | number[]) => {
    if (Array.isArray(value) && value.length === 2) {
      setRange([value[0], value[1]]);
      // Call onPriceChange only when the range actually changes
      if (onPriceChange) {
        onPriceChange(value[0], value[1]);
      }
    }
  };

  return (
    <div>
      <Slider
        step={100}
        minValue={0}
        maxValue={5000}
        defaultValue={[0, 5000]}
        formatOptions={{ style: "currency", currency: "THB" }}
        className="max-w-md"
        onChange={(value: number | number[]) => {
          if (Array.isArray(value) && value.length === 2) {
            setRange([value[0], value[1]]);
          }
        }}
      />
      <div className="flex justify-between mt-2">
        <span className="text-white">฿{range[0]}</span>
        <span className="text-white">฿{range[1]}</span>
      </div>
    </div>
  );
}
