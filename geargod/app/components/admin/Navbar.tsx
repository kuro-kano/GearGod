"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, User, ShoppingCart } from "lucide-react";
import { Kbd } from "@heroui/kbd";

interface NavbarProps {
  setIsSearchVisible: (visible: boolean) => void;
}

const AdminNavbar = ({ setIsSearchVisible }: NavbarProps) => {
  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);

  const handleUserClick = () => {
    setIsUserMenuVisible(!isUserMenuVisible); // Toggle visibility on click
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
        </div>

        {/* Search Bar & Icons */}
        <div className="flex items-center space-x-5">
          <div className="relative flex items-center">
            <Search
              className="w-5 h-5 text-zinc-600 cursor-pointer transition-colors absolute left-3"
              onClick={() => setIsSearchVisible(true)}
            />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent rounded-2xl pl-10 pt-2.5 pb-2.5 border-2 border-zinc-600 focus:outline-none focus:ring-2 focus:ring-gray-400 w-16 md:w-40 cursor-pointer"
              onClick={() => setIsSearchVisible(true)}
              readOnly
            />
            <div className="absolute right-3 items-center text-gray-300 w-10 pb-1 text-center">
              <Kbd className="bg-neutral-600 text-neutral-300" keys={["ctrl"]}>
                K
              </Kbd>
            </div>
          </div>

          {/* User Icon */}
            <div className="relative">
            <Link href="/login">
              <User
              className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-colors"
              />
            </Link>
            {/* Conditionally render the dropdown */}
            <div className="absolute right-0 mt-2"></div>
          </div>

          {/* Shopping Cart Icon */}
          <ShoppingCart className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-colors" />
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
