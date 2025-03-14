"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Search, User, Menu, X, Home, Package, Users, 
  LogOut, ChevronRight, ChevronLeft,
  Warehouse,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarProps {
  setIsSearchVisible: (visible: boolean) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  session: any; // Add session prop
}

const AdminSidebar = ({
  setIsSearchVisible,
  isExpanded,
  setIsExpanded,
  session,
}: SidebarProps) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClientSide, setIsClientSide] = useState(false);
  const user = session?.user?.username;
  
  // Set client-side flag to control initial rendering
  useEffect(() => {
    setIsClientSide(true);
  }, []);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };

    if (typeof window !== 'undefined') {
      // Set initial state
      handleResize();
      window.addEventListener("resize", handleResize);
      
      // Don't forget to clean up
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [setIsExpanded]);

  const handleUserClick = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation items for admin
  const navItems = [
    { name: "หน้าหลักเว็บไซต์", icon: <Home className="w-5 h-5" />, href: "/" },
    { name: "แดชบอร์ด", icon: <Warehouse className="w-5 h-5" />, href: "/admin" },
    {
      name: "รายการสั่งซื้อ",
      icon: <Package className="w-5 h-5" />,
      href: "/admin/orders",
    },
    {
      name: "สินค้าทั้งหมด",
      icon: <Users className="w-5 h-5" />,
      href: "/admin/products",
    },
  ];

  // During server rendering or before client hydration, return a minimal version
  if (!isClientSide) {
    return <div className="hidden"></div>; // This will be replaced after hydration
  }

  return (
    <>
      {/* Mobile hamburger menu */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2 bg-black bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-lg text-white"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Logo for mobile - always visible */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 lg:hidden">
        <div className="text-2xl font-bold text-white bg-black bg-opacity-25 backdrop-filter backdrop-blur-lg px-4 py-2 rounded-lg">
          <Link href="/admin">GearGod</Link>
        </div>
      </div>

      {/* Sidebar - desktop version */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out 
          bg-black text-white shadow-xl hidden lg:flex flex-col 
          ${isExpanded ? "w-64" : "w-20"}`}
      >
        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-10 bg-black text-white rounded-full p-1 shadow-lg border border-gray-800"
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Logo section */}
        <div
          className={`p-5 flex items-center ${isExpanded ? "justify-between" : "justify-center"
            }`}
        >
          {isExpanded ? (
            <Link href="/admin" className="text-2xl font-bold">
              GearGod
            </Link>
          ) : (
            <Link href="/admin" className="text-2xl font-bold">
              G
            </Link>
          )}
        </div>

        {/* Divider */}
        <div className="border-b border-gray-700 w-full opacity-30 my-2"></div>

        {/* Nav items */}
        <nav className="flex-grow px-3 py-2">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="font-kanit-regular flex items-center py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-200 hover:text-white"
                >
                  <div className="mr-3">{item.icon}</div>
                  {isExpanded && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User section at bottom */}
        <div
          className={`p-4 border-t border-gray-700 mt-auto ${isExpanded ? "" : "flex flex-col items-center"
            }`}
        >
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            {isExpanded && (
              <div className="ml-3">
                <p className="text-sm font-medium">{user}</p>
                <button
                  onClick={handleUserClick}
                  className="text-xs text-gray-400 flex items-center hover:text-gray-200"
                >
                  <LogOut className="w-3 h-3 mr-1" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out 
          bg-black text-white shadow-xl w-64 backdrop-filter backdrop-blur-lg bg-opacity-90
          transform lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Mobile close button */}
        <div className="p-5 flex items-center justify-between">
          <Link href="/admin" className="text-2xl font-bold">
            GearGod
          </Link>
          <button onClick={toggleMobileMenu} aria-label="Close mobile menu">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile search */}
        <div className="px-4 mb-4">
          <div className="relative flex items-center">
            <Search
              className="w-4 h-4 text-zinc-400 cursor-pointer transition-colors absolute left-3"
              onClick={() => setIsSearchVisible(true)}
            />
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-800 rounded-lg pl-10 py-2 text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 w-full"
              onClick={() => setIsSearchVisible(true)}
              readOnly
            />
          </div>
        </div>

        {/* Mobile nav items */}
        <nav className="px-3 py-2">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="font-kanit-regular flex items-center py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-200 hover:text-white"
                >
                  <div className="mr-3">{item.icon}</div>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile user section */}
        <div className="p-4 border-t border-gray-700 mt-auto">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user}</p>
              <button
                onClick={handleUserClick}
                className="text-xs text-gray-400 flex items-center hover:text-gray-200"
              >
                <LogOut className="w-3 h-3 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content padding to account for sidebar */}
      <div
        className={`lg:pl-${isExpanded ? "64" : "20"} transition-all duration-300`}
      ></div>
    </>
  );
};

export default AdminSidebar;