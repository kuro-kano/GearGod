export interface CartItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface CheckoutFormState {
  deliveryMethod: string;
  paymentMethod: string;
  cartItems: CartItem[];
  isLoading: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  discountCode: string;
  discount: number;
  isApplyingDiscount: boolean;
  orderId: string;
  selectedFile: File | null;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  isCreatingOrder: boolean;
}
