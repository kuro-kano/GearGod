//app/(main)/page.tsx
"use client";
import { Button } from "@heroui/react";
import ProductCardGrid from "@/components/ProductCardGrid";
import "@/styles/globals.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleButtonPress = (path: string) => {
    router.push(path);
  };
  return (
    <main className="text-white ambient-bg">
      {/* Parent container occupies full viewport and centers its content */}
      <div className="pt-16 sm:pt-24 lg:pt-32 min-h-screen flex flex-col justify-center items-center">
        {/* HERO SECTION */}
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center md:justify-between px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-center md:text-left">
            <p className="font-inter-bold text-3xl sm:text-4xl lg:text-5xl leading-normal">
              Worship the power,&nbsp;
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent pr-0.5">
                not the price.
              </span>
            </p>
            <p className="mt-4 md:mt-6 text-lg sm:text-xl text-neutral-300 font-kanit-regular">
              อุปกรณ์เกมมิ่งระดับโปร
              ไปจนถึงเคสพีซีประสิทธิภาพสูง—ทุกอย่างที่คุณต้องการเพื่อครองสนามรบ
            </p>
            <div className="mt-6 md:mt-9 flex justify-center md:justify-start gap-4 pb-6 md:pb-10">
              <Button
                className="px-6 w-40 h-10 bg-blue-600 text-white flex items-center gap-2 font-kanit-regular"
                radius="full"
                onPress={() => handleButtonPress("/shop")}
              >
                ช็อปเลย
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 sm:w-5 h-4 sm:h-5"
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
          <div className="flex justify-center md:justify-end mt-6 md:mt-0">
            <Image
              src="/images/pc-case/white-pc-case.png"
              alt="PC case"
              width={400}
              height={80}
              className="w-64 sm:w-80 md:w-auto h-auto"
            />
          </div>
        </div>

        {/* GRID SECTION directly below the hero */}
        <div className="z-0 flex justify-center items-center mt-8 w-full px-4 sm:px-6">
          <div className="p-6 sm:p-8 lg:p-11 h-auto w-full sm:w-5/6 md:w-4/6 bg-purple-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100 border-opacity-10">
            <h1 className="flex justify-center text-center text-xl font-figtree-bold pb-4 sm:pb-7">
              Official Partnership
            </h1>
            <div className="flex flex-wrap justify-center sm:justify-evenly items-center gap-6 sm:gap-4">
              {[
                { src: "/images/partnerships/hyperx.png", alt: "HyperX Logo" },
                {
                  src: "/images/partnerships/Logitech-Logo.png",
                  alt: "Logitech Logo",
                },
                {
                  src: "/images/partnerships/Beyerdynamic_logo.png",
                  alt: "Beyerdynamic Logo",
                },
                {
                  src: "/images/partnerships/Logo_Razer_2017.png",
                  alt: "Razer Logo",
                },
                {
                  src: "/images/partnerships/Cooler-Master-Logo.png",
                  alt: "Cooler Master Logo",
                },
                {
                  src: "/images/partnerships/Steelseries-logo.png",
                  alt: "SteelSeries Logo",
                },
              ].map((logo) => (
                <Image
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  width={100}
                  height={32}
                  className="h-6 sm:h-8 w-auto"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GRID SECTION (Animated Entrance) */}
      <div className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-center w-full py-16 md:py-32 px-4 sm:px-6 md:px-8">
        <div className="w-full md:w-auto mt-8 md:mt-0">
          <ProductCardGrid />
        </div>
        <div className="md:pl-10 max-w-2xl text-center md:text-left">
          <p className="font-inter-bold text-3xl sm:text-4xl lg:text-5xl leading-normal">
            Gear Up for&nbsp;
            <span className="bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent pr-0.5">
              Victory.
            </span>
          </p>
          <p className="mt-4 md:mt-6 text-lg sm:text-xl font-kanit-regular text-neutral-300">
            เคสเดิมๆ มันน่าเบื่อ ออกแบบเคสพีซีในฝันของคุณ
            {/* Only show line break on larger screens */}
            <span className="hidden md:inline">
              <br />
            </span>
            และโดดเด่นไม่เหมือนใคร
          </p>
        </div>
      </div>

      <div className="min-h-screen flex flex-col md:flex-row items-center justify-center md:justify-evenly w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-72">
        {/* Text Section */}
        <div className="max-w-3xl text-center md:text-left">
          <p className="font-inter-bold text-3xl sm:text-4xl lg:text-5xl leading-normal">
            Your PC,&nbsp;
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent pr-0.5">
              Your Style.
            </span>
          </p>
          <p className="mt-4 text-lg sm:text-xl font-kanit-regular text-neutral-300">
          ออกแบบและปรับแต่งได้ตามใจ ให้ทุกดีเทลสะท้อนตัวตนของคุณ
            {/* Only show line break on larger screens */}
            <span className="hidden md:inline">
              <br />
            </span>
          </p>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center md:pl-10 mt-8 md:mt-0">
          <Image
            src="/images/pc-case/anime-pc-case.png"
            width={500}
            height={300}
            className="h-auto w-full max-w-md rounded-lg"
            alt="PC case"
          />
        </div>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-72 py-16 md:py-0">
        {/* Text Section */}
        <div className="max-w-3xl">
          <p className="font-inter-bold text-3xl sm:text-4xl lg:text-5xl leading-normal text-center">
            Built for Gamers,&nbsp;
            <span className="bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent pr-0.5">
              By Gamers
            </span>
          </p>
          <p className="mt-4 text-lg sm:text-xl font-kanit-regular text-center text-neutral-300">
            เกียร์เกมมิ่งที่สร้างขึ้นอย่างพิถีพิถัน วัสดุระดับพรีเมียม
            {/* Only show line break on larger screens */}
            <span className="hidden md:inline">
              <br />
            </span>
            และดีไซน์ที่เต็มไปด้วยพลัง เรารู้ดีว่าคอเกมต้องการอะไร!
          </p>
        </div>

        <div className="z-0 flex justify-center items-center mt-8 md:mt-2 w-full">
          <div className="p-4 sm:p-6 md:p-11 h-auto w-full md:w-4/6">
            <Image
              src="/images/Play_Your_Way_Multicolor_Collection.jpg"
              alt="Play Your Way Multicolor Collection"
              width={1200}
              height={675}
              className="rounded-lg md:rounded-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>

      <div className="min-h-[60vh] md:min-h-screen flex flex-col items-center justify-center w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-72">
        {/* Text Section */}
        <div className="max-w-3xl">
          <p className="font-inter-bold text-3xl sm:text-4xl lg:text-5xl leading-normal text-center">
            Ready to&nbsp;
            <span className="bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent pr-0.5">
              Level Up?
            </span>
          </p>
          <p className="mt-4 text-lg sm:text-xl font-kanit-regular text-center text-neutral-300">
            สัมผัสสุดยอดอุปกรณ์เกมมิ่งและเคสพีซีสุดล้ำได้แล้ววันนี้
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              className="px-6 w-40 h-10 bg-blue-600 text-white flex items-center gap-2 font-kanit-regular"
              radius="full"
              onPress={() => handleButtonPress("/shop")}
            >
              ช็อปเลย
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 sm:w-5 h-4 sm:h-5"
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
