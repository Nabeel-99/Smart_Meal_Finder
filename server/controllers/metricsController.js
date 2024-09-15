import Metrics from "../models/metricsModel.js";
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
    if (!updateMetrics) {
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
