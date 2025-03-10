"use client";

import BreadCrumbs from "@/components/BreadCrumbs";
import ProgressCheckout from "@/components/ProgressCheckout";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function FinishPage() {
  const router = useRouter();

  const steps: { name: string; href: string; status: "complete" | "current" | "upcoming" }[] = [
    { name: "SHOPPING CART", href: "/cart", status: "complete" },
    { name: "CHECKOUT", href: "/checkout", status: "complete" },
    { name: "FINISH", href: "/finish", status: "current" },
  ];

  return (
    <main className="dark ambient-bg min-h-screen flex flex-col items-center">
      <div className="w-full pt-20 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-8 lg:px-48">
        <BreadCrumbs />
      </div>

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-48 py-4 md:py-8">
        <ProgressCheckout steps={steps} />
        
        <div className="flex justify-center w-full font-kanit-regular">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#1D1C21] rounded-lg shadow-xl p-8 text-center max-w-md w-full mx-auto my-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            </motion.div>
            
            <h1 className="text-white text-3xl font-bold mb-4">ขอบคุณสำหรับคำสั่งซื้อ</h1>
            <p className="text-gray-400 mb-8 text-lg">
              เราจะส่งอีเมลถึงคุณพร้อมรายละเอียดคำสั่งซื้อ
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="bordered"
                className="text-white w-full border border-gray-700 hover:bg-gray-800 transition-colors"
                onPress={() => router.push("/orders")}
              >
                ดูรายการสั่งซื้อ
              </Button>
              
              <Button
                variant="solid"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors"
                onPress={() => router.push("/shop")}
              >
                <ShoppingBag className="w-5 h-5" />
                ซื้อสินค้าเพิ่ม
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}