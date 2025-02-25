"use client";
import { useEffect, useState } from "react";

const useSearchShortcut = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+K or ⌘+K
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); // Prevent browser's default search
        setIsSearchVisible(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { isSearchVisible, setIsSearchVisible };
};

export default useSearchShortcut;
