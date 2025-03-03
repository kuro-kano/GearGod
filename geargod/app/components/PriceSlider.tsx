import { Slider } from "@heroui/react";
import { useState, useEffect } from "react";

interface PriceSliderProps {
  onPriceChange?: (min: number, max: number) => void;
}

export default function PriceSlider({ onPriceChange }: PriceSliderProps) {
  const [range, setRange] = useState<[number, number]>([0, 5000]);

  // Update parent component when range changes
  useEffect(() => {
    if (onPriceChange) {
      onPriceChange(range[0], range[1]);
    }
  }, [range, onPriceChange]);

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