import express from "express";
import { limiter } from "../../middlewares/rateLimit";
import {
  addRatingsController,
  getAllRatingsControllers,
  getRatingsForProductsByUser,
} from "../../controllers/public/RatingsControllers";
import { authenticateToken } from "../../middlewares/authenticateToken";

const router = express.Router();

router.post("/post", authenticateToken, limiter, addRatingsController);
router.get("/get/all/:productId", limiter, getAllRatingsControllers);
router.get(
  "/get/user/:productId",
  authenticateToken,
  limiter,
  getRatingsForProductsByUser
);

export default router;
