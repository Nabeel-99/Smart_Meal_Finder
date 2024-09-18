import Metrics from "../models/metricsModel.js";
import Recipe from "../models/recipeModel.js";
import User from "../models/userModel.js";
import {
  calculateBMR,
  calculateTDEE,
  fetchAPIRecipes,
  filterAndRankRecipes,
  getCalorieIntake,
} from "../utils/recipeLogic.js";

// get dashboard recipes
const generateDashboardRecipes = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await Metrics.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const {
      gender,
      age,
      weight,
      height,
      exerciseLevel,
      goal,
      dietaryPreferences,
    } = user;
    const BMR = calculateBMR(gender, weight, height, age);
    const TDEE = calculateTDEE(BMR, exerciseLevel);
    const calorieTarget = getCalorieIntake(goal, TDEE);

    const allRecipes = await fetchAPIRecipes(goal, dietaryPreferences);
    console.log("Fetched recipes from API:", allRecipes);
    const filteredAndRankedRecipes = filterAndRankRecipes(allRecipes);

    console.log("Filtered and ranked recipes:", filteredAndRankedRecipes);

    return res.status(200).json({
      message: "Dashboard recipes fetched successfully",
      calorieTarget: calorieTarget,
      recipes: filteredAndRankedRecipes,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching dashboard recipes" });
  }
};

export const getDashboardRecipes = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {}
};
