import Metrics from "../models/metricsModel.js";
import Recipe from "../models/recipeModel.js";
import UserDashboard from "../models/userDashboardModel.js";
import User from "../models/userModel.js";
import {
  calculateBMR,
  calculateTDEE,
  categorizeRecipes,
  fetchDashboardRecipes,
  getCalorieIntake,
} from "../utils/recipeLogic.js";

const prepareRecipesForInsertion = (recipes) => {
  return recipes.map((recipe) => ({
    title: recipe.title,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    image: recipe.image,
    category: recipe.category,
    dietaryPreferences: recipe.dietaryPreferences,
    videoLink: recipe.videoLink || "",
    sourceUrl: recipe.sourceUrl,
    calories: recipe.calories,
  }));
};
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

    const allRecipes = await fetchDashboardRecipes(goal, dietaryPreferences);
    const filteredAndRankedRecipes = await categorizeRecipes(allRecipes);
    return {
      message: "Dashboard recipes fetched successfully",
      calorieTarget: calorieTarget,
      recipes: filteredAndRankedRecipes,
    };
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching dashboard recipes" });
  }
};

export const prepareDashboardRecipes = async (req, res) => {
  try {
    const userId = req.userId;
    const existingDashboard = await UserDashboard.findOne({ userId: userId });
    if (existingDashboard) {
      return res
        .status(404)
        .json({ message: "Dashboard meals already exists" });
    }
    const { recipes: filteredAndRankedRecipes, calorieTarget } =
      await generateDashboardRecipes(req, res);

    const recipesToSave = prepareRecipesForInsertion([
      ...filteredAndRankedRecipes.breakfast,
      ...filteredAndRankedRecipes.lunch,
      ...filteredAndRankedRecipes.dinner,
    ]);

    // Save recipes and create new dashboard
    const savedRecipes = await Recipe.insertMany(recipesToSave);

    // ids of category recipes
    const breakfastIds = savedRecipes
      .filter((recipe) => recipe.category === "breakfast")
      .map((r) => r._id);
    const lunchIds = savedRecipes
      .filter((recipe) => recipe.category === "lunch")
      .map((r) => r._id);
    const dinnerIds = savedRecipes
      .filter((recipe) => recipe.category === "dinner")
      .map((r) => r._id);

    const limitedBreakfastIds = breakfastIds.slice(0, 12);
    const limitedLunchIds = lunchIds.slice(0, 12);
    const limitedDinnerIds = dinnerIds.slice(0, 12);

    // insert the recipe Ids in the userdashboard
    const newUserDashboard = new UserDashboard({
      userId: userId,
      generatedMeals: {
        breakfast: limitedBreakfastIds.map((id) => ({
          recipeId: id,
          isSelected: false,
        })),
        lunch: limitedLunchIds.map((id) => ({
          recipeId: id,
          isSelected: false,
        })),
        dinner: limitedDinnerIds.map((id) => ({
          recipeId: id,
          isSelected: false,
        })),
      },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await newUserDashboard.save();
    return res.status(200).json({
      message: "Dashboard recipes fetched successfully",
      calorieTarget: calorieTarget,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getDashboardRecipes = async (req, res) => {
  try {
    const userId = req.userId;
    const userDashboard = await UserDashboard.findOne({
      userId: userId,
    }).populate({
      path: "generatedMeals.breakfast.recipeId generatedMeals.lunch.recipeId generatedMeals.dinner.recipeId",
      model: "recipe",
    });
    if (!userDashboard) {
      return res.status(404).json({ message: "no dashboard meals found" });
    }

    const recipes = {
      breakfast: userDashboard.generatedMeals.breakfast.map(
        (meal) => meal.recipeId
      ),
      lunch: userDashboard.generatedMeals.lunch.map((meal) => meal.recipeId),
      dinner: userDashboard.generatedMeals.dinner.map((meal) => meal.recipeId),
    };

    return res.status(200).json({
      message: "Dashboard recipes retrieved successfully",
      recipes: recipes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
