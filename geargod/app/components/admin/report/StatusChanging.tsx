interface OrderItem {
  id: string;
  productName: string;
  customerName?: string;
  orderDate?: string;
  orderStatus?: string;
  amount?: number;
}

interface StatusChangingProps {
  selectedOrder: OrderItem | null;
  newStatus: string;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onClose: () => void;
  onUpdate: () => void;
}

export default function StatusChanging({
  selectedOrder,
  newStatus,
  onStatusChange,
  onClose,
  onUpdate
}: StatusChangingProps) {
  if (!selectedOrder) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div 
        className="bg-[#1D1C21] rounded-md p-6 shadow-lg w-96 border border-gray-700 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-60"
        style={{
          boxShadow: "0 10px 20px rgba(156, 39, 176, 0.2), 0 6px 6px rgba(32, 17, 126, 0.15)"
        }}
      >
        <h2 className="text-lg font-bold mb-4 text-gray-200">Update Order Status</h2>
        <p className="mb-2 text-gray-300">Product: {selectedOrder.productName}</p>
        <label htmlFor="orderStatus" className="text-gray-300 block mb-2">Status:</label>
        <select
          id="orderStatus"
          className="w-full p-2 rounded bg-[#2D2C31] text-gray-200 border border-gray-700 focus:border-purple-500 focus:outline-none"
          value={newStatus}
          onChange={onStatusChange}
        >
          <option value="Pending">Checking</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <div className="flex justify-end mt-6 gap-3">
          <button 
            className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            onClick={onUpdate}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}