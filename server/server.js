import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import { fetchAPIRecipes, filterAndRankRecipes } from "./utils/recipeLogic.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

connectDB();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

const testFetchRecipes = async () => {
  try {
    const goal = "weight_loss"; // Adjust as needed
    const dietaryPreferences = ["vegan"]; // Adjust as needed
    const allRecipes = await fetchAPIRecipes(goal, dietaryPreferences);

    console.log("Fetched recipes:", allRecipes);

    const filteredAndRankedRecipes = filterAndRankRecipes(allRecipes);
    console.log("Filtered and ranked recipes:", filteredAndRankedRecipes);

    // Print total number of recipes
    console.log(
      "Total number of recipes:",
      filteredAndRankedRecipes.breakfast.length +
        filteredAndRankedRecipes.lunch.length +
        filteredAndRankedRecipes.dinner.length
    );
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
};

// Run the test
testFetchRecipes();
