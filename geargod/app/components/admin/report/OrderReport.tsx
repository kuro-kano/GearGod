import { useState } from "react";

interface OrderItem {
  id: string;
  productName: string;
  customerName?: string;
  orderDate?: string;
  orderStatus?: string;
  amount?: number;
}

interface RecentOrderReportProps {
  orders: OrderItem[];
  isAdmin: boolean;
  showCustomer?: boolean;
  showDate?: boolean;
  showStatus?: boolean;
  showAmount?: boolean;
}

export default function RecentOrderReport({
  orders = [],
  isAdmin = false,
  showCustomer = true,
  showDate = true,
  showStatus = false,
  showAmount = false
}: RecentOrderReportProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [newStatus, setNewStatus] = useState("");

  // เปิด Popup และตั้งค่า order ที่ต้องการแก้ไข
  const openModal = (order: OrderItem) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus || "Processing");
  };

  // ปิด Popup
  const closeModal = () => {
    setSelectedOrder(null);
    setNewStatus("");
  };

  // อัปเดตสถานะในฐานข้อมูล
  const updateStatus = async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetch("/api/update-order-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // ✅ กำหนด Header
        body: JSON.stringify({ id: Number(selectedOrder.id), orderStatus: newStatus }) // ✅ แปลง id เป็น number
      });

      if (response.ok) {
        // alert("อัปเดตสถานะสำเร็จ!");
        closeModal();
        window.location.reload();
      } else {
        // alert("เกิดข้อผิดพลาด!");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="w-full">
      {orders.length === 0 ? (
        <div className="max-w-94 h-20 bg-gradient-to-r from-gray-200 to-gray-400 shadow-lg rounded-lg p-4 flex items-center justify-center">
          <p className="text-black opacity-60">No recent orders</p>
        </div>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="w-auto h-auto bg-gradient-to-r from-gray-200 to-gray-400 shadow-lg rounded-lg p-4 mb-2">
            <h1 className="text-black font-medium">{order.productName}</h1>
            {showCustomer && order.customerName && (
              <p className="text-black text-sm">Customer: {order.customerName}</p>
            )}
            <div className="flex justify-between mt-1 items-center">
              {showDate && order.orderDate && (
                <p className="text-black text-xs">{order.orderDate}</p>
              )}
              {showStatus && order.orderStatus && (
                <button
                  onClick={() => isAdmin && openModal(order)}
                  className={`text-xs px-2 py-1 rounded cursor-pointer ${order.orderStatus === "Completed"
                    ? "bg-green-500"
                    : order.orderStatus === "Processing"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                    } text-white`}
                >
                  {order.orderStatus}
                </button>
              )}
              {showAmount && order.amount !== undefined && (
                <p className="text-black font-medium">{order.amount} THB</p>
              )}
            </div>
          </div>
        ))
      )}

      {/* Popup Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-black">เปลี่ยนสถานะคำสั่งซื้อ</h2>
            <p className="mb-2 text-black">สินค้า: {selectedOrder.productName}</p>
            <label htmlFor="orderStatus" className="text-black">สถานะ:</label>
            <select
              id="orderStatus"
              className="w-full p-2 border rounded"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="flex justify-end mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={closeModal}>
                ยกเลิก
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={updateStatus}>
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
