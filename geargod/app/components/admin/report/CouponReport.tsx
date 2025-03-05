import {Progress} from "@heroui/react";

export default function CouponReport(){
    return(
        <div className="w-full bg-gradient-to-r from-gray-200 to-gray-400 shadow-lg rounded-lg p-3 sm:p-4">
            <p className="text-black pb-2 sm:pb-4 text-sm sm:text-base">Coupon name</p>
            <Progress aria-label="Loading..." className="w-full" value={60} />
        </div>
    );
}