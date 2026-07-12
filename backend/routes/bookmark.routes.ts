import { Router } from "express";
import { toggleBookmark, getMyBookmarks } from "../controllers/bookmark.controller.ts";
import authenticate from "../middleware/auth.middleware.ts";

const router = Router();

router.post("/toggle", authenticate, toggleBookmark);
router.get("/", authenticate, getMyBookmarks);

export default router;
