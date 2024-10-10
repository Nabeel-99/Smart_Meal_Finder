import express from "express";
import { deleteUser, updateUser } from "../controllers/userController.js";
import { verifyUser } from "../controllers/authController.js";
import {
  createMetrics,
  createPantry,
  getUserMetrics,
  getUserPantry,
  updateMetrics,
  updatePantry,
} from "../controllers/preferenceController.js";

const router = express.Router();

router.post("/create-metrics", verifyUser, createMetrics);
router.get("/get-user-metrics", verifyUser, getUserMetrics);
router.patch("/update-metrics", verifyUser, updateMetrics);
router.post("/create-pantry", verifyUser, createPantry);
router.patch("/update-pantry", verifyUser, updatePantry);
router.get("/get-user-pantry", verifyUser, getUserPantry);

export default router;
