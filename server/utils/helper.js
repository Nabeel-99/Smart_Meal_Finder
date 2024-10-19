import { GoogleGenerativeAI } from "@google/generative-ai";
import Pantry from "../models/pantryModel.js";
import Metrics from "../models/metricsModel.js";

// repeated variables
export const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];
export const goalOptions = [
  { label: "Muscle gain", value: "muscle_gain" },
  { label: "Weight loss", value: "weight_loss" },
  { label: "Maintenance", value: "maintenance" },
];
export const dietPreferences = [
  { name: "Vegetarian", id: "vegetarian" },
  { name: "Vegan", id: "vegan" },
  { name: "Gluten-free", id: "gluten-free" },
  { name: "Dairy-free", id: "dairy-free" },
  { name: "Nut-free", id: "nut-free" },
];
export const exerciseOptions = [
  { label: "Sedentary", value: "sedentary" },
  { label: "Lightly Active", value: "lightly_active" },
  { label: "Moderately Active", value: "moderately_active" },
  { label: "Very Active", value: "very_active" },
  { label: "Extra Active", value: "extra_active" },
];
export const themeOptions = ["Light", "Dark", "System theme"].map((theme) => ({
  label: theme,
  value: theme.toLowerCase(),
}));

export const mapText = {
  maintenance: "Maintenance",
  weight_loss: "Weight loss",
  muscle_gain: "Muscle gain",
  moderately_active: "Moderately active",
  very_active: "Very active",
  sedentary: "Sedentary",
  lightly_active: "Lightly active",
  extra_active: "Extra active",
};

//generate instructions
export const generateInstructionsForEdamam = async (title, ingredients) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY3);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `title: ${title}
  ingredients: ${ingredients}
  generate purely instructions using only the provided ingredients and title, with numbered steps, without headers or extra commentary.
  `;
  try {
    const result = await model.generateContent(prompt);
    return [result.response.text()];
  } catch (error) {
    console.error("Error generating instructions:", error);
    return ["Instructions could not be generated."];
  }
};
export const generateInstructionsNotInEnglish = async (instructions = []) => {
  if (!Array.isArray(instructions)) {
    instructions = [instructions];
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY2);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `Are the following recipe instructions in English? Reply with "yes" if they are, or "no" if they are not: 
  ${instructions.join("\n")}`;

  try {
    const response = await model.generateContent(prompt);
    const aiResponse = response.response.text().trim();

    if (aiResponse.toLowerCase() === "yes") {
      return instructions;
    } else {
      const translationPrompt = `Translate the following set of recipe instructions to English: 
      ${instructions.join("\n")}`;
      const translationResult = await model.generateContent(translationPrompt);
      return [translationResult.response.text()];
    }
  } catch (error) {
    console.log("error generating instruction", error);
    return ["no instruction"];
  }
};

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

export const extractRecipeData = (recipe) => {
  let calories,
    id,
    title,
    ingredients = [],
    instructions = [],
    mealType = [],
    dietaryPreferences = [],
    videoLink,
    sourceUrl,
    image,
    prepTime,
    nutrients;

  const isSpoonacular = recipe.spoonacularSourceUrl || recipe.imageType;
  const isEdamam = recipe.recipe?.shareAs;
  const isTasty = recipe.video_url;

  if (isSpoonacular) {
    calories =
      recipe.nutrition.nutrients.find(
        (nutrient) => nutrient.name === "Calories"
      )?.amount || 0;
    nutrients =
      recipe.nutrition.nutrients
        .filter((nutrient) => nutrient.amount > 0)
        .map((nutrient) => ({
          name: nutrient.name,
          amount: nutrient.amount,
          unit: nutrient.unit,
        })) || [];
    prepTime = recipe.readyInMinutes || 0;
    id = recipe.id;
    title = recipe.title || "Unknown Title";
    ingredients = recipe.extendedIngredients
      ? recipe.extendedIngredients.map((ingredient) => ingredient.name)
      : [];
    instructions =
      recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0
        ? recipe.analyzedInstructions.flatMap((instruction) =>
            instruction.steps.map((step) => step.step)
          )
        : ["no instructions"];
    mealType = recipe.dishTypes || [];
    dietaryPreferences = [
      recipe.vegetarian ? "Vegetarian" : "",
      recipe.vegan ? "Vegan" : "",
      recipe.glutenFree ? "Gluten-Free" : "",
      recipe.dairyFree ? "Dairy-Free" : "",
    ].filter(Boolean);
    sourceUrl = recipe.spoonacularSourceUrl || "Unknown Source";
    image = recipe.image || "default_image_url";
    videoLink = "will come back to this";
  } else if (isEdamam) {
    if (recipe.recipe) {
      id = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      calories = recipe.recipe.calories / recipe.recipe.yield || 0;
      title = recipe.recipe.label || "Unknown Title";
      ingredients = recipe.recipe.ingredients
        ? recipe.recipe.ingredients.map((ingredient) => ingredient.food)
        : [];
      prepTime = recipe.recipe.totalTime || 0;
      instructions = ["no instructions for edamam"];
      mealType = recipe.recipe.mealType || [];
      dietaryPreferences = recipe.recipe.healthLabels || [];
      image = recipe.recipe.image || "default_image_url";
      sourceUrl = recipe.recipe.shareAs || "Unknown Source";
      videoLink = "will come back to this";
      nutrients =
        Object.values(recipe.recipe.totalNutrients)
          .filter((nutrient) => nutrient.quantity > 0)
          .map((nutrient) => ({
            name: nutrient.label,
            amount: nutrient.quantity,
            unit: nutrient.unit,
          })) || [];
    }
  } else if (isTasty) {
    const filteredNutrition = {};
    Object.entries(recipe.nutrition).forEach(([key, value]) => {
      if (key !== "calories" && key !== "updated_at" && value > 0) {
        filteredNutrition[key] = value;
      }
    });
    id = recipe.id;
    calories = recipe.nutrition.calories || 0;
    title = recipe.name || "Unknown Title";
    ingredients = recipe.sections
      ? recipe.sections[0].components.map(
          (ingredient) => ingredient.ingredient.name
        )
      : [];
    instructions = recipe.instructions
      ? recipe.instructions.map((instruction) => instruction.display_text)
      : ["no instructions"];
    videoLink = recipe.original_video_url || "No Video";
    image = recipe.thumbnail_url || "default_image_url";
    prepTime = recipe.prep_time_minutes || 0;
    nutrients = filteredNutrition;
    sourceUrl = "https://rapidapi.com/apidojo/api/tasty/";
  }

  return {
    id,
    title,
    calories,
    ingredients,
    instructions,
    mealType,
    dietaryPreferences,
    image,
    sourceUrl,
    videoLink,
    prepTime,
    nutrients,
  };
};

// filter recipe calories
export const filterRecipeCalories = (recipes = [], goal) => {
  const caloreRanges = {
    muscle_gain: { min: 300, max: 750 },
    weight_loss: { min: 200, max: 400 },
    maintenance: { min: 200, max: 500 },
  };

  if (!caloreRanges[goal]) {
    console.error(`Invalid goal: ${goal}`);
    return recipes; // Return all recipes or handle as needed
  }

  const { min, max } = caloreRanges[goal];
  return recipes.filter((recipe) => {
    return recipe.calories >= min && recipe.calories <= max;
  });
};

// fetch user pantry data
export const getUserPantryData = async (userId) => {
  try {
    if (!userId) {
      return { error: true, message: "Unauthorized" };
    }
    const userPantry = await Pantry.findOne({ userId: userId });
    if (!userPantry) {
      return { error: true, message: "Pantry not found" };
    }
    return { success: true, userPantry };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Error fetching pantry" };
  }
};

//fetch user metrics
export const getUserMetricsData = async (userId) => {
  try {
    if (!userId) {
      return { error: true, message: "User not found" };
    }
    const metrics = await Metrics.findOne({ userId: userId });
    if (!metrics) {
      return { error: true, message: "Metrics not found" };
    }
    return { success: true, metrics };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Error fetching metrics" };
  }
};
