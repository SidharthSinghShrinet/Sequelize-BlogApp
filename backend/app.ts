import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
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


const app = express();
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    origin: (_origin, callback) => callback(null, true),
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/bookmarks", bookmarkRoutes);
app.use("/api/v1/comments", commentRoutes);

// Global Error Handler
app.use(error);

export default app;
// Trigger server reload after .env configuration changes
