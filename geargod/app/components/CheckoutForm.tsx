"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { showToast } from "./ToastAlert";
import QRPromptPay from "./OnlinePayment";
import { useSession } from "next-auth/react";

interface CartItem {
  product_id: string;
  product_name: string;
  category: string;
  price: number;
  quantity: number;
  image_url?: string;
  material?: {
    id?: string;
    name: string;
    add_price: number;
  };
  components?: Array<{
    id?: string;
    name: string;
    add_price: number;
  }>;
  color?: {
    id?: string;
    color_name: string;
    color_code: string;
    add_price: number;
  };
}

const calculateItemPrice = (item: CartItem): number => {
  let price = item.price;
  if (item.material) price += item.material.add_price;
  if (item.color) price += item.color.add_price;
  if (item.components) {
    price += item.components.reduce((sum, comp) => sum + comp.add_price, 0);
  }
  return price;
};

const CheckoutForm = () => {
  const { data: session } = useSession();
  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("/api/cart");
        if (!response.ok) throw new Error("Failed to fetch cart");
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setIsApplyingDiscount(true);
    try {
      const response = await fetch("/api/coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: discountCode }),
      });

      const data = await response.json();

      if (data.valid) {
        if (data.type === "percentage") {
          setDiscount(
            (data.discount / 100) *
              cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              )
          );
        } else if (data.type === "fixed") {
          setDiscount(data.discount);
        }
        showToast({
          title: "Coupon Applied",
          description: data.message,
          color: "success",
        });
      } else {
        setDiscount(0);
        showToast({
          title: "Invalid Coupon",
          description: data.message,
          color: "danger",
        });
      }
    } catch {
      setDiscount(0);
      showToast({
        title: "Error",
        description: "Failed to apply coupon",
        color: "danger",
      });
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const totalAfterDiscount = subtotal - discount;
    return Math.max(totalAfterDiscount, 0).toFixed(2);
  };

  const handleDeliveryMethodChange = (method: string) => {
    setDeliveryMethod(method);
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const createOrder = async () => {
    setIsCreatingOrder(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          firstName,
          lastName,
          phone,
          deliveryMethod,
          paymentMethod,
          total: parseFloat(calculateTotal()),
        }),
      });

      if (!response.ok) throw new Error("Failed to create order");
      const data = await response.json();
      setOrderId(data.orderId);
      return data.orderId;
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to create order",
        color: "danger",
      });
      throw error;
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast({
        title: "Error",
        description: "Please select a file first",
        color: "danger",
      });
      return;
    }

    try {
      setUploadStatus("uploading");

      // Create order if it doesn't exist
      let currentOrderId = orderId;
      if (!currentOrderId) {
        currentOrderId = await createOrder();
      }

      const formData = new FormData();
      formData.append("slip", selectedFile);
      formData.append("orderId", currentOrderId);

      const response = await fetch("/api/upload-slip", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      if (data.success) {
        setUploadStatus("success");
        showToast({
          title: "Success",
          description: "Payment slip uploaded successfully",
          color: "success",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setUploadStatus("error");
      showToast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload slip",
        color: "danger",
      });
    }
  };

  const handlePlaceOrder = async () => {
    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !phone ||
      (deliveryMethod === "home" && !shippingAddress)
    ) {
      showToast({
        title: "Error",
        description: "Please fill in all required fields",
        color: "danger",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        username: session?.user?.username || null, // Get username from session
        total_amount: parseFloat(calculateTotal()),
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        shipping_address:
          deliveryMethod === "home" ? shippingAddress : "Store Pickup",
        payment_method: paymentMethod,
        cart_items: cartItems.map((item) => {
          const totalUnitPrice = calculateItemPrice(item);
          return {
            ...item,
            category: item.category,  // Changed this line
            material_id: item.material?.id || null,
            color_id: item.color?.id || null, // Make sure color.id exists
            component_ids: item.components?.map(comp => comp.id) || [],
            unit_price: totalUnitPrice,
            subtotal: totalUnitPrice * item.quantity
          };
        })
      };

      // console.log('Order Data:', JSON.stringify(orderData, null, 2));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        showToast({
          title: "Success",
          description: "Order placed successfully!",
          color: "success",
        });
        setOrderId(result.orderId);
        // Clear cart or redirect to confirmation page
      } else {
        throw new Error(result.message || "Failed to place order");
      }
    } catch (error) {
      showToast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to place order",
        color: "danger",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#1D1C21] rounded-md p-6 shadow-foreground-700 backdrop-filter backdrop-blur-sm bg-opacity-60">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {/* Order Summary Section */}
      <div className="space-y-6 mb-8">
        {isLoading ? (
          <div className="text-center py-4">Loading cart items...</div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-4">Your cart is empty</div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center gap-4 p-4 bg-black/20 rounded-lg"
            >
              <Image
                width={96}
                height={96}
                src={item.image_url || "/placeholder-image.jpg"}
                alt={item.product_name}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product_name}</h3>
                <p className="text-gray-400">฿{item.price.toFixed(2)}</p>
              </div>
              <div className="text-center mx-4">
                <p className="text-sm text-gray-400">Quantity</p>
                <p className="font-medium">{item.quantity}</p>
              </div>
              <div className="w-24 text-right">
                <p className="text-sm text-gray-400">Price</p>
                <p className="font-medium">
                  ฿{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Payment Details Section */}
      <div className="space-y-6">
        {/* Payment Method */}
        <div className="space-y-2">
          <h3 className="font-medium mb-3">Payment Method</h3>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "cash"}
                onChange={() => handlePaymentMethodChange("cash")}
                className="form-radio text-blue-600"
              />
              <span className="text-gray-300">Cash</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "promptpay"}
                onChange={() => handlePaymentMethodChange("promptpay")}
                className="form-radio text-blue-600"
              />
              <span className="text-gray-300">QR Promptpay</span>
            </label>
          </div>
          {paymentMethod === "promptpay" && (
            <div className="mt-4">
              <QRPromptPay
                amount={parseFloat(calculateTotal())}
                orderId={orderId} // Add orderId as a prop
              />
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-400">Upload payment slip:</p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700"
                />
                {selectedFile && (
                  <button
                    onClick={handleUpload}
                    disabled={uploadStatus === "uploading" || isCreatingOrder}
                    className={`mt-2 px-4 py-2 rounded ${
                      uploadStatus === "uploading" || isCreatingOrder
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                  >
                    {isCreatingOrder
                      ? "Creating Order..."
                      : uploadStatus === "uploading"
                      ? "Uploading..."
                      : "Upload Slip"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Delivery Address Section */}
        <div className="space-y-4">
          <h3 className="font-medium mb-3">Delivery Information</h3>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="p-3 rounded bg-black/20 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="p-3 rounded bg-black/20 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 rounded bg-black/20 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          {deliveryMethod === "home" && (
            <textarea
              className="w-full p-3 rounded bg-black/20 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your delivery address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              rows={4}
            ></textarea>
          )}

          <div className="flex gap-4 mt-4">
            <button
              className={`flex-1 py-2 rounded transition-colors ${
                deliveryMethod === "home"
                  ? "bg-blue-600 text-white"
                  : "bg-black/20 text-gray-300"
              }`}
              onClick={() => handleDeliveryMethodChange("home")}
            >
              Home Delivery
            </button>
            <button
              className={`flex-1 py-2 rounded transition-colors ${
                deliveryMethod === "store"
                  ? "bg-blue-600 text-white"
                  : "bg-black/20 text-gray-300"
              }`}
              onClick={() => handleDeliveryMethodChange("store")}
            >
              Store Pickup
            </button>
          </div>
        </div>

        {/* Total Section */}
        <div className="space-y-4 pt-6 border-t border-gray-700">
          {/* Discount Code Section - Moved here */}
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Enter discount code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              className="flex-1 p-2 rounded bg-black/20 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleApplyDiscount}
              disabled={isApplyingDiscount || !discountCode.trim()}
              className={`px-6 py-2 rounded transition-colors ${
                isApplyingDiscount
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {isApplyingDiscount ? "Applying..." : "Apply Code"}
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <p className="text-gray-400">
                Subtotal: ฿
                {cartItems
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </p>
              {discount > 0 && (
                <p className="text-green-500">
                  Discount: -฿{discount.toFixed(2)}
                </p>
              )}
              <p className="text-2xl font-bold">Total: ฿{calculateTotal()}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => (window.location.href = "/cart")}
                className="px-6 py-2 rounded border border-gray-600 hover:bg-gray-700 transition-colors"
              >
                Back to Cart
              </button>
              <button
                className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                disabled={cartItems.length === 0 || isProcessing}
                onClick={handlePlaceOrder}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
