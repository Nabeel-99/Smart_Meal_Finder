import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
// api links
const spoonacularAPI = "https://api.spoonacular.com/recipes/complexSearch";
const edamamAPI = "https://api.edamam.com/api/recipes/v2?&type=public";
// common ingredients / condiments
const commonIngredients = ["salt", "pepper", "spices", "water", "oil"];

// BMR Mifflin formulas
export const calculateBMR = (gender, weight, height, age) => {
  let BMR;
  if (gender === "male") {
    BMR = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    BMR = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  return BMR;
};

// TDEE(Total Daily Energy Expenditure)
export const calculateTDEE = (BMR, exerciseLevel) => {
  const activityFactor = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };
  return BMR * activityFactor[exerciseLevel];
};

// total calorie recommendation for user
export const getCalorieIntake = (goal, tdee) => {
  switch (goal) {
    case "maintenance":
      return tdee;
    case "muscle_gain":
      return tdee + 500;
    case "weight_loss":
      return tdee - 500;
    default:
      throw new Error("Invalid goal");
  }
};

// spoonacular recipes
const getSpoonacularRecipes = async (
  mealType = [],
  goal = null,
  dietaryPreferences = []
) => {
  if (!Array.isArray(mealType)) {
    mealType = [mealType];
  }
  const calorieRanges = {
    muscle_gain: {
      minCalories: 200,
      maxCalories: 750,
    },
    weight_loss: {
      minCalories: 200,
      maxCalories: 500,
    },
    maintenance: {
      minCalories: 200,
      maxCalories: 600,
    },
  };
  const { minCalories, maxCalories } = goal ? calorieRanges[goal] : {};
  const dietaryPref =
    dietaryPreferences.length > 0 ? dietaryPreferences[0] : null;

  try {
    const response = await axios.get(`${spoonacularAPI}`, {
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
        apiKey: process.env.SPOONACULAR_API_KEY2,
      },
    });

    return response.data.results;
  } catch (error) {
    console.log("error fetching from spoonaclular", error);
    throw error;
  }
};
// edamam recipes
const getEdamamRecipes = async (
  ingredients = [],
  type = null,
  goal = null,
  dietaryPreferences = []
) => {
  try {
    const calorieRanges = {
      muscle_gain: "200-750",
      weight_loss: "200-500",
      maintenance: "200-600",
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
    return response.data.hits;
  } catch (error) {
    console.log("error fetching from edamam", error);
    throw error;
  }
};

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
export const fetchAPIRecipes = async (goal, dietaryPreferences) => {
  try {
    const calories = goal || null;

    // Fetching recipes from both sources
    const [
      spoonacularBreakfast,
      edamamBreakfast,
      spoonacularLunch,
      edamamLunch,
      spoonacularDinner,
      edamamDinner,
    ] = await Promise.all([
      getSpoonacularRecipes("breakfast", calories, dietaryPreferences),
      getEdamamRecipes([], "breakfast", calories, dietaryPreferences),
      getSpoonacularRecipes("lunch", calories, dietaryPreferences),
      getEdamamRecipes([], "lunch", calories, dietaryPreferences),
      getSpoonacularRecipes("dinner", calories, dietaryPreferences),
      getEdamamRecipes([], "dinner", calories, dietaryPreferences),
    ]);

    // Log the lengths and actual recipes for breakfast
    console.log("Breakfast Recipes Lengths:");
    console.log("Spoonacular Breakfast Length:", spoonacularBreakfast.length);
    console.log("Edamam Breakfast Length:", edamamBreakfast.length);

    // Repeat for lunch
    console.log("\nLunch Recipes Lengths:");
    console.log("Spoonacular Lunch Length:", spoonacularLunch.length);
    console.log("Edamam Lunch Length:", edamamLunch.length);

    // Repeat for dinner
    console.log("\nDinner Recipes Lengths:");
    console.log("Spoonacular Dinner Length:", spoonacularDinner.length);
    console.log("Edamam Dinner Length:", edamamDinner.length);

    // Combine all recipes with their sources and URLs
    const allRecipes = [
      ...spoonacularBreakfast,
      ...edamamBreakfast,
      ...spoonacularLunch,
      ...edamamLunch,
      ...spoonacularDinner,
      ...edamamDinner,
    ];

    const shuffleRecipes = allRecipes.sort(() => Math.random() - 0.5);
    return shuffleRecipes;
  } catch (error) {
    console.log("Error fetching Recipes from APIs", error);
    throw error;
  }
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

// async function fetchRecipes() {
//   try {
//     const response = await getEdamamRecipes(); // Your function to call Edamam API
//     const recipes = response.map((hit) => {
//       return {
//         source: "edamam",
//         url: hit.recipe.shareAs || "URL not available", // Safe access with fallback
//       };
//     });
//     console.log(recipes);
//   } catch (error) {
//     console.error("Error fetching recipes: ", error);
//   }
// }
// fetchRecipes(); // Call the function to fetch recipes
const generateInstructionsForEdamam = async (title, ingredients) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `title: ${title}
  ingredients: ${ingredients}
  generate purely instructions using only the provided ingredients and title, with numbered steps, without headers or extra commentary.
  `;
  try {
    const result = await model.generateContent(prompt);
    console.log("result", result.response.text());
    return [result.response.text()];
  } catch (error) {
    console.error("Error generating instructions:", error);
    return ["Instructions could not be generated."];
  }
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
    const isEdamam = recipe.recipe?.shareAs;

    // Fetch Spoonacular Data
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

      // if (mealType.includes("lunch/dinner") && !assigned) {
      //   categories.lunch.push({
      //     title,
      //     ingredients,
      //     instructions,
      //     image,
      //     category: "lunch",
      //     dietaryPreferences,
      //     videoLink,
      //     calories,
      //     sourceUrl,
      //   });
      //   existingRecipes.add(title);
      //   assigned = true;

      //   if (!categories.dinner.find((r) => r.title === title)) {
      //     categories.dinner.push({
      //       title,
      //       ingredients,
      //       instructions,
      //       image,
      //       category: "dinner",
      //       dietaryPreferences,
      //       videoLink,
      //       calories,
      //       sourceUrl,
      //     });
      //     existingRecipes.add(title);
      //   }
      // }
    }
  }

  const limit = 18;
  // Limit results by ingredient if needed
  const topRecipes = {
    breakfast: categories.breakfast.slice(0, limit),
    lunch: categories.lunch.slice(0, limit),
    dinner: categories.dinner.slice(0, limit),
  };

  // for (const mealType of Object.keys(topRecipes)) {
  //   for (const recipe of topRecipes[mealType]) {
  //     if (recipe.instructions === "no instructions for edamam") {
  //       const generateInstructions = await generateInstructionsForEdamam(
  //         recipe.title,
  //         recipe.ingredients
  //       );
  //       recipe.instructions = generateInstructions;
  //     }
  //   }
  // }
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

// const testFunc = async () => {
//   try {
//     const testInput = {
//       goal: "weight_loss", // Example user ingredients
//       dietaryPreferences: ["vegan"], // Example dietary preference (optional)
//     };

//     const recipes = await fetchBasedOnMetrics(
//       testInput.goal,
//       testInput.dietaryPreferences
//     );
//     const top9 = await rankRecipes(recipes);
//     console.log("recipes", top9);
//   } catch (error) {
//     console.error("Error:", error);
//     throw error;
//   }
// };

// testFunc();

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
