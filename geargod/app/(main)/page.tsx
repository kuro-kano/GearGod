//app/(main)/page.tsx
"use client";
import { Button } from "@heroui/react";
import ProductCardGrid from "@/components/ProductCardGrid";
import "@/styles/globals.css";
import Image from "next/image";
import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';

export default function Home() {
  const router = useRouter();

  // const { data: session } = useSession();
  // Remove the unused session variable completely

  const handleButtonPress = (path: string) => {
    router.push(path);
  };
  return (
    <main className="text-white ambient-bg">
      {/* Parent container occupies full viewport and centers its content */}
      <div className="pt-32 min-h-screen flex flex-col justify-center items-center">
        {/* HERO SECTION */}
        <div className="w-full max-w-6xl flex items-center justify-between px-8">
          <div className="max-w-2xl">
            <p className="font-inter-bold text-5xl leading-normal text-left">
              Worship the power,&nbsp;
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent pr-0.5">
                not the price.
              </span>
            </p>
            <p className="mt-6 text-xl font-figtree-regular text-left text-neutral-300">
              Top-tier gaming gear and custom PC cases designed for ultimate
              performance and style.
            </p>
            <div className="mt-9 flex gap-4 pb-10">
              <Button
                className="px-6 w-40 h-10 bg-blue-600 text-white flex items-center gap-2"
                radius="full"
                onPress={() => handleButtonPress('/shop')}
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
            <Image
              src="/images/pc-case/white-pc-case.png"
              alt="PC case"
              width={400}
              height={80}
            />
          </div>
        </div>

        {/* GRID SECTION directly below the hero */}
        <div className="z-0 flex justify-center items-center mt-8 w-full">
          <div className="p-11 pr-10 h-auto w-4/6 bg-purple-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100 border-opacity-10">
            <h1 className="flex justify-center text-center text-xl font-figtree-bold pb-7">
              Official Partnership
            </h1>
            <div className="flex justify-evenly items-center">
              <Image
                src="/images/partnerships/hyperx.png"
                alt="HyperX Logo"
                width={100}
                height={32}
                className="h-8 w-auto"
              />
              <Image
                src="/images/partnerships/Logitech-Logo.png"
                alt="Logitech Logo"
                width={100}
                height={32}
                className="h-8 w-auto"
              />
              <Image
                src="/images/partnerships/Beyerdynamic_logo.png"
                alt="Beyerdynamic Logo"
                width={100}
                height={32}
                className="h-8 w-auto"
              />
              <Image
                src="/images/partnerships/Logo_Razer_2017.png"
                alt="Razer Logo"
                width={100}
                height={32}
                className="h-8 w-auto"
              />
              <Image
                src="/images/partnerships/Cooler-Master-Logo.png"
                alt="Cooler Master Logo"
                width={100}
                height={32}
                className="h-8 w-auto"
              />
              <Image
                src="/images/partnerships/Steelseries-logo.png"
                alt="SteelSeries Logo"
                width={100}
                height={32}
                className="h-8 w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* GRID SECTION (Animated Entrance) */}
      <div className="min-h-screen flex items-center justify-center w-full pt-32 pb-32">
        <ProductCardGrid />
        <div className="pl-10 max-w-2xl">
          <p className="font-inter-bold text-5xl leading-normal text-left">
            Gear Up for&nbsp;
            <span className="bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent pr-0.5">
              Victory.
            </span>
          </p>
          <p className="mt-6 text-xl font-figtree-regular text-left text-neutral-300">
            From pro-level peripherals to high-performance PC cases—everything
            <br />
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

      <div className="min-h-screen flex items-center justify-evenly w-full pl-72 pr-72">
        {/* Text Section */}
        <div className="max-w-3xl">
          <p className="font-inter-bold text-5xl leading-normal text-left">
            Your PC,&nbsp;
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent pr-0.5">
              Your Style.
            </span>
          </p>
          <p className="mt-4 text-xl font-figtree-regular text-left text-neutral-300">
            Boring cases are history. Customize your dream PC case <br /> and
            stand out from the crowd.
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
          <Image
            src="/images/pc-case/anime-pc-case.png"
            width={500}
            height={300}
            className="h-auto rounded-lg"
            alt="PC case"
          />
        </div>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center w-full pl-72 pr-72">
        {/* Text Section */}
        <div className="max-w-3xl">
          <p className="font-inter-bold text-5xl leading-normal text-center">
            Built for Gamers,&nbsp;
            <span className="bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent pr-0.5">
              By Gamers
            </span>
          </p>
          <p className="mt-4 text-xl font-figtree-regular text-center text-neutral-300">
            Expertly crafted gear, premium materials, and designs that scream
            power. <br /> We know what gamers want.
          </p>
          <div className="mt-9 flex gap-4 pb-2 items-center justify-center">
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

        <div className="z-0 flex justify-center items-center mt-2 w-full">
          <div className="p-11 pr-10 h-auto w-4/6 ">
            <Image
              src="/images/Play_Your_Way_Multicolor_Collection.jpg"
              alt="Play Your Way Multicolor Collection"
              width={1200}
              height={675}
              className="rounded-2xl"
            />
          </div>
        </div>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center w-full pl-72 pr-72">
        {/* Text Section */}
        <div className="max-w-3xl">
          <p className="font-inter-bold text-5xl leading-normal text-center">
            Ready to&nbsp;
            <span className="bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent pr-0.5">
              Level Up?
            </span>
          </p>
          <p className="mt-4 text-xl font-figtree-regular text-center text-neutral-300">
            Get the best gaming gear and custom PC cases today.
          </p>
          <div className="mt-9 flex gap-4 pb-2 items-center justify-center">
            <Button
              className="px-6 w-40 h-10 bg-blue-600 text-white flex items-center gap-2"
              radius="full"
              href="/shop"
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
      </div>
    </main>
  );
}
