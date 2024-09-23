import express from "express";
import { limiter } from "../../middlewares/rateLimit";
import { getAddressByPinCodeController } from "../../controllers/public/geoLocationController";

const router = express.Router();

router.get("/geolocation", limiter, getAddressByPinCodeController);

export default router;
