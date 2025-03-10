"use client";

import { useEffect, useState } from "react";
import RecentOrderReport from "@/components/admin/report/OrderReport";
import BreadCrumbs from "@/components/BreadCrumbs";
import Navbar from '@/components/Navbar'

interface Orders {
  order_id: number;
  user_id: number;
  order_date: EpochTimeStamp;
  order_status: string;
}

export default function OrderPage() {
  const [recentOrders, setOrders] = useState<Orders[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/all_orders_for_customer');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch orders');
        }

        console.log('Frontend received orders:', data);
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <main className="ambient-bg">
      <Navbar />
      <div className="pt-40 pl-48">
        <BreadCrumbs />
      </div>
      <div className="p-4 sm:p-6 md:p-10 lg:p-16 min-h-screen flex flex-col items-center">
        <div className="p-6 backdrop-filter backdrop-blur-lg bg-black bg-opacity-50 w-full max-w-7xl rounded-lg overflow-hidden ">
          <h1 className="font-kanit-regular text-2xl pb-8">รายการคำสั่งซื้อทั้งหมด</h1>
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
          {/* <Link href="/admin/orders/1">
            <OrderReportBlock title={""} />
          </Link> */}
        </div>
      </div>
    </main >
  );
}
