import mongoose from "mongoose";

const metricsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    exerciseLevel: {
      type: String,
      required: true,
    },
    goal: {
      type: String,
      required: true,
    },
    dietaryPreferences: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Metrics = mongoose.model("metrics", metricsSchema);

export default Metrics;
