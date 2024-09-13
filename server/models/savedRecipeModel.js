import mongoose from "mongoose";

const savedRecipe = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "recipe",
      required: true,
    },
  },
  { timestamps: true }
);

const SavedRecipe = mongoose.model("saved_recipe", savedRecipe);

export default SavedRecipe;
