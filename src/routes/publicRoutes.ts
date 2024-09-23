import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { limiter } from "../middlewares/rateLimit";
import { testingSession } from "../controllers/publicController";
const router = express.Router();

router.get("/", authenticateToken, limiter, testingSession);

export default router;
