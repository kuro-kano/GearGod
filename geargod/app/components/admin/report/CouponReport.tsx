import {Progress} from "@heroui/react";

export default function CouponReport(){
    return(
        <div className="w-96 h-20 bg-gradient-to-r from-gray-200 to-gray-400 shadow-lg rounded-lg p-4">
            <p className="text-black pb-4">Coupon name</p>
            <Progress aria-label="Loading..." className="max-w-md" value={60} />
        </div>
    );
}

