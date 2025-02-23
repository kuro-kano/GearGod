"use client";
import { Button } from "@heroui/react";
import "./styles/globals.css";
import Grid from "./utils/Grid";

export default function Home() {
  return (
    <main>
      {/* Parallax Section */}
      <div
        className="
          relative 
          h-screen 
          bg-fixed 
          bg-center 
          bg-cover 
          bg-no-repeat
          text-white
        "
      >
        {/* Black overlay */}
        <div className="absolute inset-0 bg-[#1a1a1a]"></div>

        {/* Centered content */}
        <div className="pl-32 relative z-10 flex flex-col md:flex-row justify-between items-center h-full">
          <div className="flex flex-col items-start">
            <p className="text-[60px] font-inter-bold">GearGod</p>
            <p className="font-figtree-regular text-[26px] mt-2">
              "Worship the power, not the price."
            </p>
            <p className="mt-10 text-[19px] font-figtree-regular text-center md:text-left">
              Top-tier gaming gear and custom PC cases designed for ultimate
              performance and style.
            </p>
            <div className="mt-5 flex gap-4">
              <Button
                className="px-6 w-40 h-10 bg-gradient-to-r from-blue-700 to-purple-500 overflow-hidden"
                radius="full"
              >
                Create Yours
              </Button>
              <Button
                className="px-6 h-10 bg-black overflow-hidden border"
                radius="full"
              >
                Buy Pre-Built Case
              </Button>
            </div>
          </div>
          <div className="relative z-10 flex justify-center md:justify-end items-center mt-10 md:mt-0">
            <img
              src="/images/black-pc-case.png"
              className="pr-20 w-80 h-80"
            />
          </div>
        </div>
      </div>

      {/* Normal Content Section */}
      <div className="p-8 bg-gray-100 text-gray-800">
        <h2 className="text-2xl font-semibold mb-4">Content Section</h2>
        <p className="mb-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod,
          nibh id venenatis laoreet, urna neque aliquet enim, in varius magna
          turpis in sapien.
        </p>
        <p>
          Scroll up and down to see the parallax effect in action. The
          background image remains fixed in place while the content scrolls.
        </p>
      </div>
    </main>
  );
}
