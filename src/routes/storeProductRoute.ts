import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { limiter } from "../middlewares/rateLimit";
import {
  createProductByStore,
  deleteProduct,
  getProductByStore,
  getSingleStoreProduct,
  updateProduct,
  uploadBulkProduct,
} from "../controllers/storeProductControllers";
const router = express.Router();

router.get("/:storeId/products", authenticateToken, limiter, getProductByStore);
router.post(
  "/:storeId/products",
  authenticateToken,
  limiter,
  createProductByStore
);

router.get(
  "/:storeId/products/:productId/view",
  authenticateToken,
  limiter,
  getSingleStoreProduct
);

router.put(
  "/:storeId/products/:productId",
  authenticateToken,
  limiter,
  updateProduct
);

router.post(
  "/:storeId/products/csv",
  authenticateToken,
  limiter,
  uploadBulkProduct
);

router.delete(
  "/:storeId/products/:productId",
  authenticateToken,
  limiter,
  deleteProduct
);
export default router;
