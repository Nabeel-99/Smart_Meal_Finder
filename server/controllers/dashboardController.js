import Metrics from "../models/metricsModel.js";
import Recipe from "../models/recipeModel.js";
import UserDashboard from "../models/userDashboardModel.js";
import User from "../models/userModel.js";
import {
  calculateBMR,
  calculateTDEE,
  getCalorieIntake,
} from "../utils/helper.js";
import {
  categorizeRecipes,
  fetchDashboardRecipes,
} from "../utils/recipeLogic.js";

const prepareRecipesForInsertion = (recipes) => {
  return recipes.map((recipe) => ({
    title: recipe.title || "Untitled",
    ingredients: recipe.ingredients || [],
    instructions: recipe.instructions || [],
    image: recipe.image || "",
    category: recipe.category || "uncategorized",
    dietaryPreferences: recipe.dietaryPreferences || [],
    videoLink: recipe.videoLink || "",
    sourceUrl: recipe.sourceUrl || "",
    calories: recipe.calories || 0,
    nutrients: recipe.nutrients || [],
    prepTime: recipe.prepTime || 0,
  }));
};
// get dashboard recipes
const generateDashboardRecipes = async (req) => {
  try {
    const userId = req.userId;
    const user = await Metrics.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const {
      gender = null,
      age = null,
      weight = null,
      height = null,
      exerciseLevel = "sedentary",
      goal = null,
      dietaryPreferences = [],
    } = user;

    let BMR = null;
    let TDEE = null;
    let calorieTarget = null;

    if (gender && weight && height && age) {
      BMR = calculateBMR(gender, weight, height, age);
      TDEE = calculateTDEE(BMR, exerciseLevel);
      calorieTarget = getCalorieIntake(goal, TDEE);
    }

    const allRecipes = await fetchDashboardRecipes(goal, dietaryPreferences);
    console.log("recipes length", allRecipes.length);
    const filteredAndRankedRecipes = await categorizeRecipes(allRecipes);
    return {
      message: "Dashboard recipes fetched successfully",
      calorieTarget:
        calorieTarget || "No calorie target due to missing preferences",
      recipes: filteredAndRankedRecipes,
    };
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching dashboard recipes" });
  }
};

export const manageDashboardRecipes = async (req, res) => {
  try {
    const userId = req.userId;
    let userDashboard = await UserDashboard.findOne({
      userId: userId,
    }).populate({
      path: "generatedMeals.breakfast.recipeId generatedMeals.lunch.recipeId generatedMeals.dinner.recipeId",
      model: "recipe", //getting full recipe data with populate
    });

    if (userDashboard) {
      const existingRecipes = {
        breakfast: userDashboard.generatedMeals.breakfast.map(
          (meal) => meal.recipeId
        ),
        lunch: userDashboard.generatedMeals.lunch.map((meal) => meal.recipeId),
        dinner: userDashboard.generatedMeals.dinner.map(
          (meal) => meal.recipeId
        ),
      };

      return res.status(200).json({
        message: "Dashboard already exists.",
        recipes: existingRecipes,
        calorieTarget:
          userDashboard.calorieTarget || "No calorie target available",
      });
    }

    const { recipes: filteredAndRankedRecipes, calorieTarget } =
      await generateDashboardRecipes(req);

    const recipesToSave = prepareRecipesForInsertion([
      ...filteredAndRankedRecipes.breakfast,
      ...filteredAndRankedRecipes.lunch,
      ...filteredAndRankedRecipes.dinner,
    ]);

    const savedRecipes = await Recipe.insertMany(recipesToSave);

    const breakfastIds = savedRecipes
      .filter((recipe) => recipe.category === "breakfast")
      .map((r) => r._id);
    const lunchIds = savedRecipes
      .filter((recipe) => recipe.category === "lunch")
      .map((r) => r._id);
    const dinnerIds = savedRecipes
      .filter((recipe) => recipe.category === "dinner")
      .map((r) => r._id);

    const newMeals = {
      breakfast: breakfastIds.map((id) => ({
        recipeId: id,
        isSelected: false,
      })),
      lunch: lunchIds.map((id) => ({ recipeId: id, isSelected: false })),
      dinner: dinnerIds.map((id) => ({
        recipeId: id,
        isSelected: false,
      })),
    };

    const newUserDashboard = new UserDashboard({
      userId: userId,
      generatedMeals: newMeals,
      calorieTarget: calorieTarget || null,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await newUserDashboard.save();

    const newRecipes = {
      breakfast: newMeals.breakfast.map((meal) =>
        savedRecipes.find((r) => r._id.equals(meal.recipeId))
      ),
      lunch: newMeals.lunch.map((meal) =>
        savedRecipes.find((r) => r._id.equals(meal.recipeId))
      ),
      dinner: newMeals.dinner.map((meal) =>
        savedRecipes.find((r) => r._id.equals(meal.recipeId))
      ),
    };

    return res.status(200).json({
      message: "Dashboard prepared successfully",
      recipes: newRecipes,
      calorieTarget:
        calorieTarget || "No calorie target due to missing preferences",
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Dashboard already exists for this user." });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
