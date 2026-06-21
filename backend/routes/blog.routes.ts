import {Router} from "express";
import {
    createBlog, deleteALlBlog,
    deleteBlog,
    getAllBlogs, getAllDeletedBlogs,
    getBlogById,
    getUserBlogs,
    updateBlog,
    uploadImage,
    testAiPrompt,
    getPlatformAnalytics
} from "../controllers/blog.contoller";
import authenticate from "../middleware/auth.middleware";
import upload from "../middleware/multer.middleware";

const router = Router();

router.post("/upload", authenticate, upload.single("image"), uploadImage);
router.post("/create-blog", authenticate, createBlog);
router.post("/test-ai-prompt", testAiPrompt);
router.get("/get-all-blogs", getAllBlogs);
router.get("/get-user-blogs", authenticate, getUserBlogs);
router.get("/blog/:id", getBlogById)
router.put("/update-blog/:id", authenticate, updateBlog);
router.delete("/delete-blog/:id", authenticate, deleteBlog);
router.delete("/delete-all", authenticate, deleteALlBlog);
router.get("/deleted-blogs", authenticate, getAllDeletedBlogs);
router.get("/analytics", getPlatformAnalytics);

export default router;