"use client";

import OrderReportBlock from "@/components/admin/report/SummaryReportBlock";

export default function OrderPage() {
  return (
    <main className="ambient-bg">
      <div className="p-4 sm:p-6 md:p-10 lg:p-16 min-h-screen flex flex-col items-center">
        <div className="p-6 backdrop-filter backdrop-blur-lg bg-black bg-opacity-50 w-full max-w-7xl rounded-lg overflow-hidden ">
            <h1 className="font-kanit-regular text-2xl pb-8">รายการคำสั่งซื้อ</h1>
            <OrderReportBlock title={""} />
        </div>
      </div>
    </main>
  );
}
