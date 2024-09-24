import {
  calculateBMR,
  calculateTDEE,
  fetchBasedOnIngredients,
  fetchBasedOnMetrics,
  getBestMatchingRecipe,
  getCalorieIntake,
  rankRecipes,
} from "../utils/recipeLogic.js";

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
