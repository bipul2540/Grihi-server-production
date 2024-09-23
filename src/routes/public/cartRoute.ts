import express from "express";
import { limiter } from "../../middlewares/rateLimit";
import { authenticateToken } from "../../middlewares/authenticateToken";
import {
  getCartItemscontrolleres,
  postCartItemsControlleres,
} from "../../controllers/public/cartManagerControllers";

const router = express.Router();

router.post(
  "/cart/post",
  authenticateToken,
  limiter,
  postCartItemsControlleres
);

router.get("/cart/get", authenticateToken, limiter, getCartItemscontrolleres);

export default router;
