// "use client";

// import BreadCrumbs from "@/components/BreadCrumbs";
// import ProgressCheckout from "@/components/ProgressCheckout";
// import { Button } from "@heroui/react";
// import { useRouter } from "next/navigation";
// import { CheckCircle } from "lucide-react";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";

// export default function FinishPage() {
//   const router = useRouter();
//   const [orderNumber] = useState(`ORD-${Math.random().toString(36).substr(2, 9)}`);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setIsLoading(false), 500);
//     return () => clearTimeout(timer);
//   }, []);

//   const steps = [
//     { name: "SHOPPING CART", href: "/cart", status: "complete" },
//     { name: "CHECKOUT", href: "/checkout", status: "complete" },
//     { name: "FINISH", href: "/finish", status: "current" },
//   ];

//   if (isLoading) {
//     return <div className="ambient-bg min-h-screen flex items-center justify-center">Loading...</div>;
//   }

//   return (
//     <main className="ambient-bg min-h-screen">
//       <div className="container mx-auto">
//         <div className="pt-20 md:pt-28 lg:pt-40 px-4">
//           <BreadCrumbs />
//         </div>

//         <div className="px-4 py-4 md:py-8">
//           <ProgressCheckout steps={steps} />
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="bg-[#1D1C21] rounded-md p-8 text-center max-w-md mx-auto mt-8"
//           >
//             <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//             <h1 className="text-2xl font-bold mb-4">Thank You for Your Order!</h1>
//             <p className="text-gray-400 mb-2">Order Number: {orderNumber}</p>
//             <p className="text-gray-400 mb-8">
//               We&apos;ll send you an email with your order details.
//             </p>
//             <Button
//               variant="solid"
//               className="w-full transition-all hover:scale-105"
//               onPress={() => router.push("/shop")}
//               aria-label="Continue Shopping"
//             >
//               Continue Shopping
//             </Button>
//           </motion.div>
//         </div>
//       </div>
//     </main>
//   );
// }


"use client";

import BreadCrumbs from "@/components/BreadCrumbs";
import ProgressCheckout from "@/components/ProgressCheckout";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function FinishPage() {
  const router = useRouter();

  const steps = [
    { name: "SHOPPING CART", href: "/cart", status: "complete" },
    { name: "CHECKOUT", href: "/checkout", status: "complete" },
    { name: "FINISH", href: "/finish", status: "current" },
  ];

  return (
    <main className="ambient-bg min-h-screen flex flex-col items-center">
      <div className="w-full pt-20 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-8 lg:px-48">
        <BreadCrumbs />
      </div>

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-48 py-4 md:py-8">
        <ProgressCheckout steps={steps} />
        
        <div className="flex justify-center w-full">
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
            
            <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
            <p className="text-gray-400 mb-8 text-lg">
              We&apos;ll send you an email with your order details shortly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="w-full border border-gray-700 hover:bg-gray-800 transition-colors"
                onPress={() => router.push("/orders")}
              >
                View Orders
              </Button>
              
              <Button
                variant="solid"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors"
                onPress={() => router.push("/shop")}
              >
                <ShoppingBag className="w-5 h-5" />
                Continue Shopping
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}