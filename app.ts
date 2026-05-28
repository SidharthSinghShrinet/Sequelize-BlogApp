import { configDotenv } from "dotenv";
import express from "express";
import morgan from "morgan";
import error from "./middleware/error.middleware.ts";
import cors from "cors";
import userRoutes from "./routes/user.routes.ts";
import cookieParser from "cookie-parser";
import "./model/associations.ts";

configDotenv();

const app = express();
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1/users", userRoutes);

// Global Error Handler
app.use(error);

export default app;
