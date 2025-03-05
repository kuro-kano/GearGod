interface OrderItem {
    productName: string;
    customerName?: string;
    orderDate?: string;
    orderStatus?: string;
    amount?: number;
  }
  
  interface RecentOrderReportProps {
    orders: OrderItem[];
    showCustomer?: boolean;
    showDate?: boolean;
    showStatus?: boolean;
    showAmount?: boolean;
  }
  
  export default function RecentOrderReport({
    orders = [],
    showCustomer = true,
    showDate = true,
    showStatus = false,
    showAmount = false
  }: RecentOrderReportProps) {
    return (
      <div className="w-full">
        {orders.length === 0 ? (
          <div className="w-auto h-20 bg-gradient-to-r from-gray-200 to-gray-400 shadow-lg rounded-lg p-4 flex items-center justify-center">
            <p className="text-black opacity-60">No recent orders</p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="w-auto h-auto bg-gradient-to-r from-gray-200 to-gray-400 shadow-lg rounded-lg p-4 mb-2">
              <h1 className="text-black font-medium">{order.productName}</h1>
              {showCustomer && order.customerName && (
                <p className="text-black text-sm">Customer: {order.customerName}</p>
              )}
              <div className="flex justify-between mt-1">
                {showDate && order.orderDate && (
                  <p className="text-black text-xs">{order.orderDate}</p>
                )}
                {showStatus && order.orderStatus && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    order.orderStatus === 'Completed' ? 'bg-green-500' : 
                    order.orderStatus === 'Processing' ? 'bg-yellow-500' : 
                    'bg-red-500'
                  } text-white`}>
                    {order.orderStatus}
                  </span>
                )}
                {showAmount && order.amount !== undefined && (
                  <p className="text-black font-medium">{order.amount} THB</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    );
  }