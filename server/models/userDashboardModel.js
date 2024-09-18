import mongoose from "mongoose";

const userDashboardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    generatedMeals: {
      breakfast: [
        {
          recipeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "recipe",
          },
          isSelected: {
            type: Boolean,
            default: false,
          },
        },
      ],
      lunch: [
        {
          recipeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "recipe",
          },
          isSelected: {
            type: Boolean,
            default: false,
          },
        },
      ],
      dinner: [
        {
          recipeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "recipe",
          },
          isSelected: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
    selectedRecipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "recipe",
      },
    ],
    totalCalories: {
      type: Number,
      default: 0,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const UserDashboard = mongoose.model("user_dashboard", userDashboardSchema);

export default UserDashboard;
