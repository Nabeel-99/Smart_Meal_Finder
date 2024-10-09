import axios from "axios";
import { getEdamamRecipes, getSpoonacularRecipes } from "./api.js";

// common ingredients / condiments
const commonIngredients = ["salt", "pepper", "spices", "water", "oil"];

// fetch dashboard specific recipes
export const fetchDashboardRecipes = async (goal, dietaryPreferences) => {
  try {
    const calories = goal || null;
    const lunchQueries = ["side dish", "snack"];
    const dinnerQueries = ["dessert", "main course", "soup"];
    // fetching recipes
    const [spoonacularBreakfast, spoonacularLunch, spoonacularDinner] =
      await Promise.all([
        getSpoonacularRecipes(
          null,
          ["breakfast"],
          calories,
          dietaryPreferences
        ),
        getSpoonacularRecipes(null, lunchQueries, calories, dietaryPreferences),
        getSpoonacularRecipes(
          null,
          dinnerQueries,
          calories,
          dietaryPreferences
        ),
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
export const fetchAPIRecipes = async (goal, dietaryPreferences) => {
  try {
    const calories = goal || null;

    // Fetching recipes from both sources
    const [spoonacularMeals, edamamMeals] = await Promise.all([
      getSpoonacularRecipes("", [], calories, dietaryPreferences),
      getEdamamRecipes([], "breakfast", calories, dietaryPreferences),
    ]);

    // Combine all recipes with their sources and URLs
    const allRecipes = [...spoonacularMeals, ...edamamMeals];

    const shuffleRecipes = allRecipes.sort(() => Math.random() - 0.5);
    return shuffleRecipes;
  } catch (error) {
    console.log("Error fetching Recipes from APIs", error);
    throw error;
  }
};

export const filteredAndRankedRecipes = async (recipes) => {
  const meals = [];
  const existingRecipes = new Set();

  for (const recipe of recipes) {
    let calories,
      title,
      ingredients,
      instructions,
      mealType = [],
      dietaryPreferences = [],
      videoLink,
      sourceUrl,
      image;

    const isSpoonacular = recipe.spoonacularSourceUrl;
    const isEdamam = recipe.recipe?.shareAs;

    // Fetch Spoonacular Data
    if (isSpoonacular) {
      calories = recipe.nutrition?.nutrients.find(
        (nutrient) => nutrient.name === "Calories"
      )?.amount;
      nutritients = recipe.nutrition?.nutrients
        .filter((nutrient) => nutrient.amount > 0)
        .map((nutrient) => ({
          name: nutrient.name,
          amount: nutrient.amount,
          unit: nutrient.unit,
        }));
      title = recipe.title;
      ingredients = recipe.extendedIngredients
        ? recipe.extendedIngredients.map((ingredient) => ingredient.name)
        : [];
      instructions =
        recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0
          ? recipe.analyzedInstructions.flatMap((instruction) =>
              instruction.steps.map((step) => step.step)
            )
          : [];
      mealType = recipe.dishTypes;
      dietaryPreferences = [
        recipe.vegetarian ? "Vegetarian" : "",
        recipe.vegan ? "Vegan" : "",
        recipe.glutenFree ? "Gluten-Free" : "",
        recipe.dairyFree ? "Dairy-Free" : "",
      ].filter(Boolean);
      sourceUrl = recipe.spoonacularSourceUrl;
      image = recipe.image;
      videoLink = "will come back to this";
    }
    // Fetch Edamam Data
    else if (isEdamam) {
      calories = recipe.recipe.calories / recipe.recipe.yield;
      title = recipe.recipe.label;
      ingredients = recipe.recipe.ingredients
        ? recipe.recipe.ingredients.map((ingredient) => ingredient.food)
        : [];
      instructions = "no instructions for edamam";
      mealType = recipe.recipe.mealType || [];
      dietaryPreferences = recipe.recipe.healthLabels || [];
      image = recipe.recipe.image;
      sourceUrl = recipe.recipe.shareAs;
      videoLink = "will come back to this";
    }

    if (existingRecipes.has(title)) continue;
    let assigned = false;
    if (!assigned) {
      meals.push({
        title,
        ingredients,
        instructions,
        image,
        sourceUrl,
        videoLink,
        calories,
        dietaryPreferences,
      });
      assigned = true;
      existingRecipes.add(title);
    }
  }

  const limit = 18;
  // Limit results by ingredient if needed
  const bestMatchingRecipe = await getBestMatchingRecipe(meals);

  return bestMatchingRecipe;
};
// filter and rank recipes
export const categorizeRecipes = async (recipes) => {
  const categories = {
    breakfast: [],
    lunch: [],
    dinner: [],
  };
  const existingRecipes = new Set();

  for (const recipe of recipes) {
    let calories,
      title,
      ingredients,
      instructions,
      mealType = [],
      dietaryPreferences = [],
      videoLink,
      sourceUrl,
      image;

    const isSpoonacular = recipe.spoonacularSourceUrl;

    // Fetch Spoonacular Data
    if (isSpoonacular) {
      calories = recipe.nutrition?.nutrients.find(
        (nutrient) => nutrient.name === "Calories"
      )?.amount;
      nutritients = recipe.nutrition?.nutrients
        .filter((nutrient) => nutrient.amount > 0)
        .map((nutrient) => ({
          name: nutrient.name,
          amount: nutrient.amount,
          unit: nutrient.unit,
        }));
      title = recipe.title;
      ingredients = recipe.extendedIngredients
        ? recipe.extendedIngredients.map((ingredient) => ingredient.name)
        : [];
      instructions =
        recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0
          ? recipe.analyzedInstructions.flatMap((instruction) =>
              instruction.steps.map((step) => step.step)
            )
          : [];
      mealType = recipe.dishTypes;
      dietaryPreferences = [
        recipe.vegetarian ? "Vegetarian" : "",
        recipe.vegan ? "Vegan" : "",
        recipe.glutenFree ? "Gluten-Free" : "",
        recipe.dairyFree ? "Dairy-Free" : "",
      ].filter(Boolean);
      sourceUrl = recipe.spoonacularSourceUrl;
      image = recipe.image;
      videoLink = "will come back to this";
    }

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

export const fetchBasedOnIngredients = async (
  userIngredients,
  dietaryPreferences
) => {
  try {
    const recipes = await getEdamamRecipes(
      userIngredients,
      null,
      null,
      dietaryPreferences
    );
    return recipes;
  } catch (error) {
    console.log("error fetching recipes from edamam", error);
    throw error;
  }
};

export const fetchBasedOnMetrics = async (goal, dietaryPreferences) => {
  try {
    const [spoonacularRecipes, edamamRecipes] = await Promise.all([
      getSpoonacularRecipes(null, goal, dietaryPreferences),
      getEdamamRecipes([], null, goal, dietaryPreferences),
    ]);

    const allRecipes = [...spoonacularRecipes, ...edamamRecipes];
    return allRecipes;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const rankRecipes = async (recipes) => {
  const meals = [];
  for (const recipe of recipes) {
    let calories,
      title,
      ingredients,
      instructions,
      mealType = [],
      dietaryPreferences,
      videoLink,
      sourceUrl,
      image;

    const isSpoonacular = recipe.spoonacularSourceUrl;
    const isEdamam = recipe.shareAs;

    if (isSpoonacular) {
      calories = recipe.nutrition?.nutrients.find(
        (nutrient) => nutrient.name === "Calories"
      )?.amount;
      title = recipe.title;
      ingredients = recipe.extendedIngredients
        ? recipe.extendedIngredients.map((ingredient) => ingredient.name)
        : [];
      instructions =
        recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0
          ? recipe.analyzedInstructions.flatMap((instruction) =>
              instruction.steps.map((step) => step.step)
            )
          : [];
      if (instructions.length === 0) return;
      mealType = recipe.dishTypes;
      dietaryPreferences = [
        recipe.vegetarian ? "Vegetarian" : "",
        recipe.vegan ? "Vegan" : "",
        recipe.glutenFree ? "Gluten-Free" : "",
        recipe.dairyFree ? "Dairy-Free" : "",
      ].filter(Boolean);
      sourceUrl = recipe.spoonacularSourceUrl;
      image = recipe.image;
      videoLink = "will come back to this";
    } else if (isEdamam) {
      calories = recipe.calories;
      title = recipe.label;
      ingredients = recipe.ingredients
        ? recipe.ingredients.map((ingredient) => ingredient.food)
        : [];
      instructions = await generateInstructionsForEdamam(title, ingredients);
      mealType = recipe.mealType || [];
      dietaryPreferences = recipe.healthLabels;
      image = recipe.image;
      sourceUrl = recipe.shareAs;
      videoLink = "will come back to this";
    }

    meals.push({
      title,
      ingredients,
      instructions,
      mealType,
      dietaryPreferences,
      calories,
      image,
      sourceUrl,
      videoLink,
    });
  }
  const limit = 9;

  const topRecipes = {
    meals: meals.slice(0, limit),
  };

  return topRecipes;
};

export const getBestMatchingRecipe = async (recipes, userIngredients) => {
  const meals = [];
  for (const recipe of recipes) {
    let calories,
      title,
      ingredients = [],
      instructions,
      mealType = [],
      dietaryPreferences,
      videoLink,
      sourceUrl,
      image;

    const isEdamam = recipe.shareAs;
    if (isEdamam) {
      calories = recipe.calories / recipe.yield;
      title = recipe.label;
      ingredients = recipe.ingredients
        ? recipe.ingredients.map((ingredient) => ingredient.food)
        : [];
      instructions = await generateInstructionsForEdamam(title, ingredients);
      mealType = recipe.mealType || [];
      dietaryPreferences = recipe.healthLabels;
      image = recipe.image;
      sourceUrl = recipe.shareAs;
      videoLink = "will come back to this";
    }
    const filteredIngredients = ingredients.filter(
      (ingredient) => !commonIngredients.includes(ingredient)
    );
    const missingIngredients = filteredIngredients.filter(
      (ingredient) => !userIngredients.includes(ingredient)
    );
    if (missingIngredients.length <= 2) {
      meals.push({
        title,
        calories,
        ingredients,
        instructions,
        mealType,
        dietaryPreferences,
        videoLink,
        sourceUrl,
        image,
      });
    }
  }

  return meals;
};

const limitResultsByMainIngredient = (
  recipes,
  num = 12,
  maxPerIngredient = 3
) => {
  const mainIngredientMap = {};
  const getMainIngredient = (ingredients) => {
    const commonIngredients = ["rice", "chicken", "pasta", "potato"];
    for (let ingredient of ingredients) {
      for (let common of commonIngredients) {
        if (ingredient.toLowerCase().includes(common)) {
          return common;
        }
      }
    }
    return "other";
  };

  const uniqueRecipes = [];
  recipes.forEach((recipe) => {
    const mainIngredient = getMainIngredient(recipe.ingredients);
    if (!mainIngredientMap[mainIngredient]) {
      mainIngredientMap[mainIngredient] = [];
    }
    if (mainIngredientMap[mainIngredient].length < maxPerIngredient) {
      mainIngredientMap[mainIngredient].push(recipe);
      uniqueRecipes.push(recipe);
    }
  });

  return uniqueRecipes.slice(0, num);
};

// (async () => {
//   const recipes = await fetchDashboardRecipes(null, []);
//   console.log("Spoonacular recipes:", recipes);
//   const categorized = await categorizeRecipes(recipes);
//   console.log("Categorized Recipes:", categorized);
//   console.log("breakfast length:", categorized.breakfast.length);
//   console.log("lunch length:", categorized.lunch.length);
//   console.log("dinner length:", categorized.dinner.length);
// })();
