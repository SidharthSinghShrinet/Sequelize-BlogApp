import { Router } from "express";
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getUserProjects,
    getGithubReadme
} from "../controllers/project.controller";
import authenticate from "../middleware/auth.middleware";
import upload from "../middleware/multer.middleware";

const router = Router();

router.post("/", authenticate, upload.single("thumbnail"), createProject);
router.get("/", getAllProjects);
router.get("/user", authenticate, getUserProjects);
router.get("/github-readme", authenticate, getGithubReadme);
router.get("/:id", getProjectById);
router.put("/:id", authenticate, upload.single("thumbnail"), updateProject);
router.delete("/:id", authenticate, deleteProject);

export default router;
