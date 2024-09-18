import axios from "axios";
// api links
const spoonacularAPI = "https://api.spoonacular.com/recipes/complexSearch";
const edamamAPI = "https://api.edamam.com/api/recipes/v2?q=recipe&type=public";
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

// spoonacular
const getSpoonacularRecipes = async (
  category,
  goal,
  dietaryPreferences = {}
) => {
  const calorieRanges = {
    muscle_gain: {
      minCalories: 500,
      maxCalories: 700,
    },
    weight_loss: {
      minCalories: 300,
      maxCalories: 500,
    },
    maintenance: {
      minCalories: 500,
      maxCalories: 600,
    },
  };
  const { minCalories, maxCalories } = calorieRanges[goal];
  const dietaryParams = {
    vegan: dietaryPreferences === "vegan" || false,
    vegetarian: dietaryPreferences === "vegetarian" || false,
    glutenFree: dietaryPreferences === "gluten_free" || false,
    dairyFree: dietaryPreferences === "dairy_free" || false,
  };
  try {
    const response = await axios.get(`${spoonacularAPI}`, {
      params: {
        number: 15,
        addRecipeInformation: true,
        fillIngredients: true,
        type: category,
        minCalories: minCalories,
        maxCalories: maxCalories,
        ...Object.fromEntries(
          Object.entries(dietaryParams)
            .filter(([key, value]) => value)
            .map(([key, value]) => [key, "true"])
        ),
        apiKey: process.env.SPOONACULAR_KEY_RECIPE_QUERY,
      },
    });

    return response.data.results;
  } catch (error) {
    console.log("error fetching from spoonaclular", error);
    throw error;
  }
};
// edamama
const getEdamamRecipes = async (category, goal, dietaryPreferences = []) => {
  try {
    const calorieRanges = {
      muscle_gain: "500-700",
      weight_loss: "300-500",
      maintenance: "500-600",
    };
    const calorieRange = calorieRanges[goal];
    const healthLabel =
      dietaryPreferences.length > 0 ? dietaryPreferences[0] : undefined;
    const response = await axios.get(`${edamamAPI}`, {
      params: {
        app_id: process.env.EDAMAM_APP_ID_QUERY,
        app_key: process.env.EDAMAM_APP_KEY_RECIPE_ID,
        from: 0,
        to: 15,
        type: category,
        calories: calorieRange,
        ...(healthLabel && { health: healthLabel }),
      },
    });
    return response.data.hits;
  } catch (error) {
    console.log("error fetching from edamam", error);
    throw error;
  }
};

export const fetchAPIRecipes = async (goal, dietaryPreferences) => {
  try {
    // fetching recipes
    const [
      spoonacularBreakfast,
      edamamBreakfast,
      spoonacularLunch,
      edamamLunch,
      spoonacularDinner,
      edamamDinner,
    ] = await Promise.all([
      getSpoonacularRecipes("breakfast", goal, dietaryPreferences),
      getEdamamRecipes("breakfast", goal, dietaryPreferences),
      getSpoonacularRecipes("lunch", goal, dietaryPreferences),
      getEdamamRecipes("lunch", goal, dietaryPreferences),
      getSpoonacularRecipes("dinner", goal, dietaryPreferences),
      getEdamamRecipes("dinner", goal, dietaryPreferences),
    ]);

    const breakfastRecipes = [...spoonacularBreakfast, ...edamamBreakfast];
    const lunchRecipes = [...spoonacularLunch, ...edamamLunch];
    const dinnerRecipes = [...spoonacularDinner, ...edamamDinner];

    const allRecipes = [...breakfastRecipes, ...lunchRecipes, ...dinnerRecipes];
    return allRecipes;
  } catch (error) {
    console.log("Error fetching Recipes from APIS", error);
    throw error;
  }
};

// filter and rank recipes
export const filterAndRankRecipes = (recipes) => {
  const categories = {
    breakfast: [],
    lunch: [],
    dinner: [],
  };

  recipes.forEach((recipe) => {
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
      instructions = recipe.analyzedInstructions
        ? recipe.analyzedInstructions.flatMap((instruction) =>
            instruction.steps.map((step) => step.step)
          )
        : [];
      mealType = recipe.dishTypes || [];
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
      instructions = ["no instructions for edamam"];
      mealType = recipe.mealType || [];
      dietaryPreferences = recipe.healthLabels;
      image = recipe.image;
      sourceUrl = recipe.shareAs;
      videoLink = "will come back to this";
    }

    // Handle category assignment based on mealType
    let category = [];
    if (Array.isArray(mealType)) {
      if (mealType.includes("breakfast")) {
        category.push("breakfast");
      }
      if (mealType.includes("lunch") || mealType.includes("lunch/dinner")) {
        category.push("lunch");
      }
      if (mealType.includes("dinner") || mealType.includes("lunch/dinner")) {
        category.push("dinner");
      }
    }

    // Push recipe to each relevant category
    category.forEach((cat) => {
      categories[cat].push({
        title,
        ingredients,
        instructions,
        image,
        category: cat,
        dietaryPreferences,
        videoLink,
        calories,
        sourceUrl,
      });
    });
  });

  const limit = 12;

  // Limit results by ingredient if needed
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
