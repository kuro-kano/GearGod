interface ProductColor {
  color_name: string;
  color_code: string;
}

interface ColorSelectorProps {
  colors: ProductColor[];
  selectedColor: ProductColor | null;
  onColorSelect: (color: ProductColor) => void;
}

export default function ColorSelector({ colors, selectedColor, onColorSelect }: ColorSelectorProps) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Select Color</h2>
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => onColorSelect(color)}
            className={`
              w-12 h-12 rounded-full border-2 transition-all duration-200
              ${selectedColor?.color_name === color.color_name 
                ? 'border-purple-500 scale-110' 
                : 'border-gray-600 hover:border-purple-400'
              }
            `}
            style={{
              backgroundColor: color.color_code,
              boxShadow: selectedColor?.color_name === color.color_name 
                ? '0 0 10px rgba(168, 85, 247, 0.5)' 
                : 'none'
            }}
            title={color.color_name}
          >
            <span className="sr-only">{color.color_name}</span>
          </button>
        ))}
      </div>
      {selectedColor && (
        <p className="mt-2 text-sm text-gray-300">
          Selected: {selectedColor.color_name}
        </p>
      )}
    </div>
  );
}
