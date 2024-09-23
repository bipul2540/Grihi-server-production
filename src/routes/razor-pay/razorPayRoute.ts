import express from "express";
import { authenticateToken } from "../../middlewares/authenticateToken";
import { limiter } from "../../middlewares/rateLimit";
import { getBankAccountController } from "../../controllers/razor-pay/getBankAccountController";
import { orderStatusWebhookController } from "../../controllers/public/orderControllers";
const router = express.Router();

router.get(
  "/bank-account",
  authenticateToken,
  limiter,
  getBankAccountController
);
router.post(
  "/order/payment-verify",
  authenticateToken,
  limiter,
  orderStatusWebhookController
);

export default router;
