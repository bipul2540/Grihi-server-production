import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { limiter } from "../middlewares/rateLimit";
import { storeProductSearch } from "../controllers/storeProductSearchControllers";
const router = express.Router();

router.get(
  "/:storeId/products/search",
  authenticateToken,
  limiter,
  storeProductSearch
);

export default router;
