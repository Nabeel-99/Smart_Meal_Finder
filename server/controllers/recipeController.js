import {
  fetchBasedOnIngredients,
  fetchBasedOnMetrics,
  getBestMatchingRecipe,
  rankRecipes,
} from "../utils/recipeLogic.js";
import Recipe from "../models/recipeModel.js";
import {
  calculateBMR,
  calculateTDEE,
  getCalorieIntake,
} from "../utils/helper.js";

export const generateIngredientsBasedRecipes = async (req, res) => {
  try {
    const { ingredients, dietaryPreferences } = req.body;
    if (!ingredients) {
      return res.status(400).json({ message: "Ingredients are required" });
    }
    const recipes = await fetchBasedOnIngredients(
      ingredients,
      dietaryPreferences
    );
    // const bestMatchingRecipe = await getBestMatchingRecipe(
    //   recipes,
    //   ingredients
    // );
    return res.status(200).json({
      recipe: recipes,
      message: "recipes fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching recipes" });
  }
};

export const generateMetricsBasedRecipes = async (req, res) => {
  try {
    const {
      gender,
      age,
      height,
      weight,
      goal,
      exerciseLevel,
      dietaryPreferences,
    } = req.body;
    if (!gender || !age || !height || !weight || !goal || !exerciseLevel) {
      return res.status(400).json({ message: "fields are required" });
    }
    const BMR = calculateBMR(gender, weight, height, age);
    const TDEE = calculateTDEE(BMR, exerciseLevel);
    const calorieTarget = getCalorieIntake(goal, TDEE);

    const allRecipes = await fetchBasedOnMetrics(goal, dietaryPreferences);
    const filteredRecipes = await rankRecipes(allRecipes);

    return res.status(200).json({
      recipe: filteredRecipes,
      message: "recipes fetched successfully",
      calorieTarget: calorieTarget,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error fetching recipes" });
  }
};

export const getRecipeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const foundRecipe = await Recipe.findById(id);
    if (!foundRecipe) {
      return res.status(404).json({ message: "recipe not found" });
    }
    return res.status(200).json(foundRecipe);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
