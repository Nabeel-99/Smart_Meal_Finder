import express from "express";
import {
  createUser,
  deleteUser,
  loginUser,
  logout,
  updateUser,
} from "../controllers/userController.js";
import { verifyUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.patch("/update", verifyUser, updateUser);
router.delete("/delete", verifyUser, deleteUser);

export default router;
