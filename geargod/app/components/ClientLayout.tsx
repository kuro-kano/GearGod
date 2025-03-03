// app/components/ClientLayout.tsx
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SearchOverlay from "@/components/SearchOverlay";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

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

  return (
    <>
      <Navbar setIsSearchVisible={setIsSearchVisible} />
      <main>{children}</main>{" "}
      <SearchOverlay
        isVisible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
      />
    </>
  );
}
