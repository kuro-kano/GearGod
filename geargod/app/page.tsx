"use client";
import { Button } from "@heroui/react";
import ProductCardGrid from "@/components/ProductCardGrid";
import "./styles/globals.css";

export default function Home() {
  return (
    <main className="text-white ambient-bg">
      {/* Parent container occupies full viewport and centers its content */}
      <div className="pt-32 h-screen flex flex-col justify-center items-center">
        {/* HERO SECTION */}
        <div className="w-full max-w-6xl flex items-center justify-between px-8">
          <div className="max-w-2xl">
            <p className="font-inter-bold text-5xl leading-normal text-left">
              "Worship the power,&nbsp;
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent pr-0.5">
                not the price.
              </span>
              "
            </p>
            <p className="mt-6 text-lg font-figtree-regular text-left">
              Top-tier gaming gear and custom PC cases designed for ultimate
              performance and style.
            </p>
            <div className="mt-9 flex gap-4 pb-10">
              <Button
                className="px-6 w-40 h-10 bg-blue-600 text-white flex items-center gap-2"
                radius="full"
              >
                Shop Now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
              </Button>
            </div>
          </div>
          <div className="flex justify-end">
            <img
              src="images/pc-case/white-pc-case.png"
              className="w-80 h-auto"
              alt="PC case"
            />
          </div>
        </div>

        {/* GRID SECTION directly below the hero */}
        <div className="flex justify-center items-center mt-8 w-full">
          <div className="p-11 pr-10 h-auto w-4/6 bg-purple-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100 border-opacity-10">
            <h1 className="flex justify-center text-center text-xl font-figtree-bold pb-7">Official Partnership</h1>
            <div className="flex justify-evenly items-center">
              <img src="images/partnerships/hyperx.png" className="h-8 w-auto"></img>
              <img src="images/partnerships/Logitech-Logo.png" className="h-8 w-auto"></img>
              <img src="images/partnerships/Beyerdynamic_logo.png" className="h-8 w-auto"></img>
              <img src="images/partnerships/Logo_Razer_2017.png" className="h-8 w-auto"></img>
              <img src="images/partnerships/Cooler-Master-Logo.png" className="h-8 w-auto"></img>
              <img src="images/partnerships/Steelseries-logo.png" className="h-8 w-auto"></img>
            </div>
          </div>
        </div>
      </div>

      {/* GRID SECTION (Animated Entrance) */}
      <div className="min-h-screen flex items-center justify-center w-full pt-32 pb-32">
        <ProductCardGrid />
        <div className="pl-10 max-w-2xl">
          <p className="font-inter-bold text-5xl leading-normal text-left">
            "Gear Up for&nbsp;
            <span className="bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent pr-0.5">
              Victory.
            </span>
            "
          </p>
          <p className="mt-6 text-lg font-figtree-regular text-left">
            From pro-level peripherals to high-performance PC cases—everything
            you need to dominate the battlefield.
          </p>
          <div className="mt-9 flex gap-4 pb-10">
            <Button
              className="px-6 w-40 h-10 text-white flex items-center gap-2 border-white border-2"
              radius="full"
            >
              Explore Gear
            </Button>
          </div>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-evenly w-full pl-64 pr-64">
        {/* Text Section */}
        <div className="max-w-3xl">
          <p className="font-inter-bold text-5xl leading-normal text-left">
            "Your PC,&nbsp;
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent pr-0.5">
              Your Style.
            </span>
            "
          </p>
          <p className="mt-4 text-lg font-figtree-regular text-left">
            Boring cases are history. Customize your dream PC case and stand out
            from the crowd.
          </p>
          <div className="mt-9 flex gap-4 pb-10">
            <Button
              className="px-6 w-40 h-10 bg-blue-600 text-white flex items-center gap-2"
              radius="full"
            >
              Shop Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-1/2 flex pl-10">
          <img
            src="images/pc-case/anime-pc-case.png"
            className="h-auto rounded-lg"
            alt="PC case"
          />
        </div>
      </div>
    </main>
  );
}
