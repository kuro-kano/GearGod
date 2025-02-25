"use client";
import { Button } from "@heroui/react";
import ProductCardGrid from "@/components/ProductCardGrid";

import "./styles/globals.css";

export default function Home() {
  return (
    <>
      

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
          <div className="relative h-full w-full over pb-16">
            {/* Optional Background Image */}
            {/* <img
              src="/images/mainpage.jpg"
              className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
            /> */}
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-45"></div>

            {/* Centered Content Container */}
            <div className="relative z-10 flex flex-col justify-center items-center h-full pb-24">
              <div className="flex flex-col items-center">
                <p className="font-inter-bold text-[56px] mt-2 flex justify-center items-center text-center">
                  "Worship the power,
                  <span className="ml-2 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                    not the price.
                  </span>
                  "
                </p>

                <p className="mt-10 text-[19px] font-figtree-regular text-center md:text-left">
                  Top-tier gaming gear and custom PC cases designed for ultimate
                  performance and style.
                </p>
                <div className="mt-9 flex gap-4 pb-10">
                  <Button
                    className="px-6 w-40 h-10 bg-gradient-to-r from-blue-700 to-purple-500 overflow-hidden"
                    radius="full"
                  >
                    Shop Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Image positioned below the buttons */}
            <img
              src="/images/black-pc-case.png"
              className="absolute left-1/2 bottom-10 transform -translate-x-1/2 w-80 h-auto"
            />
          </div>
          <ProductCardGrid />
        </div>
      </main>
    </>
  );
}
