import {
  getOrderData,
  getOrdersDataById,
  postOrderData,
  updateOrderStatusInDB,
} from "../../models/public/orderModal";
import Razorpay from "razorpay";

import crypto from "crypto";
export const postOrderController = async (req: any, res: any) => {
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({ message: "Unauthorized error" });
  }

  const data = req.body;
  try {
    const response = await postOrderData(data, userId);

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "internal server errors" });
  }
};

export const getOrderController = async (req: any, res: any) => {
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({ message: "Unauthorized error" });
  }
  try {
    const response = await getOrderData(userId);
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "internal server errors" });
  }
};

export const gerOrderByIdController = async (req: any, res: any) => {
  const { userId } = req.user;
  if (!userId) {
    return res.status(400).json({ message: "Unauthorized error" });
  }
  const { orderId } = req.params;
  try {
    const data = await getOrdersDataById(userId, orderId);

    return res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: "internal server errors" });
  }
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const orderStatusWebhookController = async (req: any, res: any) => {
  console.log(req.body);
  const { userId } = req.user;
  const { paymentId, orderId, signature, userOrderId } = req.body.data;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(orderId + "|" + paymentId)
    .digest("hex");

  if (expectedSignature === signature) {
    try {
      const payment = await razorpay.payments.fetch(paymentId);

      const paymentMethod = payment?.method ?? "unknown";
      const last4Digits = payment?.card?.last4;
      const cardType = payment?.card?.network;
      const cardCategory = payment.card?.type;
      const cardIssuer = payment.card?.issuer;
      const cardInfo = {
        last4Digits,
        cardType,
        cardCategory,
        cardIssuer,
      };
      await updateOrderStatusInDB(userOrderId, "success", paymentId, userId, {
        paymentMethod,
        cardInfo,
      });

      res.status(200).json({
        verified: true,
        message: "Payment verified and order updated.",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({
        verified: true,
        message: "Payment verified but failed to update order status.",
      });
    }
  } else {
    try {
      const payment = await razorpay.payments.fetch(paymentId);

      const paymentMethod = payment?.method ?? "unknown";
      const last4Digits = payment?.card?.last4;
      const cardType = payment?.card?.network;
      const cardCategory = payment.card?.type;
      const cardIssuer = payment.card?.issuer;
      const cardInfo = {
        last4Digits,
        cardType,
        cardCategory,
        cardIssuer,
      };
      console.log(cardInfo);
      await updateOrderStatusInDB(userOrderId, "failed", paymentId, userId, {
        paymentMethod,
        cardInfo,
      });

      res.status(400).json({
        verified: false,
        message: "Payment verification failed. Order status updated.",
      });
    } catch (error) {
      console.error("Error updating failed order status:", error);
      res.status(500).json({
        verified: false,
        message: "Failed to verify payment and update order status.",
      });
    }
  }
};
