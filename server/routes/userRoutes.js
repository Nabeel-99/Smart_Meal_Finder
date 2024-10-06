import express from "express";
import {
  createUser,
  deleteUser,
  loginUser,
  logout,
  updateUser,
} from "../controllers/userController.js";
import { verifyUser } from "../controllers/authController.js";
import {
  createMetrics,
  getUserMetrics,
  updateMetrics,
} from "../controllers/metricsController.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.post("/create-metrics", verifyUser, createMetrics);
router.get("/get-user-metrics", verifyUser, getUserMetrics);
router.patch("/update-metrics", verifyUser, updateMetrics);
router.patch("/update", verifyUser, updateUser);
router.delete("/delete", verifyUser, deleteUser);

export default router;
