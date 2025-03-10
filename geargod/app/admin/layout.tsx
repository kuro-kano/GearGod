"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import AdminSidebar from "../components/admin/Sidebar";
import { redirect } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin?callbackUrl=/admin");
    },
  });

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Show loading state or nothing while session loads
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar
        setIsSearchVisible={setIsSearchVisible}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        session={session}
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