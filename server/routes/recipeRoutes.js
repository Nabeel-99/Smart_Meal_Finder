import express from "express";
import { verifyUser } from "../controllers/authController.js";
import {
  getDashboardRecipes,
  prepareDashboardRecipes,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.post("/prepare-dashboard-recipes", verifyUser, prepareDashboardRecipes);
router.get("/dashboard-recipes", verifyUser, getDashboardRecipes);

export default router;
