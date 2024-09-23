import { Timestamp } from "firebase/firestore";

export type OrderAddressDataType = {
  address_type: string;
  city: string;
  country: string;
  id?: string;
  isDefault: boolean;
  landmark: string;
  local_address: string;
  mobile: string;
  name: string;
  pincode: string;
  state: string;
  alternate_mobile: string;
};

export type OrderProductDataType = {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  image: string;
  original_price: number; // Corrected typo
};

export type orderPaymentDetailsDataType = {
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
};

export type OrderDataType = {
  userId: string;
  //   storeId: string;
  orderData?: string;
  status: string;
  totalAmount: number;
  shippingAddress?: OrderAddressDataType;
  items: OrderProductDataType[];
  paymentDetails?: orderPaymentDetailsDataType;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
