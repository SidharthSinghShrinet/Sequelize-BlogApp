import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getMe,
  updateMe,
  deleteMe,
} from "../controllers/user.contoller.ts";
import authenticate from "../middleware/auth.middleware.ts";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/me", authenticate, getMe);
router.put("/update", authenticate, updateMe);
router.delete("/delete", authenticate, deleteMe);

export default router;
