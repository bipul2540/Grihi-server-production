import express from "express";
import { limiter } from "../../middlewares/rateLimit";
import { authenticateToken } from "../../middlewares/authenticateToken";
import {
  gerOrderByIdController,
  getOrderController,
  postOrderController,
} from "../../controllers/public/orderControllers";

const router = express.Router();

router.post("/post", authenticateToken, limiter, postOrderController);
router.get("/get", authenticateToken, limiter, getOrderController);
router.get("/get/:orderId", authenticateToken, limiter, gerOrderByIdController);

export default router;
