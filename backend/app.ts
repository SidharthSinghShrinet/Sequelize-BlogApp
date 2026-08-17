import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import error from "./middleware/error.middleware.ts";
import cors from "cors";
import userRoutes from "./routes/user.routes.ts";
import blogRoutes from "./routes/blog.routes.ts";
import projectRoutes from "./routes/project.routes.ts";
import bookmarkRoutes from "./routes/bookmark.routes.ts";
import commentRoutes from "./routes/comment.routes.ts";
import cookieParser from "cookie-parser";
import "./model/associations.ts";
import { globalLimiter } from "./middleware/rateLimiter.middleware.ts";

import sequelize from "./config/db.ts";

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Security HTTP Headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    origin: (origin, callback) => {
      // Allow server-to-server / Postman (no origin header)
      if (!origin) return callback(null, true);
      // Build allowed list from FRONTEND_URL env var (supports comma-separated values)
      const allowed = [
        "https://www.showoff4u.in",
        "https://showoff4u.in",
        ...(process.env.FRONTEND_URL ?? "").split(",").map((o) => o.trim()).filter(Boolean)
      ];
      // Allow exact match OR any *.vercel.app OR localhost
      const ok =
        allowed.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.includes("localhost");
      callback(null, ok ? origin : false);
    },
    credentials: true,
  }),
);

app.use(
  morgan("dev", {
    skip: (req) => req.url === "/api/v1/health" || req.url === "/healthz" || req.url === "/",
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

// Universal Health Check Endpoints (Placed BEFORE rate limiting so health checks never return 429)
// Executes a lightweight SELECT 1 query against MySQL to keep Aiven DB active & prevent power-off
const healthHandler = async (_req: express.Request, res: express.Response) => {
  let dbStatus = "connected";
  try {
    await sequelize.query("SELECT 1");
  } catch (err: any) {
    dbStatus = "disconnected";
    console.error("Health check DB ping failed:", err.message || err);
  }

  res.status(200).json({
    status: "ok",
    database: dbStatus,
    message: "Server is healthy and active",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
};

app.get(["/", "/healthz", "/api/v1/health"], healthHandler);
app.head(["/", "/healthz", "/api/v1/health"], (_req, res) => {
  res.status(200).end();
});

// Global Rate Limiter for API data routes
app.use("/api/v1", globalLimiter);

// API Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/bookmarks", bookmarkRoutes);
app.use("/api/v1/comments", commentRoutes);

// Global Error Handler
app.use(error);

export default app;
// Trigger server reload after .env configuration changes


