import express from "express";
import {
  requestResetPassword,
  resetPassword,
  verifyUser,
} from "../controllers/authController.js";
import User from "../models/userModel.js";
import {
  createUser,
  deleteUser,
  loginUser,
  logout,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.patch("/update", verifyUser, updateUser);
router.delete("/delete", verifyUser, deleteUser);
router.post("/request-reset-password", requestResetPassword);
router.post("/reset-password", resetPassword);
router.get("/", verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "Authenticated", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
