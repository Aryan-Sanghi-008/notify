// components/ColorPicker.tsx
import { useState } from "react";
import { Check, Palette } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const defaultColors = [
  "#ffffff",
  "#fef3c7",
  "#fde68a",
  "#bfdbfe",
  "#a5f3fc",
  "#bae6fd",
  "#fbcfe8",
  "#fecaca",
  "#d1fae5",
];

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        {defaultColors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-full border-2 ${
              value === color
                ? "border-blue-500 shadow-sm"
                : "border-transparent hover:border-gray-200"
            } transition-all relative`}
            style={{ backgroundColor: color }}
            title={`Select ${color}`}
          >
            {value === color && (
              <Check
                size={16}
                className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow"
              />
            )}
          </button>
        ))}
      </div>

      <div className="relative">
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
          title="Custom color"
        >
          <Palette size={20} />
        </button>

        {showCustom && (
          <div className="absolute top-10 right-0 bg-white p-2 rounded-lg shadow-lg border border-gray-100">
            <input
              type="color"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setShowCustom(false);
              }}
              className="w-8 h-8 cursor-pointer block"
            />
          </div>
        )}
      </div>
    </div>
  );
}
