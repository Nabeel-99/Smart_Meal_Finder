import axios from "axios";
import {
  findRecipesByIngredients,
  getEdamamRecipes,
  getSpoonacularRecipes,
  getTastyAPIRecipes,
} from "./api.js";
import defaultPantry from "./pantry.json" assert { type: "json" };
import {
  filterRecipeCalories,
  generateInstructionsForEdamam,
} from "./helper.js";

// fetch dashboard specific recipes
export const fetchDashboardRecipes = async (goal, dietaryPreferences) => {
  try {
    const calories = goal || null;
    const lunchQueries = ["side dish", "snack"];
    const dinnerQueries = ["dessert", "main course", "soup"];
    // fetching recipes
    const [spoonacularBreakfast, spoonacularLunch, spoonacularDinner] =
      await Promise.all([
        getSpoonacularRecipes(["breakfast"], calories, dietaryPreferences),
        getSpoonacularRecipes(lunchQueries, calories, dietaryPreferences),
        getSpoonacularRecipes(dinnerQueries, calories, dietaryPreferences),
      ]);

    const breakfastRecipes = [...spoonacularBreakfast];
    const lunchRecipes = [...spoonacularLunch];
    const dinnerRecipes = [...spoonacularDinner];

    const allRecipes = [...breakfastRecipes, ...lunchRecipes, ...dinnerRecipes];
    return allRecipes;
  } catch (error) {
    console.log("Error fetching Recipes from APIS", error);
    throw error;
  }
};

// fetch API combinaton recipes
export const fetchAPIRecipes = async (query = [], goal, dietaryPreferences) => {
  try {
    const calories = goal || null;
    const spoonacularMeals = await findRecipesByIngredients(query);

    // Fetching recipes from both sources
    const [edamamMeals, tastyMeals] = await Promise.all([
      getEdamamRecipes(query, null, calories, dietaryPreferences),
      getTastyAPIRecipes(query),
    ]);

    const allRecipes = [...spoonacularMeals, ...edamamMeals, ...tastyMeals];

    const shuffleRecipes = allRecipes.sort(() => Math.random() - 0.5);

    return shuffleRecipes;
  } catch (error) {
    console.log("Error fetching Recipes from APIs", error);
    throw error;
  }
};

export const fetchBasedOnIngredients = async (
  userIngredients,
  userGoal = null,
  dietaryPreferences = [],
  userPantry = { items: [] }
) => {
  try {
    const recipes = await fetchAPIRecipes(
      userIngredients,
      userGoal,
      dietaryPreferences
    );
    const topRanked = await filteredAndRankedRecipes(
      recipes,
      userIngredients,
      userPantry
    );
    return topRanked;
  } catch (error) {
    console.log("error fetching", error);
    throw error;
  }
};

export const fetchBasedOnMetrics = async (goal, dietaryPreferences) => {
  try {
    const calories = goal || null;
    const [spoonacularRecipes, edamamRecipes, tastyRecipes] = await Promise.all(
      [
        getSpoonacularRecipes([], calories, dietaryPreferences),
        getEdamamRecipes([], null, calories, dietaryPreferences),
        getTastyAPIRecipes([]),
      ]
    );

    const allRecipes = [
      ...spoonacularRecipes,
      ...edamamRecipes,
      ...tastyRecipes,
    ];

    const filteredRecipes = filterRecipeCalories(allRecipes, calories);

    return filteredRecipes;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const filteredAndRankedRecipes = async (
  recipes,
  userIngredients,
  userPantry
) => {
  const meals = [];
  const pantryToUse =
    userPantry && userPantry.length > 0 ? userPantry : defaultPantry.pantry;
  for (const recipe of recipes) {
    const {
      calories,
      title,
      ingredients,
      instructions,
      mealType,
      dietaryPreferences,
      videoLink,
      sourceUrl,
      image,
      prepTime,
      nutrients,
    } = recipe;

    const recipeIngredients = ingredients.map((item) => item.toLowerCase());

    const userIngredientsLowercase = userIngredients.map((ingredient) =>
      ingredient.toLowerCase()
    );
    //filter out ingredients that match partially
    const filteredIngredients = recipeIngredients.filter((ingredient) => {
      return !pantryToUse.some((pantryItem) => {
        return (
          ingredient.toLowerCase().includes(pantryItem.toLowerCase()) ||
          pantryItem.toLowerCase().includes(ingredient.toLowerCase())
        );
      });
    });

    const missingIngredients = filteredIngredients.filter((ingredient) => {
      return !userIngredientsLowercase.some(
        (userIngredient) =>
          userIngredient &&
          (ingredient.includes(userIngredient) ||
            userIngredient.includes(ingredient))
      );
    });
    const userUsedIngredients = ingredients.filter((ingredient) => {
      return userIngredientsLowercase.some(
        (userIngredient) =>
          userIngredient &&
          (ingredient.includes(userIngredient) ||
            userIngredient.includes(ingredient))
      );
    });
    let finalInstructions = instructions;

    if (missingIngredients.length <= 3) {
      if (instructions === "no instructions for edamam") {
        try {
          const generatedInstructions = await generateInstructionsForEdamam(
            title,
            ingredients
          );
          finalInstructions = generatedInstructions;
        } catch (error) {
          console.log("error generating instructions", error);
          finalInstructions = ["instructions could not be generated"];
        }
      }
      meals.push({
        title,
        calories,
        mealType,
        instructions: finalInstructions,
        dietaryPreferences,
        videoLink,
        sourceUrl,
        image,
        prepTime,
        nutrients,
        ingredients,
        userUsedIngredients,
        missingIngredients,
        filteredIngredients,
        missingIngredientsCount: missingIngredients.length,
      });
    }
  }

  return meals;
};

export const categorizeRecipes = async (recipes) => {
  const categories = {
    breakfast: [],
    lunch: [],
    dinner: [],
  };
  const existingRecipes = new Set();

  for (const recipe of recipes) {
    const {
      calories,
      title,
      ingredients,
      instructions,
      mealType,
      dietaryPreferences,
      videoLink,
      sourceUrl,
      image,
      prepTime,
      nutrients,
    } = recipe;

    if (existingRecipes.has(title)) continue;

    let assigned = false;

    if (Array.isArray(mealType)) {
      if (
        (mealType.includes("morning meal") || mealType.includes("breakfast")) &&
        !assigned
      ) {
        categories.breakfast.push({
          title,
          ingredients,
          instructions,
          image,
          category: "breakfast",
          dietaryPreferences,
          videoLink,
          calories,
          sourceUrl,
          prepTime,
          nutrients,
        });
        existingRecipes.add(title);
        assigned = true;
      }

      if (
        mealType.includes("side dish") ||
        (mealType.includes("snack") && !assigned)
      ) {
        categories.lunch.push({
          title,
          ingredients,
          instructions,
          image,
          category: "lunch",
          dietaryPreferences,
          videoLink,
          calories,
          sourceUrl,
          prepTime,
          nutrients,
        });
        existingRecipes.add(title);
        assigned = true;
      }

      if (
        mealType.includes("dessert") ||
        mealType.includes("main course") ||
        (mealType.includes("soup") && !assigned)
      ) {
        categories.dinner.push({
          title,
          ingredients,
          instructions,
          image,
          category: "dinner",
          dietaryPreferences,
          videoLink,
          calories,
          sourceUrl,
          prepTime,
          nutrients,
        });
        existingRecipes.add(title);
        assigned = true;
      }
    }
  }

  const limit = 18;
  const topRecipes = {
    breakfast: categories.breakfast.slice(0, limit),
    lunch: categories.lunch.slice(0, limit),
    dinner: categories.dinner.slice(0, limit),
  };
  return {
    breakfast: topRecipes.breakfast,
    lunch: topRecipes.lunch,
    dinner: topRecipes.dinner,
  };
};
