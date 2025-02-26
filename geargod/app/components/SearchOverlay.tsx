"use client";
import { useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface SearchOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  // Optional: Allow passing custom classes for further customization.
  containerClassName?: string;
  inputClassName?: string;
}

const SearchOverlay = ({
  isVisible,
  onClose,
  containerClassName = "",
  inputClassName = "",
}: SearchOverlayProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on the input when overlay becomes visible.
  useEffect(() => {
    if (isVisible) {
      inputRef.current?.focus();
    }
  }, [isVisible]);

  // Close overlay on Escape key press.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-start pt-48 ${containerClassName} backdrop-filter backdrop-blur-sm bg-opacity-25`}
      onClick={onClose}
    >
      <div
        className="bg-slate-950 border-2 border-stone-500 p-6 transition ease-in duration-300 rounded-lg shadow-lg w-11/12 max-w-md backdrop-filter backdrop-blur-sm bg-opacity-75"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-600" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by brand or category..."
            className={`w-full pl-12 border-2 border-gray-300 transition ease-in duration-300 rounded px-4 py-2 ${inputClassName}`}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
