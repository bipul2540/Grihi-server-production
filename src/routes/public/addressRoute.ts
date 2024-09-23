import express from "express";
import { limiter } from "../../middlewares/rateLimit";
import { authenticateToken } from "../../middlewares/authenticateToken";
import {
  addAddressByUserIdControllers,
  getAddressByUserIdControllers,
  updateAddressControllers,
} from "../../controllers/public/addressControllers";

const router = express.Router();

router.get(
  "/address",
  authenticateToken,
  limiter,
  getAddressByUserIdControllers
);
router.post(
  "/address/post",
  authenticateToken,
  limiter,
  addAddressByUserIdControllers
);
router.put(
  "/address/put",
  authenticateToken,
  limiter,
  updateAddressControllers
);

export default router;
