"use client";

import "@/styles/globals.css";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/admin/Navbar";
import React, { useState, useEffect } from "react";
import OrderReportBlock from "@/components/admin/report/SummaryReportBlock";
import RecentOrderReport from "@/components/admin/report/OrderReport";
import CouponReport from "@/components/admin/report/CouponReport";

export default function Home() {
  const router = useRouter();
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    salesIncrease: "0%",
    ordersIncrease: "0%",
    pendingIncrease: "0%",
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [couponData, setCouponData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data once when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response = await fetch("/api/dashboard");
        const data = await response.json();

        // Example of how you might fetch data - replace with your actual API calls
        // const salesResponse = await fetch('/api/sales/summary');
        // const salesData = await salesResponse.json();

        // const ordersResponse = await fetch('/api/orders/recent');
        // const ordersData = await ordersResponse.json();

        // const couponResponse = await fetch('/api/coupons/usage');
        // const couponData = await couponResponse.json();

        // For demo purposes, using the example data after a timeout to simulate fetch
        setTimeout(() => {
          setSalesData(data.salesSummary);
          setRecentOrders(data.recentOrders);

          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <main className="text-white ambient-bg">
      {/* Responsive padding that adjusts on different screen sizes */}
      <div className="p-4 sm:p-6 md:p-10 lg:p-16 min-h-screen flex flex-col items-center">
        <div className="backdrop-filter backdrop-blur-lg bg-black bg-opacity-50 w-full max-w-7xl rounded-lg overflow-hidden">
          <div className="w-full p-3 sm:p-4 md:p-6 lg:p-8">
            {/* Summary section - already responsive with your grid */}
            <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-kanit-regular">
              สรุปยอดการขาย
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-8">
              <OrderReportBlock
                title="ยอดขายทั้งหมด"
                value={salesData.totalSales}
                valueSuffix="THB."
                subtitle={`${salesData.salesIncrease} increase`}
                gradient="cyan-blue"
              />
              <OrderReportBlock
                title="จำนวนออเดอร์ทั้งหมด"
                value={salesData.totalOrders}
                valueSuffix=""
                subtitle={`${salesData.ordersIncrease} increase`}
                gradient="green-teal"
              />
              <OrderReportBlock
                title="ออเดอร์ที่ต้องจัดส่ง"
                value={salesData.pendingOrders}
                valuePrefix="THB."
                subtitle={`${salesData.pendingIncrease} increase`}
                gradient="yellow-orange"
              />
            </div>

            {/* Products section - make this stack on mobile */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              <div className="w-full lg:w-3/4">
                <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-kanit-regular">
                  คำสั่งซื้อล่าสุด 5 รายการ
                </h2>
                {isLoading ? (
                  <p>Loading orders...</p>
                ) : (
                  <RecentOrderReport
                    orders={recentOrders}
                    showCustomer={true}
                    showDate={true}
                    showStatus={true}
                    showAmount={false}
                  />
                )}
              </div>
              <div className="w-full lg:w-1/4 mt-6 lg:mt-0">
                <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-kanit-regular">
                  อัตราการใช้คูปอง
                </h2>
                <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto pb-2">
                  {isLoading ? (
                    <p>Loading coupon data...</p>
                  ) : (
                    <>
                      <CouponReport />
                      <CouponReport />
                      <CouponReport />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
