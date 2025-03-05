"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, CircleUserRound, LogOut, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
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
  const { data: session } = useSession();

  // Monitor session changes
  useEffect(() => {
    if (session?.user) {
      console.log('Session data:', session);
      setIsLoggedIn(true);
      setUsername(session.user.name || session.user.email || "");
    } else {
      setIsLoggedIn(false);
      setUsername("");
    }
  }, [session]);

  // Monitor username changes
  useEffect(() => {
    if (username) {
      console.log('Username updated:', username);
      console.log('Login status:', isLoggedIn);
    }
  }, [username, isLoggedIn]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    signOut();
  };

  return (
    <nav
      className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 
        w-[80%] h-16 bg-black py-3 px-8 flex items-center justify-between rounded-full shadow-lg mx-auto mt-6 
        backdrop-filter backdrop-blur-lg bg-opacity-25`}
    >
      {/* Left Section: Logo */}
      <div className="text-2xl font-bold text-white">
        <Link href="/">GearGod</Link>
      </div>

      {/* Right Section: Menu Items, Search Bar & Icons */}
      <div className="flex items-center space-x-10">
        {/* Menu Items */}
        <div className="flex space-x-10 text-white font-medium font-kanit-regular">
          <div className="group relative cursor-pointer hover:text-gray-300 transition-colors">
            <Link href="/">หน้าแรก</Link>
          </div>
          <div className="group relative cursor-pointer hover:text-gray-300 transition-colors">
            เกี่ยวกับเรา
          </div>
          <div className="group relative cursor-pointer hover:text-gray-300 transition-colors">
            <Link href="/shop">ร้านค้า</Link>
          </div>
        </div>

        {/* Search Bar & Icons */}
        <div className="flex items-center space-x-5">
          {/* User Icon with Dynamic Dropdown */}
          <div className="relative">
            <Dropdown>
              <DropdownTrigger>
                {isLoggedIn ? (
                  <Avatar
                    name={username.charAt(0).toUpperCase()}
                    className="w-8 h-8 bg-purple-600 text-white cursor-pointer hover:bg-purple-700 transition-colors"
                  />
                ) : (
                  <CircleUserRound className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-colors" />
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
                    <DropdownItem href="/profile" key="profile">
                      My Profile
                    </DropdownItem>
                    <DropdownItem href="/orders" key="orders">
                      My Orders
                    </DropdownItem>
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
                    <DropdownItem href="/login" key="login">
                      Log In
                    </DropdownItem>
                    <DropdownItem href="/signup" key="register">
                      Register
                    </DropdownItem>
                  </>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Shopping Cart Icon */}
          <Link href="/cart">
            <ShoppingCart className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-colors" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
