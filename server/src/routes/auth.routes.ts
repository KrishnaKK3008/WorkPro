import express from "express";
import { loginUser, registerUser,getAllUsers, logoutUser, getWorkforceStats } from "../controllers/auth.controller";
import { protect, admin } from "../middleware/authMiddleware";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect, getAllUsers);
router.post("/logout", logoutUser);
router.get("/workforce-stats", protect, admin, getWorkforceStats);
export default router;