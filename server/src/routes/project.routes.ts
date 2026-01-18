import express from "express";
import { 
  createProject, 
  getMyProjects, 
  getProjectById,
  getProjectActivity
} from "../controllers/project.controller";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();
router.get("/", protect, getMyProjects);
router.get("/:id", protect, getProjectById);
router.post("/", protect, admin, createProject);
router.get("/:id/activity", protect, getProjectActivity);
export default router;