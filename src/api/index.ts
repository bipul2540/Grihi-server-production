import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import storeRoutes from "../routes/storeRoutes";
import storeProductRoutes from "../routes/storeProductRoute";
import storeProductSearchRoute from "../routes/storeProductSearchRoute";
import RateLimitError from "../services/RateLimitError";
import publicRoutes from "../routes/publicRoutes";
import publicSearchRoutes from "../routes/publicSearchRoutes";
import productsRoute from "../routes/public/productsRoute";
import addressRoute from "../routes/public/addressRoute";
import geoLocationRoute from "../routes/public/geoLocationRoute";
import cartRoutes from "../routes/public/cartRoute";
import orderRoute from "../routes/public/orderRoute";
import searchRoute from "../routes/public/searchRoute";
import ratingsRoute from "../routes/public/RatingsRoute";
import suggestionRoute from "../routes/suggestions/suggestionRoute";
import razorPayRoute from "../routes/razor-pay/razorPayRoute";
import cors from "cors";
import dotenv from "dotenv";
const app = express();
const allowedOrigins = ["http://localhost:3000"];

const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"], // Add any other headers if needed
  credentials: true,
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions)); // Enable pre-flight for all routes

const PORT = process.env.PORT || 4000;
dotenv.config();
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res) => {
  return res.status(200).json({ data: "htllo world testing" });
});
app.use("/api/admin/stores", storeRoutes);
app.use("/api/admin/stores", storeProductRoutes);
app.use("/api/admin/stores", storeProductSearchRoute);

app.use("/api/public", publicRoutes);
app.use("/api/public", publicSearchRoutes);

app.use("/api/public", productsRoute);

app.use("/api/public/user", addressRoute);
app.use("/api/public/user", geoLocationRoute);

app.use("/api/public/user", cartRoutes);

app.use("/api/public/user/order", orderRoute);

app.use("/api/public/search", searchRoute);
app.use("/api/public/ratings", ratingsRoute);

app.use("/api/public/suggestions", suggestionRoute);
app.use("/api/public/razor-pay", razorPayRoute);

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof RateLimitError) {
    // Handle rate-limiting errors
    res.status(429).json({
      error: "Too many requests, please try again later.",
      message: err.message, // Include error message for debugging
    });
  } else {
    // Handle general server errors
    res.status(500).json({
      error: "Something broke!",
      message: err.message, // Include error message for debugging
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Conditionally include stack trace in development
    });
  }
});
// syncFirestoreWithAlgolia();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
export default app;
