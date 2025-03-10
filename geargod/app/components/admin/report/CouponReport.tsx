// import { Progress } from "@heroui/react";

interface Using_Coupon {
  coupon_id: number;
  coupon_count_using: number;
  coupon_name: string;
}

interface CouponReportProps {
  coupon: Using_Coupon[]; // Expecting an array of coupons
}

export default function CouponReport({ coupon }: CouponReportProps) {
  if (!coupon || coupon.length === 0) return <p>Loading...</p>; // Handle empty or undefined cases

  return (
    <div>
      {coupon.map((item) => (
        <div key={item.coupon_id} className="w-96 h-14 bg-gradient-to-r from-gray-200 to-gray-400 shadow-lg rounded-lg p-4 mb-2">
          <p className="text-black pb-4">{item.coupon_name}</p>
          {/* <Progress aria-label="Usage Progress" className="w-full" value={item.coupon_count_using} /> */}
        </div>
      ))}
    </div>
  );
}
