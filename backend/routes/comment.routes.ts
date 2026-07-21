import { Router } from "express";
import {
  createComment,
  getBlogComments,
  getProjectComments,
  deleteComment,
} from "../controllers/comment.controller.ts";
import authenticate from "../middleware/auth.middleware.ts";

const router = Router();

router.post("/", authenticate, createComment);
router.get("/blog/:blogId", getBlogComments);
router.get("/project/:projectId", getProjectComments);
router.delete("/:id", authenticate, deleteComment);

export default router;
