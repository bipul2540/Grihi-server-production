import express from "express";
import { limiter } from "../../middlewares/rateLimit";
import {
  getProductByCategoryControllers,
  getProductByIdControllers,
} from "../../controllers/public/productControllers";

const router = express.Router();

router.get("/products/category", limiter, getProductByCategoryControllers);
router.get("/products/:productId", limiter, getProductByIdControllers);

export default router;
