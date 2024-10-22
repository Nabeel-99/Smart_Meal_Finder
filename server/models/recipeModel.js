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
    images: {
      type: [String],
      validate: [validateLimit, "Exceeds the limit of 3 images"],
    },
    category: {
      type: String,
      required: false,
    },
    dietaryPreferences: {
      type: [String],
      required: false,
    },
    videoLink: {
      type: String,
      required: false,
    },
    sourceUrl: {
      type: String,
      required: false,
    },
    calories: {
      type: Number,
      required: false,
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

function validateLimit(val) {
  return val.length <= 3;
}

const Recipe = mongoose.model("recipe", recipeSchema);

export default Recipe;
