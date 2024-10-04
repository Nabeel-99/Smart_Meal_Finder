import User from "../models/userModel.js";
import { validateResetPassword } from "../utils/validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { sendEmail } from "../config/notifications.js";
import { fileURLToPath } from "url";

//file helper
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// verify user
export const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Access denied. Unauthorized" });
    }
    const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = verifiedToken.userId;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// request reset password
export const requestResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const templatePath = path.join(
      __dirname,
      "../emailTemplates/password-reset.html"
    );

    let htmlContent;
    try {
      htmlContent = fs.readFileSync(templatePath, "utf-8");
    } catch (err) {
      console.error("Error reading template file:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    htmlContent = htmlContent
      .replace("{{firstName}}", user.firstName)
      .replace("{{resetLink}}", resetLink)
      .replace("{{APP_NAME}}", process.env.APP_NAME);

    await sendEmail(user.email, "Password Reset", htmlContent);
    return res.status(200).json({ message: "Password reset link sent" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// resetPassword
export const resetPassword = async (req, res) => {
  try {
    const { token, new_password, confirm_password } = req.body;
    const { error } = validateResetPassword(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    // comparing passwords
    if (new_password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    // verifying token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(new_password, salt);
    user.password = hashPassword;

    await user.save();
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
