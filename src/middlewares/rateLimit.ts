
import rateLimit from "express-rate-limit";
// Create a limiter function
export const limiter = rateLimit({
  windowMs: 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return   rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
