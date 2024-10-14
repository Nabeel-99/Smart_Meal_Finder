import mongoose, { Mongoose } from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    instructions: {
      type: [String],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: false,
    },
    dietaryPreferences: {
      type: [String],
      required: true,
    },
    videoLink: {
      type: String,
      required: false,
    },
    sourceUrl: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    prepTime: {
      type: String,
      required: false,
    },
    nutrients: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
    filteredIngredients: {
      type: [String],
      required: false,
    },
    userUsedIngredients: {
      type: [String],
      required: false,
    },
    missingIngredients: {
      type: [String],
      required: false,
    },
    missingIngredientsCount: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

const Recipe = mongoose.model("recipe", recipeSchema);

export default Recipe;
