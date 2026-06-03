import {Router} from "express";
import { createBlog, getAllBlogs, getUserBlogs } from "../controllers/blog.contoller";
import authenticate from "../middleware/auth.middleware";

const router = Router();

router.post("/create-blog", authenticate, createBlog);
router.get("/get-all-blogs", authenticate, getAllBlogs);
router.get("/get-user-blogs", authenticate, getUserBlogs);

export default router;