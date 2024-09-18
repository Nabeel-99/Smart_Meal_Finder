import mongoose from "mongoose";

const recipeOfTheDaySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    selectedRecipes: [
      {
        recipe: { type: mongoose.Schema.Types.ObjectId, ref: "recipe" },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    totalCalories: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const RecipeOfTheDay = mongoose.model(
  "recipe_of_the_day",
  recipeOfTheDaySchema
);

export default RecipeOfTheDay;
