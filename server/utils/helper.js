import { GoogleGenerativeAI } from "@google/generative-ai";

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

export const generateInstructionsForEdamam = async (title, ingredients) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
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

export const generateMealTitlesForAPI = async (ingredients = []) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY2);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const prompt = `Using the ingredients: ${ingredients.join(
    ","
  )}, generate a list of 20 simple meal titles. Only include the titles—no introductory phrases, explanations, or extra text. Each title should be a simple, recognizable dish with a maximum of 4 words.`;
  try {
    const result = await model.generateContent(prompt);
    const titles = result.response.text();
    const filteredTitles = titles
      .replace(/^\d+\.\s*/gm, "")
      .split("\n")
      .map((title) => title.trim())
      .filter(Boolean);
    return filteredTitles;
  } catch (error) {
    console.log("error generating titles", error);
    return ["no titles"];
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
