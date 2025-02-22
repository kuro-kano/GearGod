interface GridPatternProps {
  className?: string;
  width?: number;
  height?: number;
  lines?: number;
  opacity?: "light" | "medium" | "dark";
}

const Grid = ({
  className = "",
  width = 6,
  height = 6,
  lines = 5,
  opacity = "medium",
}: GridPatternProps) => {
  // Map opacity prop to a numeric value (for Tailwind opacity percentages)
  const opacityMap = {
    light: "20",
    medium: "30",
    dark: "40",
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Transparent grid lines */}
      <div className="absolute inset-0">
        {/* Vertical lines */}
        <div className={`absolute inset-0 grid grid-cols-${width}`}>
          {Array(lines)
            .fill(null)
            .map((_, i) => (
              <div
                key={`v-${i}`}
                className={`border-l border-gray-200/${opacityMap[opacity]} h-full`}
              />
            ))}
        </div>

        {/* Horizontal lines */}
        <div className={`absolute inset-0 grid grid-rows-${height}`}>
          {Array(lines)
            .fill(null)
            .map((_, i) => (
              <div
                key={`h-${i}`}
                className={`border-t border-gray-200/${opacityMap[opacity]} w-full`}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Grid;
