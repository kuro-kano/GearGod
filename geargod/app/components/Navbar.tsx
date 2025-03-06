"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  CircleUserRound,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";

// interface NavbarProps {
//   setIsSearchVisible: (visible: boolean) => void;
// }
// const Navbar = ({ setIsSearchVisible }: NavbarProps) => {

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  // Monitor session changes
  useEffect(() => {
    if (session?.user) {
      console.log("Session data:", session);
      setIsLoggedIn(true);
      setUsername(session.user.username || session.user.email || "");
    } else {
      setIsLoggedIn(false);
      setUsername("");
    }
  }, [session]);

  // // Monitor username changes
  // useEffect(() => {
  //   if (username) {
  //     console.log('Username updated:', username);
  //     console.log('Login status:', isLoggedIn);
  //   }
  // }, [username, isLoggedIn]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    signOut();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 
          w-[95%] md:w-[90%] lg:w-[80%] h-16 bg-black py-3 px-4 md:px-8 flex items-center justify-between rounded-full shadow-lg mx-auto mt-6 
          backdrop-filter backdrop-blur-lg bg-opacity-25`}
      >
        {/* Left Section: Logo */}
        <div className="text-xl md:text-2xl font-bold text-white">
          <Link href="/">GearGod</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white">
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
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

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-24 left-1/2 -translate-x-1/2 z-40 w-[90%] bg-black bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg py-4 px-6">
          <div className="flex flex-col space-y-4 text-white">
            <Link
              href="/"
              className="py-2 hover:text-gray-300 transition-colors"
              onClick={toggleMobileMenu}
            >
              หน้าแรก
            </Link>
            <div className="py-2 hover:text-gray-300 transition-colors">
              เกี่ยวกับเรา
            </div>
            <Link
              href="/shop"
              className="py-2 hover:text-gray-300 transition-colors"
              onClick={toggleMobileMenu}
            >
              ร้านค้า
            </Link>
            <div className="border-t border-gray-700 my-2"></div>
            {isLoggedIn ? (
              <>
                <div className="py-2 flex items-center">
                  <Avatar
                    name={username.charAt(0).toUpperCase()}
                    className="w-8 h-8 bg-purple-600 text-white mr-3"
                  />
                  <span>{username}</span>
                </div>
                <Link
                  href="/profile"
                  className="py-2 hover:text-gray-300 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  My Profile
                </Link>
                <Link
                  href="/orders"
                  className="py-2 hover:text-gray-300 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  My Orders
                </Link>
                <div
                  className="py-2 text-red-500 hover:text-red-400 transition-colors cursor-pointer flex items-center"
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="py-2 hover:text-gray-300 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="py-2 hover:text-gray-300 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  Register
                </Link>
              </>
            )}
            <Link
              href="/cart"
              className="py-2 hover:text-gray-300 transition-colors flex items-center"
              onClick={toggleMobileMenu}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              <span>Cart</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
