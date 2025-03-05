//app/(main)/page.tsx
"use client";

import "@/styles/globals.css";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/admin/Navbar";
import React from "react";
import OrderReportBlock from "@/components/admin/report/SummaryReportBlock";
import TopProductReport from "@/components/admin/report/RecentOrderReport";
import CouponReport from "@/components/admin/report/CouponReport";
import RecentOrderReport from "@/components/admin/report/RecentOrderReport";

export default function Home() {
  const router = useRouter();
  
  //Data example เฉยๆ ไม่ได้ใช้จริว
  const recentOrders = [
    {
      productName: "Mechanical Keyboard RGB",
      customerName: "John Doe",
      orderDate: "2023-05-01",
      orderStatus: "Completed",
      amount: 2500
    },
    {
      productName: "Gaming Mouse",
      customerName: "Jane Smith",
      orderDate: "2023-04-28",
      orderStatus: "Processing",
      amount: 1200
    },
    {
      productName: "27\" Gaming Monitor",
      customerName: "Alex Johnson",
      orderDate: "2023-04-25",
      orderStatus: "Shipped",
      amount: 9500
    },
    {
      productName: "Wireless Headset",
      customerName: "Emily Brown",
      orderDate: "2023-04-22",
      orderStatus: "Completed",
      amount: 3200
    },
    {
      productName: "Gaming Chair",
      customerName: "Michael Wilson",
      orderDate: "2023-04-20",
      orderStatus: "Processing",
      amount: 7500
    }
  ];

  const handleButtonPress = (path: string) => {
    router.push(path);
  };
  return (
    <main className="text-white ambient-bg">
      {/* Simplified container structure */}
      <div className="p-16 min-h-screen flex flex-col items-center">
        <div className="backdrop-filter backdrop-blur-lg bg-black bg-opacity-50 w-full max-w-7xl mx-4 rounded-lg overflow-hidden">
          <div className="w-full p-4 md:p-8">
            {/* Summary section */}
            <h2 className="mb-4 text-xl font-kanit-regular">สรุปยอดการขาย</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              <OrderReportBlock
                title="ยอดขายทั้งหมด"
                value={52489}
                valueSuffix="THB."
                subtitle="10.2% increase"
                gradient="cyan-blue"
              />
              <OrderReportBlock
                title="จำนวนออเดอร์ทั้งหมด"
                value={52489}
                valueSuffix=""
                subtitle="10.2% increase"
                gradient="green-teal"
              />
              <OrderReportBlock
                title="ออเดอร์ที่ต้องจัดส่ง"
                value={52489}
                valuePrefix="THB."
                subtitle="10.2% increase"
                gradient="yellow-orange"
              />
            </div>

            {/* Products section */}

            <div className="flex flex-row gap-6">
              <div className="w-3/4">
                <h2 className="mb-4 text-xl font-kanit-regular">
                  คำสั่งซื้อล่าสุด 5 รายการ
                </h2>
                <RecentOrderReport
                //Data example อยู่ข้างบน
                  orders={recentOrders}
                  showCustomer={true}
                  showDate={true}
                  showStatus={true}
                  showAmount={false}
                />
              </div>
              <div className="w-auto">
                <h2 className="mb-4 text-xl font-kanit-regular">
                  อัตราการใช้คูปอง
                </h2>
                <CouponReport />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
