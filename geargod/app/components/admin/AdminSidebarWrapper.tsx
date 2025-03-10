"use client";

import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AdminSidebar from "./Sidebar";

interface AdminSidebarWrapperProps {
  setIsSearchVisible: (visible: boolean) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export default function AdminSidebarWrapper(props: AdminSidebarWrapperProps) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Get session on client side
  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
      setLoading(false);
    };
    
    fetchSession();
  }, []);
  
  // Show nothing while loading or if not authenticated
  if (loading) {
    return null;
  }
  
  if (!session || session.user.roles !== "staff") {
    return null;
  }
  
  // Pass ALL required props to AdminSidebar
  return (
    <AdminSidebar
      setIsSearchVisible={props.setIsSearchVisible}
      isExpanded={props.isExpanded}
      setIsExpanded={props.setIsExpanded}
      session={session}
    />
  );
}