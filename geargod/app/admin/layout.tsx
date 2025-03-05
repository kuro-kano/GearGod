"use client";

import { useState } from "react";
import AdminSidebar from "../components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar
        setIsSearchVisible={setIsSearchVisible}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      {/* Main content area that responds to sidebar state */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
