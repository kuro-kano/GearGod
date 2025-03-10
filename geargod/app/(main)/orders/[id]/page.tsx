"use client";

import { Divider, Textarea, Card, CardBody } from "@heroui/react";
import { useParams } from "next/navigation";

export default function OrderPage() {
  const { id } = useParams();

  // This would normally come from an API
  const orderData = {
    id: id,
    orderNumber: "ORD-12345",
    date: "2023-05-01",
    status: "กำลังจัดส่ง",
    customerName: "สมชาย ใจดี",
    customerEmail: "somchai@example.com",
    customerPhone: "099-123-4567",
    shippingAddress: "123 ถนนสุขุมวิท แขวงคลองตัน เขตวัฒนา กรุงเทพมหานคร 10110",
    paymentMethod: "บัตรเครดิต",
    paymentStatus: "ชำระเงินแล้ว",
    subtotal: 3600,
    shipping: 50,
    discount: 200,
    total: 3450,
    items: [
      { name: "Mechanical Keyboard RGB", qty: 1, price: 2500 },
      { name: "Gaming Mouse", qty: 2, price: 550 },
    ],
  };

  return (
    <main className="ambient-bg">
      <div className="p-4 sm:p-6 md:p-10 lg:p-16 min-h-screen flex flex-col items-center">
        <div className="p-6 backdrop-filter backdrop-blur-lg bg-black bg-opacity-50 w-full max-w-7xl rounded-lg overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-kanit-regular text-2xl">
              รายละเอียดคำสั่งซื้อ #{orderData.orderNumber}
            </h1>
            <span
              className={`px-4 py-1.5 rounded-full text-sm ${getStatusColor(
                orderData.status
              )}`}
            >
              {orderData.status}
            </span>
          </div>

          <Divider className="mb-8" />

          {/* Order Details Layout - 2 columns on desktop, 1 column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Information */}
            <Card className="bg-black bg-opacity-30 border-0">
              <CardBody>
                <h2 className="font-kanit-regular text-xl mb-4">
                  ข้อมูลลูกค้า
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block font-kanit-regular text-sm text-gray-300 mb-1">
                      ชื่อลูกค้า
                    </label>
                    <Textarea
                      isReadOnly
                      className="w-full bg-opacity-70"
                      maxRows={1}
                      value={orderData.customerName}
                      variant="bordered"
                    />
                  </div>

                  <div>
                    <label className="block font-kanit-regular text-sm text-gray-300 mb-1">
                      อีเมล
                    </label>
                    <Textarea
                      isReadOnly
                      className="w-full bg-opacity-70"
                      maxRows={1}
                      value={orderData.customerEmail}
                      variant="bordered"
                    />
                  </div>

                  <div>
                    <label className="block font-kanit-regular text-sm text-gray-300 mb-1">
                      เบอร์โทรศัพท์
                    </label>
                    <Textarea
                      isReadOnly
                      className="w-full bg-opacity-70"
                      maxRows={1}
                      value={orderData.customerPhone}
                      variant="bordered"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Shipping Information */}
            <Card className="bg-black bg-opacity-30 border-0">
              <CardBody>
                <h2 className="font-kanit-regular text-xl mb-4">
                  ข้อมูลการจัดส่ง
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block font-kanit-regular text-sm text-gray-300 mb-1">
                      ที่อยู่จัดส่ง
                    </label>
                    <Textarea
                      isReadOnly
                      className="w-full bg-opacity-70"
                      value={orderData.shippingAddress}
                      variant="bordered"
                    />
                  </div>

                  <div>
                    <label className="block font-kanit-regular text-sm text-gray-300 mb-1">
                      วันที่สั่งซื้อ
                    </label>
                    <Textarea
                      isReadOnly
                      className="w-full bg-opacity-70"
                      maxRows={1}
                      value={orderData.date}
                      variant="bordered"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Order Items */}
            <Card className="bg-black bg-opacity-30 border-0 md:col-span-2">
              <CardBody>
                <h2 className="font-kanit-regular text-xl mb-4">
                  รายการสินค้า
                </h2>

                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="py-2 px-4 text-left font-kanit-regular">
                          สินค้า
                        </th>
                        <th className="py-2 px-4 text-center font-kanit-regular">
                          จำนวน
                        </th>
                        <th className="py-2 px-4 text-right font-kanit-regular">
                          ราคาต่อชิ้น
                        </th>
                        <th className="py-2 px-4 text-right font-kanit-regular">
                          ราคารวม
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-800">
                          <td className="py-3 px-4">{item.name}</td>
                          <td className="py-3 px-4 text-center">{item.qty}</td>
                          <td className="py-3 px-4 text-right">
                            ฿{item.price.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            ฿{(item.price * item.qty).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 space-y-2 text-right">
                  <div className="flex justify-between">
                    <span className="font-kanit-regular text-gray-300">
                      ยอดรวม:
                    </span>
                    <span>฿{orderData.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-kanit-regular text-gray-300">
                      ค่าจัดส่ง:
                    </span>
                    <span>฿{orderData.shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-kanit-regular text-gray-300">
                      ส่วนลด:
                    </span>
                    <span>-฿{orderData.discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                    <span className="font-kanit-regular text-lg">
                      ยอดรวมสุทธิ:
                    </span>
                    <span className="font-kanit-regular text-lg text-purple-400">
                      ฿{orderData.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Payment Information */}
            <Card className="bg-black bg-opacity-30 border-0 md:col-span-2">
              <CardBody>
                <h2 className="font-kanit-regular text-xl mb-4">
                  ข้อมูลการชำระเงิน
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-kanit-regular text-sm text-gray-300 mb-1">
                      วิธีการชำระเงิน
                    </label>
                    <Textarea
                      isReadOnly
                      className="w-full bg-opacity-70"
                      maxRows={1}
                      value={orderData.paymentMethod}
                      variant="bordered"
                    />
                  </div>

                  <div>
                    <label className="block font-kanit-regular text-sm text-gray-300 mb-1">
                      สถานะการชำระเงิน
                    </label>
                    <Textarea
                      isReadOnly
                      className="w-full bg-opacity-70"
                      maxRows={1}
                      value={orderData.paymentStatus}
                      variant="bordered"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

// Helper function to get status color
function getStatusColor(status: string) {
  switch (status) {
    case "สำเร็จ":
    case "ชำระเงินแล้ว":
      return "bg-green-900 bg-opacity-50 text-green-400";
    case "กำลังจัดส่ง":
      return "bg-blue-900 bg-opacity-50 text-blue-400";
    case "รอดำเนินการ":
      return "bg-yellow-900 bg-opacity-50 text-yellow-400";
    case "ยกเลิก":
      return "bg-red-900 bg-opacity-50 text-red-400";
    default:
      return "bg-gray-900 bg-opacity-50 text-gray-400";
  }
}
