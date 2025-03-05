import React from "react";

// Define gradient mappings
const gradientClasses = {
  "cyan-blue": "bg-gradient-to-r from-cyan-500 to-blue-500",
  "blue-indigo": "bg-gradient-to-r from-blue-500 to-indigo-500",
  "purple-pink": "bg-gradient-to-r from-purple-500 to-pink-500",
  "green-teal": "bg-gradient-to-r from-green-500 to-teal-500",
  "yellow-orange": "bg-gradient-to-r from-yellow-400 to-amber-600",

  default: "bg-gradient-to-r from-gray-500 to-gray-700",
};

interface OrderReportBlockProps {
  title: string;
  value?: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  gradient?: keyof typeof gradientClasses; // Use this instead of fromColor/toColor
  isLoading?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  onClick?: () => void;
}

export default function OrderReportBlock({
  title,
  value,
  subtitle,
  icon,
  gradient = "default",
  isLoading = false,
  valuePrefix = "",
  valueSuffix = "",
  onClick,
}: OrderReportBlockProps) {
  // Get the gradient class from our mapping, fall back to default if not found
  const gradientClass = gradientClasses[gradient] || gradientClasses.default;

  return (
    <div
      className={`w-auto h-auto ${gradientClass} rounded-xl p-4 pr-32 text-white shadow-md transition-transform hover:scale-[1.02] ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-md font-kanit-regular pb-2">
            {title}
          </h3>
          {icon && <div className="text-white opacity-80">{icon}</div>}
        </div>

        <div>
          {isLoading ? (
            <div className="h-6 w-20 bg-white/20 animate-pulse rounded"></div>
          ) : (
            <div className="flex items-baseline">
              {valuePrefix && (
                <span className="text-sm mr-1">{valuePrefix}</span>
              )}
              <span className="text-2xl font-bold">{value}</span>
              {valueSuffix && (
                <span className="text-sm ml-1">{valueSuffix}</span>
              )}
            </div>
          )}

          {subtitle && <p className="text-xs text-white/80">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
