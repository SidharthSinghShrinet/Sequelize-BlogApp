import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getMe,
  updateMe,
  deleteMe,
  getPublicProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/user.contoller.ts";
import authenticate from "../middleware/auth.middleware.ts";
import upload from "../middleware/multer.middleware.ts";
import { authLimiter } from "../middleware/rateLimiter.middleware.ts";

const router = Router();

router.post("/register", authLimiter, upload.single("profileImage"), registerUser);
router.post("/login", authLimiter, loginUser);
router.get("/logout", logoutUser);
router.get("/me", authenticate, getMe);
router.put("/update", authenticate, upload.single("profileImage"), updateMe);
router.delete("/delete", authenticate, deleteMe);
router.get("/profile/:username", getPublicProfile);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

export default router;

