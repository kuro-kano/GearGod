"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, CircleUserRound, LogOut, User, Menu, X } from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Avatar,
} from "@heroui/react";

interface NavbarProps {
  setIsSearchVisible: (visible: boolean) => void;
}

const Navbar = ({ setIsSearchVisible }: NavbarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const storedUsername = localStorage.getItem("username") || "";
      setIsLoggedIn(loggedIn);
      setUsername(storedUsername);
    }
  }, []);

  // Handle login (for demo purposes)
  const handleLogin = () => {
    setIsLoggedIn(true);
    setUsername("DemoUser");
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", "DemoUser");
    setIsMobileMenuOpen(false); // Close mobile menu after login
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    setIsMobileMenuOpen(false); // Close mobile menu after logout
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when screen resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 
          w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] h-14 md:h-16 bg-black py-2 md:py-3 px-4 md:px-8 
          flex items-center justify-between rounded-full shadow-lg mx-auto mt-2 md:mt-6 
          backdrop-filter backdrop-blur-lg bg-opacity-25`}
      >
        {/* Left Section: Logo */}
        <div className="text-xl md:text-2xl font-bold text-white">
          <Link href="/">GearGod</Link>
        </div>

        {/* Right Section: Menu Items & Icons */}
        <div className="flex items-center">
          {/* Desktop Menu - hidden on mobile */}
          <div className="hidden md:flex space-x-6 lg:space-x-10 text-white font-medium font-kanit-regular mr-6 lg:mr-10">
            <div className="group relative cursor-pointer hover:text-gray-300 transition-colors">
              <Link href="/">หน้าแรก</Link>
            </div>
            <div className="group relative cursor-pointer hover:text-gray-300 transition-colors">
              <Link href="/about">เกี่ยวกับเรา</Link>
            </div>
            <div className="group relative cursor-pointer hover:text-gray-300 transition-colors">
              <Link href="/shop">ร้านค้า</Link>
            </div>
          </div>

          {/* Icons - showing on all screens */}
          <div className="flex items-center space-x-3 md:space-x-5">
            {/* User Icon with Dynamic Dropdown */}
            <div className="relative">
              <Dropdown>
                <DropdownTrigger>
                  {isLoggedIn ? (
                    <Avatar 
                      name={username.charAt(0).toUpperCase()} 
                      className="w-7 h-7 md:w-8 md:h-8 bg-purple-600 text-white cursor-pointer hover:bg-purple-700 transition-colors" 
                    />
                  ) : (
                    <CircleUserRound className="w-5 h-5 md:w-6 md:h-6 text-white cursor-pointer hover:text-gray-300 transition-colors" />
                  )}
                </DropdownTrigger>
                <DropdownMenu>
                  {isLoggedIn ? (
                    <>
                      <DropdownItem key="username">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>{username}</span>
                        </div>
                      </DropdownItem>
                      <DropdownItem href="/profile" key="profile">My Profile</DropdownItem>
                      <DropdownItem href="/orders" key="orders">My Orders</DropdownItem>
                      <DropdownItem 
                        key="logout" 
                        onPress={handleLogout}
                        className="text-red-500 hover:text-red-700"
                      >
                        <div className="flex items-center">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Logout</span>
                        </div>
                      </DropdownItem>
                    </>
                  ) : (
                    <>
                      <DropdownItem href="/login" key="login">Log In</DropdownItem>
                      <DropdownItem href="/signup" key="register">Register</DropdownItem>
                      {/* For demo purposes, add a direct login button */}
                      <DropdownItem onPress={handleLogin} key="demo-login">Demo Login</DropdownItem>
                    </>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
            
            {/* Shopping Cart Icon */}
            <Link href="/cart">
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-white cursor-pointer hover:text-gray-300 transition-colors" />
            </Link>

            {/* Mobile Menu Toggle Button - only shows on mobile */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden text-white ml-1"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - fullscreen overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-95 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="space-y-8 text-center text-xl font-kanit-regular">
              <div className="block">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="text-white hover:text-purple-400 transition-colors">หน้าแรก</span>
                </Link>
              </div>
              <div className="block">
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="text-white hover:text-purple-400 transition-colors">เกี่ยวกับเรา</span>
                </Link>
              </div>
              <div className="block">
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="text-white hover:text-purple-400 transition-colors">ร้านค้า</span>
                </Link>
              </div>
              
              {/* User actions in mobile menu */}
              <div className="pt-8 border-t border-gray-800 w-48 mx-auto">
                {isLoggedIn ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-center">
                      <Avatar 
                        name={username.charAt(0).toUpperCase()} 
                        className="w-10 h-10 bg-purple-600 text-white" 
                      />
                      <span className="ml-3 text-white">{username}</span>
                    </div>
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <span className="text-white hover:text-purple-400 transition-colors">My Profile</span>
                    </Link>
                    <div className="block">
                      <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="text-white hover:text-purple-400 transition-colors">My Orders</span>
                      </Link>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="block">
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="text-white hover:text-purple-400 transition-colors">Log In</span>
                      </Link>
                    </div>
                    <div className="block">
                      <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="text-white hover:text-purple-400 transition-colors">Register</span>
                      </Link>
                    </div>
                    <button 
                      onClick={handleLogin}
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Demo Login
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;