import express from "express";
import { 
  createTask, 
  getProjectTasks, 
  updateTask,
    getMyTasks
} from "../controllers/task.controller";
import { addComment, getTaskComments } from "../controllers/comment.controller";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createTask);
router.get("/project/:projectId", protect, getProjectTasks);
router.patch("/:id", protect, updateTask);
router.get("/my-tasks", protect, getMyTasks);
router.post("/comments", protect, addComment);
router.get("/:taskId/comments", protect, getTaskComments);
export default router;