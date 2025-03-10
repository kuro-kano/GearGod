import { getSession } from "next-auth/react";
import AdminSidebar from "./Sidebar";

interface AdminSidebarWrapperProps {
  [key: string]: any;
}

export default async function AdminSidebarWrapper(props: AdminSidebarWrapperProps) {
  // This component runs on the server
  const session = await getSession();
  
  // Server-side check
  if (!session || session.user.roles !== "staff") {
    // Could redirect here with a redirect() function
    return null;
  }
  
  // Pass the session data as props to the client component
  return <AdminSidebar {...props} session={session} />;
}