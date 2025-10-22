import express from "express";
import {
  getMe,
  loginUser,
  registerUser,
  getAllUsers,
  deleteUser,
  updateUser,
  resetUserPassword,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getMe);

// Admin only routes
router.get("/", protect, admin, getAllUsers);
router.delete("/:id", protect, admin, deleteUser);
router.put("/:id", protect, admin, updateUser);
router.put("/:id/reset-password", protect, admin, resetUserPassword);

export default router;
