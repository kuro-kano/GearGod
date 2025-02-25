"use client";
import { Search, User, ShoppingCart } from "lucide-react";
import { Kbd } from "@heroui/kbd";
import useSearchShortcut from "@/hooks/useSearchShortcut";
import SearchOverlay from "@/components/SearchOverlay";

const Navbar = () => {
  const { isSearchVisible, setIsSearchVisible } = useSearchShortcut();

  return (
    <>
      <nav
        className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 
          w-[80%] h-16 bg-black py-3 px-8 flex items-center justify-between rounded-full shadow-lg mx-auto mt-6 
          backdrop-filter backdrop-blur-lg bg-opacity-25`}
      >
        {/* Left Section: Logo */}
        <div className="text-2xl font-bold text-white">GearGod</div>

        {/* Center Section: Menu Items */}
        <div className="flex space-x-10 text-white font-medium">
          <div className="group relative cursor-pointer hover:text-gray-300 transition-colors">
            Deals
          </div>
          <div className="group relative cursor-pointer hover:text-gray-300 transition-colors">
            Guides
          </div>
          <div className="group relative cursor-pointer hover:text-gray-300 transition-colors">
            Components
          </div>
          <div className="group relative cursor-pointer hover:text-gray-300 transition-colors">
            Gaming Gear
          </div>
          <div className="group relative cursor-pointer hover:text-gray-300 transition-colors">
            Monitors
          </div>
        </div>

        {/* Right Section: Search Bar & Icons */}
        <div className="flex items-center space-x-5">
          <div className="relative flex items-center">
            {/* Clicking the icon or input triggers the overlay */}
            <Search
              className="w-5 h-5 text-zinc-600 cursor-pointer transition-colors absolute left-3"
              onClick={() => setIsSearchVisible(true)}
            />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent rounded-2xl pl-11 pt-3 pb-3 border-2 border-zinc-600 focus:outline-none focus:ring-2 focus:ring-gray-400 w-16 md:w-40 cursor-pointer"
              onClick={() => setIsSearchVisible(true)}
              readOnly
            />
            <div className="absolute right-3 items-center text-gray-300 rounded-xl p-1 w-10 text-center bg-zinc-600">
              <Kbd>^K</Kbd>
            </div>
          </div>
          <User className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-colors" />
          <ShoppingCart className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-colors" />
        </div>
      </nav>

      {/* Render the Search Overlay */}
      <SearchOverlay
        isVisible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
      />
    </>
  );
};

export default Navbar;
