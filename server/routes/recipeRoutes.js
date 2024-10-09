import express from "express";
import { verifyUser } from "../controllers/authController.js";
import {
  getDashboardRecipes,
  prepareDashboardRecipes,
} from "../controllers/dashboardController.js";
import {
  generateIngredientsBasedRecipes,
  generateMetricsBasedRecipes,
  getRecipeDetails,
} from "../controllers/recipeController.js";

const router = express.Router();

router.post("/prepare-dashboard-recipes", verifyUser, prepareDashboardRecipes);
router.get("/dashboard-recipes", verifyUser, getDashboardRecipes);
router.get("/get-recipe-details/:id", getRecipeDetails);
router.post("/get-ingredients-recipes", generateIngredientsBasedRecipes);
router.post("/get-metrics-recipes", generateMetricsBasedRecipes);
export default router;
