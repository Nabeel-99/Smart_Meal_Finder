import Metrics from "../models/metricsModel.js";
import Pantry from "../models/pantryModel.js";
import User from "../models/userModel.js";

// create metrics
export const createMetrics = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      gender,
      age,
      weight,
      height,
      exerciseLevel,
      goal,
      dietaryPreferences,
    } = req.body;
    const existingMetrics = await Metrics.findOne({ userId: userId });
    if (existingMetrics) {
      return res
        .status(404)
        .json({ message: "Metrics already exists for this user" });
    }
    const metrics = new Metrics({
      userId,
      gender,
      age,
      weight,
      height,
      exerciseLevel,
      goal,
      dietaryPreferences,
    });
    await metrics.save();
    return res.status(200).json({ message: "Metrics created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// update metrics
export const updateMetrics = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await Metrics.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const {
      gender,
      age,
      weight,
      height,
      exerciseLevel,
      goal,
      dietaryPreferences,
    } = req.body;

    const updatedData = {
      ...(gender && { gender }),
      ...(age && { age }),
      ...(weight && { weight }),
      ...(height && { height }),
      ...(exerciseLevel && { exerciseLevel }),
      ...(goal && { goal }),
      ...(dietaryPreferences && { dietaryPreferences }),
    };
    const updatedMetrics = await Metrics.findOneAndUpdate(
      { userId: userId },
      updatedData,
      { new: true }
    );
    if (!updatedMetrics) {
      return res.status(404).json({ message: "User metrics not found" });
    }
    return res.status(200).json({
      message: "Metrics Updated successfully",
      metrics: updatedMetrics,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// get user metrics
export const getUserMetrics = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const metrics = await Metrics.findOne({ userId: userId });
    if (!metrics) {
      return res.status(404).json({ message: "User has no metrics" });
    }
    return res.status(200).json({ metrics: metrics });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// create pantry
export const createPantry = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { items } = req.body;
    const existingPantry = await Pantry.findOne({ userId: userId });
    if (existingPantry) {
      return res.status(400).json({ message: "Pantry already exists" });
    }
    const newPantry = await Pantry.create({
      userId,
      items,
    });
    await newPantry.save();
    return res
      .status(200)
      .json({ message: "pantry created successfully!", newPantry });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// update pantry
export const updatePantry = async (req, res) => {
  try {
    const userId = req.userId;
    const userPantry = await Pantry.findOne({ userId: userId });
    if (!userPantry) {
      return res.status(404).json({ message: "Pantry not found" });
    }
    const { items } = req.body;
    const updatedPantry = await Pantry.findOneAndUpdate(
      { userId: userId },
      { items },
      {
        new: true,
      }
    );
    if (!updatedPantry) {
      return res.status(404).json({ message: "Pantry not found" });
    }
    return res
      .status(200)
      .json({ message: "pantry updated successfully!", updatedPantry });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// get user pantry
export const getUserPantry = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userPantry = await Pantry.findOne({ userId: userId });
    if (!userPantry) {
      return res.status(404).json({ message: "Pantry not found" });
    }
    return res
      .status(200)
      .json({ message: "pantry found successfully!", userPantry });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
