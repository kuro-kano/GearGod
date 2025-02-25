"use client";
import { useEffect, useRef } from "react";

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
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${containerClassName}`}
      onClick={onClose}
    >
      {/* Prevent click events from bubbling up */}
      <div
        className="bg-white p-6 transition ease-in duration-300 rounded-lg shadow-lg w-11/12 max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          className={`w-full border border-gray-300 transition ease-in duration-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 ${inputClassName}`}
        />
      </div>
    </div>
  );
};

export default SearchOverlay;
