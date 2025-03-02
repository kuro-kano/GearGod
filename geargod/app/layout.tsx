"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SearchOverlay from "@/components/SearchOverlay";
import "@/styles/globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    // Force a browser reflow by accessing offsetHeight
    document.body.offsetHeight;

    // Add viewport meta tag
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1, maximum-scale=1";
      document.head.appendChild(meta);
    }

    // Apply essential styles directly
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchVisible(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isMounted) return null;

  return (
    <html lang="en">
      <body className="min-h-screen">
        <Navbar setIsSearchVisible={setIsSearchVisible} />
        <main className="w-full">{children}</main>
        <SearchOverlay
          isVisible={isSearchVisible}
          onClose={() => setIsSearchVisible(false)}
        />
      </body>
    </html>
  );
}
