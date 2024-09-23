import express from "express";
import { limiter } from "../../middlewares/rateLimit";
import {
  getDataByCertainFieldsController,
  getSuggestionProductController,
} from "../../controllers/public/suggestions/suggestionsController";

const router = express.Router();

router.post("/keywords", limiter, getSuggestionProductController);
router.get("/get/byfields", limiter, getDataByCertainFieldsController);

export default router;
