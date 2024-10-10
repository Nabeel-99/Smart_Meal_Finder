import mongoose from "mongoose";

const pantrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  items: {
    type: [String],
    required: true,
  },
});

const Pantry = mongoose.model("pantry", pantrySchema);

export default Pantry;
