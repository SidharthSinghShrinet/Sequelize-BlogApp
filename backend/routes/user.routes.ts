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

const router = Router();

router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/me", authenticate, getMe);
router.put("/update", authenticate, upload.single("profileImage"), updateMe);
router.delete("/delete", authenticate, deleteMe);
router.get("/profile/:username", getPublicProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
