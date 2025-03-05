"use client";
import { useState } from "react";
import Link from "next/link";
import { User, ShoppingCart, CircleUserRound } from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

interface NavbarProps {
  setIsSearchVisible: (visible: boolean) => void;
}

const Navbar = ({ setIsSearchVisible }: NavbarProps) => {
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
          {/* User Icon */}
          <div className="relative">
            <Dropdown>
              <DropdownTrigger>
                <CircleUserRound className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-colors" />
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem href="/login" key="login">Log In</DropdownItem>
                <DropdownItem href="/signup" key="register">Register</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            {/* Conditionally render the dropdown */}
            <div className="absolute right-0 mt-2"></div>
          </div>         
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
