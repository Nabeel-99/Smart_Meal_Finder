import express from "express";
import { verifyUser } from "../controllers/authController.js";
import { manageDashboardRecipes } from "../controllers/dashboardController.js";
import {
  deleteRecipe,
  generateIngredientsBasedRecipes,
  generateMetricsBasedRecipes,
  getRecipeDetails,
  getSavedRecipes,
  saveRecipe,
} from "../controllers/recipeController.js";
import jwt from "jsonwebtoken";

const checkIfUserHasPantry = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next();
  }
  try {
    const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = verifiedToken.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const router = express.Router();

router.get("/dashboard-recipes", verifyUser, manageDashboardRecipes);
router.get("/get-recipe-details/:id", getRecipeDetails);
router.post(
  "/get-ingredients-recipes",
  checkIfUserHasPantry,
  generateIngredientsBasedRecipes
);
router.post("/get-metrics-recipes", generateMetricsBasedRecipes);
router.post("/save-recipe", verifyUser, saveRecipe);
router.get("/get-saved-recipes", verifyUser, getSavedRecipes);
router.delete("/delete-recipe/:id", verifyUser, deleteRecipe);

export default router;
