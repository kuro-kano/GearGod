//app/(main)/page.tsx
"use client";

import "@/styles/globals.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/admin/Navbar";
import React from "react";
import OrderReportBlock from "@/components/admin/report/SummaryReportBlock";
import TopProductReport from "@/components/admin/report/RecentOrderReport";
import CouponReport from "@/components/admin/report/CouponReport";
import RecentOrderReport from "@/components/admin/report/RecentOrderReport";
import { count } from "console";

interface Orders {
  order_id: number;
  user_id: number;
  order_date: EpochTimeStamp;
  order_status: string;
}

interface Total {
  all_order: number;
  all_sales: number;
  all_shipped: number;
}

interface Using_Coupon {
  coupon_id: number;
  coupon_count_using: number;
}

export default function Home() {
  const router = useRouter();
  const [recentOrders, setOrders] = useState<Orders[]>([]);
  const [total, setTotal] = useState<Total[]>([{ all_order: 0, all_sales: 0, all_shipped: 0 }]);
  const [using_Coupons, setUsing_Coupon] = useState<Using_Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/orders');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch orders');
        }

        console.log('Frontend received orders:', data);
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message || 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/total_sell');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch orders');
        }

        console.log('Frontend received total:', data);

        setTotal(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching total:", err);
        setError(err.message || 'Failed to load total');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotal();
  }, []);

  useEffect(() => {
    const fetchUsing_Coupon = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/coupons');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch orders');
        }

        console.log('Frontend received coupons:', data);

        setUsing_Coupon(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching total:", err);
        setError(err.message || 'Failed to load total');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsing_Coupon();
  }, []);

  const total_order = total[0].all_order;
  const all_sales = total[0].all_sales;
  const all_shipped = total[0].all_shipped;

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
                value={all_sales}
                valueSuffix="THB."
                subtitle="10.2% increase"
                gradient="cyan-blue"
              />
              <OrderReportBlock
                title="จำนวนออเดอร์ทั้งหมด"
                value={total_order}
                valueSuffix=""
                subtitle="10.2% increase"
                gradient="green-teal"
              />
              <OrderReportBlock
                title="ออเดอร์ที่ต้องจัดส่ง"
                value={all_shipped}
                // valuePrefix="THB."
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
                {isLoading ? (
                  <div className="w-auto h-20 bg-gradient-to-r from-gray-200 to-gray-400 shadow-lg rounded-lg p-4 flex items-center justify-center">
                    <p className="text-black opacity-60">Loading orders...</p>
                  </div>
                ) : error ? (
                  <div className="w-auto h-20 bg-gradient-to-r from-red-200 to-red-400 shadow-lg rounded-lg p-4 flex items-center justify-center">
                    <p className="text-black opacity-60">{error}</p>
                  </div>
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
              <div className="w-auto">
                <h2 className="mb-4 text-xl font-kanit-regular">
                  อัตราการใช้คูปอง
                </h2>
                <CouponReport 
                  coupons = {using_Coupons}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
