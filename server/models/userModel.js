import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bodyMetrics: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "metrics",
      required: false,
    },
    userPantry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pantry",
      required: false,
    },
    isNewUser: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export default User;
