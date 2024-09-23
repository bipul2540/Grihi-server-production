import express from "express";
import { limiter } from "../../middlewares/rateLimit";
import {
  getSearchByPageContoller,
  getSearchContoller,
} from "../../controllers/public/SearchControllers";

const router = express.Router();

router.get("/", limiter, getSearchContoller);
router.get("/bypage", limiter, getSearchByPageContoller);

export default router;
