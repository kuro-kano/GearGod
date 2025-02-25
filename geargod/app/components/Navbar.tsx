"use client";
import { Search, User, ShoppingCart } from "lucide-react";

const Navbar = () => {
  return (
    <nav
      className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 
        w-[80%] h-16 bg-black py-3 px-8 flex items-center justify-between rounded-full shadow-lg mx-auto mt-6 backdrop-filter backdrop-blur-lg bg-opacity-25 
        
  `}
    >
      {/* Left Section: Logo */}
      <div className="text-2xl font-bold text-white">GearGod</div>

      {/* Center Section: Menu Items */}
      <div className="flex space-x-10 text-white font-medium">
        <div className="group relative cursor-pointer hover:text-gray-300 transition-colors">Deals</div>
        <div className="group relative cursor-pointer hover:text-gray-300 transition-colors">Guides</div>
        <div className="group relative cursor-pointer hover:text-gray-300 transition-colors">Components</div>
        <div className="group relative cursor-pointer hover:text-gray-300 transition-colors">Gaming Gear</div>
        <div className="group relative cursor-pointer hover:text-gray-300 transition-colors">Monitors</div>
      </div>

      {/* Right Section: Search Bar & Icons */}
      <div className="flex items-center space-x-5">
        <Search className="w-5 h-5 text-white cursor-pointer hover:text-gray-300 transition-colors" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-white rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 w-48 md:w-64"
        />
        <User className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-colors" />
        <ShoppingCart className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-colors" />
      </div>
    </nav>
  );
};

export default Navbar;