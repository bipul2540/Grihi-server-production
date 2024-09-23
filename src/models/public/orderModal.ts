import db from "../../config/firebase";
import { OrderAddressDataType, OrderDataType } from "../../types/order-types";
import { FieldValue } from "firebase-admin/firestore";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export const postOrderData = async (data: OrderDataType, userId: string) => {
  try {
    const razorpayOrderOptions = {
      amount: data.totalAmount * 100, // Amount in paise (so, multiply by 100)
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };
    const razorpayOrder = await razorpay.orders.create(razorpayOrderOptions);
    const orderDataWithTimestamps = {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      razorpayOrderId: razorpayOrder.id, // Store Razorpay order ID
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    };
    const ref = db.collection("user").doc(userId).collection("orders");
    const orderRef = await ref.add(orderDataWithTimestamps);
    console.log("Order data successfully written with ID: ", orderRef.id);
    return {
      orderId: orderRef.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    };
  } catch (error) {
    console.error("Error adding order data: ", error);
    throw new Error("Order data updating went wrong");
  }
};

export const updateOrderStatusInDB = async (
  orderId: string,
  status: string,
  paymentId: string,
  userId: string,
  paymentDetails: {
    paymentMethod: string;
    cardInfo?: {
      last4Digits?: string;
      cardType?: string;
      cardCategory?: string;
      cardIssuer?: string;
    };
  }
) => {
  try {
    // Reference to the user's order document
    const ref = db
      .collection("user")
      .doc(userId)
      .collection("orders")
      .doc(orderId);

    // Data to update
    const updateData = {
      status: status,
      paymentId: paymentId,
      paymentMethod: paymentDetails.paymentMethod,
      cardInfo: paymentDetails.cardInfo || null,
      updatedAt: new Date(), // You can add a timestamp if needed
    };

    // Perform the update
    await ref.update(updateData);

    console.log(`Order ${orderId} updated successfully for user ${userId}`);
  } catch (error) {
    console.error("Error updating order:", error);
    throw new Error("Failed to update order data.");
  }
};

export const getOrderData = async (userId: string) => {
  try {
    // Reference to the user's orders collection
    const ordersRef = db.collection("user").doc(userId).collection("orders");

    // Fetch all documents in the collection
    const snapshot = await ordersRef.get();

    if (snapshot.empty) {
      console.log("No matching documents.");
      return [];
    }

    // Extract data from documents
    const orders: any[] = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched order data:");
    return orders;
  } catch (error) {
    console.error("Error fetching order data: ");
    throw new Error("Error fetching order data");
  }
};

export const getOrdersDataById = async (userId: string, orderId: string) => {
  try {
    const orderRef = db
      .collection("user")
      .doc(userId)
      .collection("orders")
      .doc(orderId);

    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      throw new Error("Order not found");
    }

    // Return the order details
    return orderDoc.data();
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};
