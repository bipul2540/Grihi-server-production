import cors from "cors";

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
  allowedHeaders: ["Authorization", "Content-Type"], // Add allowed headers
  credentials: true,
};

export const corsConfig = cors(corsOptions);
