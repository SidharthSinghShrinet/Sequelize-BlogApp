import rateLimit from "express-rate-limit";

// General Rate Limiter (100 requests per 15 minutes)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: 429,
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Strict Rate Limiter for Sensitive Auth Routes (15 requests per 15 minutes)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: 429,
    success: false,
    message: "Too many authentication attempts, please try again after 15 minutes.",
  },
});
