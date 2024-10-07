import express from "express";
import { deleteUser, updateUser } from "../controllers/userController.js";
import { verifyUser } from "../controllers/authController.js";
import {
  createMetrics,
  getUserMetrics,
  updateMetrics,
} from "../controllers/metricsController.js";

const router = express.Router();

router.post("/create-metrics", verifyUser, createMetrics);
router.get("/get-user-metrics", verifyUser, getUserMetrics);
router.patch("/update-metrics", verifyUser, updateMetrics);

export default router;
