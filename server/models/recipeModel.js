import mongoose from "mongoose";

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
      required: true,
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
  },
  { timestamps: true }
);

const Recipe = mongoose.model("recipe", recipeSchema);

export default Recipe;
