import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import {
  createStoreByAdmin,
  deleteStoreByAdmin,
  getStoreByAdmin,
} from "../controllers/storeControllers";
import { limiter } from "../middlewares/rateLimit";
const router = express.Router();

router.post("/create", authenticateToken, limiter, createStoreByAdmin);
router.get("/", authenticateToken, limiter, getStoreByAdmin);
router.delete("/:storeId", authenticateToken, limiter, deleteStoreByAdmin);
router.patch("/:storeId", authenticateToken, limiter); 


export default router;
