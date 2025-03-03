// app/ClientLayout.tsx
"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SearchOverlay from "@/components/SearchOverlay";
import { useSession } from "next-auth/react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { status } = useSession();
  
  useEffect(() => {
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

  // Only show Navbar if authenticated or on pages that should show it for unauthenticated users
  const showNavbar = status === "authenticated" || status === "loading";

  return (
    <>
      {showNavbar && <Navbar setIsSearchVisible={setIsSearchVisible} />}
      <main>{children}</main>
      <SearchOverlay 
        isVisible={isSearchVisible} 
        onClose={() => setIsSearchVisible(false)} 
      />
    </>
  );
}