import axios from "axios";
import {
  findRecipesByIngredients,
  getEdamamRecipes,
  getSpoonacularRecipes,
  getTastyAPIRecipes,
} from "./api.js";
import defaultPantry from "./pantry.json" assert { type: "json" };
import {
  extractRecipeData,
  generateInstructionsForEdamam,
  generateMealTitlesForAPI,
} from "./helper.js";

// spooncular pantry

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

// (async () => {
//   const ingredients = ["rice", "milk", "banana", "chicken", "fries"];
//   const recipes = await fetchAPIRecipes(ingredients, null, []);
//   const topRanked = await filteredAndRankedRecipes(recipes, ingredients);

//   console.log("From the function recipe total:", recipes.length);

//   console.log(
//     "Top ranked details:",
//     topRanked.map((rank) => {
//       return {
//         title: rank.title,
//         ingredients: rank.ingredients,
//         userInput: ingredients,
//         userUsedIngredients: rank.userUsedIngredients, // Fixed naming
//         missingIngredients: rank.missingIngredients,
//         missingIngredientsCount: rank.missingIngredientsCount,
//       };
//     })
//   );

//   console.log("Top ranked", topRanked.length);
// })();
// Function to check if two ingredients share any common words

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
    } = extractRecipeData(recipe);

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
    if (missingIngredients.length <= 3) {
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
// const testurl = "https://api.spoonacular.com/recipes/findByIngredients";
// const testFetch = async (ingredients) => {
//   const response = await axios.get(`${testurl}`, {
//     params: {
//       ingredients: ingredients.join(","),
//       limitLicense: true,
//       number: 25,
//       apiKey: process.env.SPOONACULAR_API_KEY2,
//     },
//   });
//   const filteredAndRanked = await filteredAndRankedRecipes(
//     response.data,
//     ingredients,
//     []
//   );

//   console.log(filteredAndRanked.map((recipe) => recipe.title));
//   console.log(response.data.length);
//   console.log(filteredAndRanked);
//   console.log("filtered recipes length", filteredAndRanked.length);
//   return filteredAndRanked;
// };

// testFetch(["rice", "tomato paste", "fries", "bread", "nutella", "egg"]);
// filter and rank recipes
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
    } = extractRecipeData(recipe);

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
// export const rankRecipes = async (recipes) => {
//   const meals = [];
//   for (const recipe of recipes) {
//     let calories,
//       title,
//       ingredients,
//       instructions,
//       mealType = [],
//       dietaryPreferences,
//       videoLink,
//       sourceUrl,
//       image;

//     const isSpoonacular = recipe.spoonacularSourceUrl;
//     const isEdamam = recipe.shareAs;

//     if (isSpoonacular) {
//       calories = recipe.nutrition?.nutrients.find(
//         (nutrient) => nutrient.name === "Calories"
//       )?.amount;
//       title = recipe.title;
//       ingredients = recipe.extendedIngredients
//         ? recipe.extendedIngredients.map((ingredient) => ingredient.name)
//         : [];
//       instructions =
//         recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0
//           ? recipe.analyzedInstructions.flatMap((instruction) =>
//               instruction.steps.map((step) => step.step)
//             )
//           : [];
//       if (instructions.length === 0) return;
//       mealType = recipe.dishTypes;
//       dietaryPreferences = [
//         recipe.vegetarian ? "Vegetarian" : "",
//         recipe.vegan ? "Vegan" : "",
//         recipe.glutenFree ? "Gluten-Free" : "",
//         recipe.dairyFree ? "Dairy-Free" : "",
//       ].filter(Boolean);
//       sourceUrl = recipe.spoonacularSourceUrl;
//       image = recipe.image;
//       videoLink = "will come back to this";
//     } else if (isEdamam) {
//       calories = recipe.calories;
//       title = recipe.label;
//       ingredients = recipe.ingredients
//         ? recipe.ingredients.map((ingredient) => ingredient.food)
//         : [];
//       instructions = await generateInstructionsForEdamam(title, ingredients);
//       mealType = recipe.mealType || [];
//       dietaryPreferences = recipe.healthLabels;
//       image = recipe.image;
//       sourceUrl = recipe.shareAs;
//       videoLink = "will come back to this";
//     }

//     meals.push({
//       title,
//       ingredients,
//       instructions,
//       mealType,
//       dietaryPreferences,
//       calories,
//       image,
//       sourceUrl,
//       videoLink,
//     });
//   }
//   const limit = 9;

//   const topRecipes = {
//     meals: meals.slice(0, limit),
//   };

//   return topRecipes;
// };

// export const getBestMatchingRecipe = async (recipes, userIngredients) => {
//   const meals = [];
//   for (const recipe of recipes) {
//     let calories,
//       title,
//       ingredients = [],
//       instructions,
//       mealType = [],
//       dietaryPreferences,
//       videoLink,
//       sourceUrl,
//       image;

//     const isEdamam = recipe.shareAs;
//     if (isEdamam) {
//       calories = recipe.calories / recipe.yield;
//       title = recipe.label;
//       ingredients = recipe.ingredients
//         ? recipe.ingredients.map((ingredient) => ingredient.food)
//         : [];
//       instructions = await generateInstructionsForEdamam(title, ingredients);
//       mealType = recipe.mealType || [];
//       dietaryPreferences = recipe.healthLabels;
//       image = recipe.image;
//       sourceUrl = recipe.shareAs;
//       videoLink = "will come back to this";
//     }
//     const filteredIngredients = ingredients.filter(
//       (ingredient) => !commonIngredients.includes(ingredient)
//     );
//     const missingIngredients = filteredIngredients.filter(
//       (ingredient) => !userIngredients.includes(ingredient)
//     );
//     if (missingIngredients.length <= 2) {
//       meals.push({
//         title,
//         calories,
//         ingredients,
//         instructions,
//         mealType,
//         dietaryPreferences,
//         videoLink,
//         sourceUrl,
//         image,
//       });
//     }
//   }

//   return meals;
// };

// const limitResultsByMainIngredient = (
//   recipes,
//   num = 12,
//   maxPerIngredient = 3
// ) => {
//   const mainIngredientMap = {};
//   const getMainIngredient = (ingredients) => {
//     const commonIngredients = ["rice", "chicken", "pasta", "potato"];
//     for (let ingredient of ingredients) {
//       for (let common of commonIngredients) {
//         if (ingredient.toLowerCase().includes(common)) {
//           return common;
//         }
//       }
//     }
//     return "other";
//   };

//   const uniqueRecipes = [];
//   recipes.forEach((recipe) => {
//     const mainIngredient = getMainIngredient(recipe.ingredients);
//     if (!mainIngredientMap[mainIngredient]) {
//       mainIngredientMap[mainIngredient] = [];
//     }
//     if (mainIngredientMap[mainIngredient].length < maxPerIngredient) {
//       mainIngredientMap[mainIngredient].push(recipe);
//       uniqueRecipes.push(recipe);
//     }
//   });

//   return uniqueRecipes.slice(0, num);
// };

// (async () => {
//   const recipes = await fetchDashboardRecipes(null, []);
//   console.log("Spoonacular recipes:", recipes);
//   const categorized = await categorizeRecipes(recipes);
//   console.log("Categorized Recipes:", categorized);
//   console.log("breakfast length:", categorized.breakfast.length);
//   console.log("lunch length:", categorized.lunch.length);
//   console.log("dinner length:", categorized.dinner.length);
// })();
