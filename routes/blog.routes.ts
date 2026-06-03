import {Router} from "express";
import {createBlog, getAllBlogs, getBlogById, getUserBlogs, updateBlog} from "../controllers/blog.contoller";
import authenticate from "../middleware/auth.middleware";

const router = Router();

router.post("/create-blog", authenticate, createBlog);
router.get("/get-all-blogs", authenticate, getAllBlogs);
router.get("/get-user-blogs", authenticate, getUserBlogs);
router.get("/blog/:id",getBlogById)
router.put("/update-blog/:id",authenticate, updateBlog);

export default router;