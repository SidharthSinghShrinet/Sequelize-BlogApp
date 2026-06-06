import {Router} from "express";
import {
    createBlog, deleteALlBlog,
    deleteBlog,
    getAllBlogs, getAllDeletedBlogs,
    getBlogById,
    getUserBlogs,
    updateBlog
} from "../controllers/blog.contoller";
import authenticate from "../middleware/auth.middleware";

const router = Router();

router.post("/create-blog", authenticate, createBlog);
router.get("/get-all-blogs", authenticate, getAllBlogs);
router.get("/get-user-blogs", authenticate, getUserBlogs);
router.get("/blog/:id", getBlogById)
router.put("/update-blog/:id", authenticate, updateBlog);
router.delete("/delete-blog/:id", authenticate, deleteBlog);
router.delete("/delete-all", authenticate, deleteALlBlog);
router.get("/deleted-blogs", authenticate, getAllDeletedBlogs);

export default router;