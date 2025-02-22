import React from "react";
import { Menu } from "lucide-react";

const GridWebsite = () => {
  return (
    <div className="bg-black text-white min-h-screen relative">
      {/* Grid Lines */}
      <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
        {Array(12)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="border-l border-gray-800 h-full" />
          ))}
      </div>

      {/* Header */}
      <header className="relative border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition">
              <Menu className="h-6 w-6" />
            </button>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="hover:text-gray-300 transition">
                About
              </a>
              <a href="#" className="hover:text-gray-300 transition">
                Work
              </a>
              <a href="#" className="hover:text-gray-300 transition">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="aspect-square border border-gray-800 rounded-full relative">
                <div className="absolute inset-4 border-2 border-gray-600 rounded-full animate-spin-slow" />
                <div className="absolute inset-8 border border-gray-700 rounded-full" />
                <div className="absolute inset-12 border border-gray-800 rounded-full" />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Imagining endlessly
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                Doing, we are creators, disruptors, and ideators. As Imagineers,
                we unearth the very best in the cells and chromosomes that make
                up our DNA. Scientific, technological and human innovation,
                exceeding and exploring new possibilities.
              </p>
              <div className="flex space-x-4">
                <button className="px-6 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition">
                  Get Started
                </button>
                <button className="px-6 py-3 border border-white rounded-full hover:bg-white hover:text-black transition">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">© 2025 Imagineers</span>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Corner Numbers */}
      <div className="fixed top-4 left-4 text-sm text-gray-600">01</div>
      <div className="fixed top-4 right-4 text-sm text-gray-600">02</div>
      <div className="fixed bottom-4 left-4 text-sm text-gray-600">03</div>
      <div className="fixed bottom-4 right-4 text-sm text-gray-600">04</div>
    </div>
  );
};

export default GridWebsite;
