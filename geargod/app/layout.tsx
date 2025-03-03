// "use client";
// import { useEffect, useState } from "react";
// import Navbar from "@/components/Navbar";
// import SearchOverlay from "@/components/SearchOverlay";
// import "@/styles/globals.css";
// import { AuthProvider } from "./providers";

// export default function Layout({ children }: { children: React.ReactNode }) {
//   const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
//   const [isMounted, setIsMounted] = useState<boolean>(false);

//   useEffect(() => {
//     setIsMounted(true); // ensures the client-side rendering is complete
//   }, []);

//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.ctrlKey && event.key.toLowerCase() === "k") {
//         event.preventDefault(); // Prevents browser's default search action
//         setIsSearchVisible(true);
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   if (!isMounted) return null; // Skip rendering the component until the client-side is mounted

//   return (
//     <html lang="en">
//       <body className="bg-gray-800">
//         <Navbar setIsSearchVisible={setIsSearchVisible} />
//         <main>
//           <AuthProvider>{children}</AuthProvider>
//         </main>

//         {/* Ensure search overlay is outside of the navbar and on top */}
//         <SearchOverlay isVisible={isSearchVisible} onClose={() => setIsSearchVisible(false)} />
//       </body>
//     </html>
//   );
// }

// app/layout.tsx
import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "GearGod",
  description: "Your ultimate gear destination",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="bg-gray-800">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}