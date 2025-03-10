"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "./Sidebar";

interface AdminSidebarWrapperProps {
  setIsSearchVisible: (visible: boolean) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export default function AdminSidebarWrapper(props: AdminSidebarWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Check if we're on an admin page
    const isAdminRoute = pathname?.startsWith('/admin');
    
    if (isAdminRoute) {
      if (status === "unauthenticated") {
        window.location.href = '/';
        return;
      }

      if (session && session.user?.roles !== "staff") {
        window.location.href = '/';
        return;
      }
    }
  }, [session, status, pathname]);

  if (status === "loading" || !session) {
    return null;
  }

  return (
    <AdminSidebar
      {...props}
      session={session}
    />
  );
}
