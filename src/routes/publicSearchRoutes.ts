import express from "express";
import { limiter } from "../middlewares/rateLimit";
import {
  getSearchHistorySuggestion,
  postSearchQueryData,
} from "../controllers/publicSearchControllers";
import { verifyTokenOrSession } from "../middlewares/verifyAuthOrSession";
const router = express.Router();

router.post(
  "/search-query",
  verifyTokenOrSession,
  limiter,
  postSearchQueryData
);

router.get("/suggestion", limiter, getSearchHistorySuggestion);

export default router;
