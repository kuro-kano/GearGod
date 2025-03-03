"use client";
import { Spacer, Card } from "@heroui/react";
import { useState } from "react";
import { Link } from "@heroui/link";

export default function ShopProductCard({ onClick = () => {} }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/shop/product/`}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        className="transition-transform duration-300 cursor-pointer"
        style={{ transform: isHovered ? "translateY(-5px)" : "none" }}
      >
        <Card
          className="w-[250px] space-y-5 p-4"
          radius="lg"
          style={{
            boxShadow: isHovered
              ? "0 15px 30px rgba(156, 39, 176, 0.4), 0 10px 10px rgba(32, 17, 126, 0.25)"
              : "0 10px 20px rgba(156, 39, 176, 0.2), 0 6px 6px rgba(32, 17, 126, 0.15)",
            transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
          }}
        >
          <img
            src="images/products/mouse/loga-garuda-pro-wireless-gaming-mouse-matte-neon-pink-top.jpg"
            className="rounded-xl"
          />
          <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
          <div className="font-bold">Loga Garuda Pro Wireless Gaming Mouse</div>
          <div className="text-sm">2,990.00 ฿</div>
        </Card>
      </div>
    </Link>
  );
}
