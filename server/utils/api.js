import axios from "axios";
import { extractRecipeData } from "./helper.js";

// api links
const spoonacularAPI = "https://api.spoonacular.com/recipes";
const edamamAPI = "https://api.edamam.com/api/recipes/v2?&type=public";
const tastyAPI = "https://tasty.p.rapidapi.com/recipes/list";
//     code: 402,
export const getSpoonacularRecipes = async (
  mealType = [],
  goal = null,
  dietaryPreferences = []
) => {
  if (!Array.isArray(mealType)) {
    mealType = [mealType];
  }
  const calorieRanges = {
    muscle_gain: {
      minCalories: 300,
      maxCalories: 750,
    },
    weight_loss: {
      minCalories: 200,
      maxCalories: 400,
    },
    maintenance: {
      minCalories: 200,
      maxCalories: 500,
    },
  };
  const { minCalories, maxCalories } = goal ? calorieRanges[goal] : {};
  const dietaryPref =
    dietaryPreferences.length > 0 ? dietaryPreferences[0] : null;

  try {
    const response = await axios.get(`${spoonacularAPI}/complexSearch`, {
      params: {
        number: 40,
        addRecipeInformation: true,
        addRecipeInstructions: true,
        addRecipeNutrition: true,
        fillIngredients: true,
        ...(mealType.length > 0 && { type: mealType.join(",") }),
        ...(goal && { minCalories: minCalories }),
        ...(goal && { maxCalories: maxCalories }),
        ...(dietaryPref && { diet: dietaryPref }),
        apiKey: process.env.SPOONACULAR_API_KEY1,
      },
    });

    return response.data.results.map((recipe) => extractRecipeData(recipe));
  } catch (error) {
    console.log("error fetching from spoonaclular", error);
    throw error;
  }
};

// spoonacular findByIngredietns
export const findByIngredients = async (ingredients = []) => {
  try {
    const response = await axios.get(`${spoonacularAPI}/findByIngredients`, {
      params: {
        ingredients: ingredients.join(","),
        apiKey: process.env.SPOONACULAR_API_KEY1,
        ranking: 2,
        number: 10,
      },
    });
    const recipes = response.data;
    return recipes;
  } catch (error) {
    console.log("error fetching from find by ingredeients", error);
    throw error;
  }
};

// spoonacular find by id
export const findById = async (id) => {
  try {
    const response = await axios.get(`${spoonacularAPI}/${id}/information`, {
      params: {
        apiKey: process.env.SPOONACULAR_API_KEY1,
        includeNutrition: true,
      },
    });

    const recipes = extractRecipeData(response.data);
    return recipes;
  } catch (error) {
    console.log("error fetching by id", error);
    throw error;
  }
};

// spooncaular findRecipesByIngredients
export const findRecipesByIngredients = async (ingredients = []) => {
  try {
    const ingredientRecipes = await findByIngredients(ingredients);
    const recipeIds = ingredientRecipes.map((recipe) => recipe.id);
    const recipeDetails = await Promise.all(
      recipeIds.map((id) => findById(id))
    );

    return recipeDetails;
  } catch (error) {
    console.log("Error fetching detais", error);
    throw error;
  }
};

// edamam recipes
export const getEdamamRecipes = async (
  ingredients = [],
  type = null,
  goal = null,
  dietaryPreferences = []
) => {
  try {
    const calorieRanges = {
      muscle_gain: "300-750",
      weight_loss: "200-400",
      maintenance: "200-500",
    };
    const calorieRange = goal ? calorieRanges[goal] : {};
    const query = ingredients.length > 0 ? ingredients.join(",") : "recipe";

    const healthLabel =
      dietaryPreferences.length > 0 ? dietaryPreferences[0] : undefined;
    const response = await axios.get(`${edamamAPI}`, {
      params: {
        q: query,
        app_id: process.env.EDAMAM_APP_ID1,
        app_key: process.env.EDAMAM_APP_KEY1,
        from: 0,
        to: 20,
        ...(type && { mealType: type }),
        ...(goal && { calories: calorieRange }),
        ...(healthLabel && { health: healthLabel }),
      },
    });
    return response.data.hits.map((recipe) => extractRecipeData(recipe));
  } catch (error) {
    console.log("error fetching from edamam", error);
    throw error;
  }
};

// get tastyAPI recipes
export const getTastyAPIRecipes = async (ingredients = []) => {
  const query = ingredients.length > 0 ? ingredients.join(",") : null;
  try {
    const response = await axios.get(`${tastyAPI}`, {
      params: {
        from: 0,
        size: 20,
        tags: "under_30_minutes",
        q: query,
      },
      headers: {
        "x-rapidapi-key": process.env.RAPID_APIKEY,
        "x-rapidapi-host": "tasty.p.rapidapi.com",
      },
    });

    return response.data.results.map((recipe) => extractRecipeData(recipe));
  } catch (error) {
    console.error("Error occurred", error);
    throw error;
  }
};
