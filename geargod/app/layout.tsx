"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SearchOverlay from "@/components/SearchOverlay";
import "@/styles/globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Add global keyboard shortcut for Ctrl + K
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === "k") {
        event.preventDefault(); // Prevents browser's default search action
        setIsSearchVisible(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <html lang="en">
      <body className="bg-gray-800">
        <Navbar setIsSearchVisible={setIsSearchVisible} />
        <main>{children}</main>

        {/* Ensure search overlay is outside of the navbar and on top */}
        <SearchOverlay isVisible={isSearchVisible} onClose={() => setIsSearchVisible(false)} />
      </body>
    </html>
  );
}
