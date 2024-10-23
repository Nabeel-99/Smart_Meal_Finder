import express from "express";
import { verifyUser } from "../controllers/authController.js";
import { manageDashboardRecipes } from "../controllers/dashboardController.js";
import {
  deleteRecipe,
  generateIngredientsBasedRecipes,
  generateMetricsBasedRecipes,
  getRecipeDetails,
  getSavedRecipes,
  saveRecipe,
} from "../controllers/recipeController.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import {
  deleteComment,
  getAllPosts,
  getLikedPosts,
  getUserPosts,
  likePost,
  postComment,
  postRecipe,
  updateRecipePost,
} from "../controllers/postController.js";

const checkIfUserHasPantry = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next();
  }
  try {
    const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = verifiedToken.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// storing imgaes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.get("/dashboard-recipes", verifyUser, manageDashboardRecipes);
router.get("/get-recipe-details/:id", getRecipeDetails);
router.post(
  "/get-ingredients-recipes",
  checkIfUserHasPantry,
  generateIngredientsBasedRecipes
);
router.post("/get-metrics-recipes", generateMetricsBasedRecipes);
router.post("/save-recipe", verifyUser, saveRecipe);
router.get("/get-saved-recipes", verifyUser, getSavedRecipes);
router.delete("/delete-recipe/:id", verifyUser, deleteRecipe);

// post
router.post("/post", upload.array("images", 3), verifyUser, postRecipe);
router.patch(
  "/update/:id",
  upload.array("images", 3),
  verifyUser,
  updateRecipePost
);
router.get("/posts", verifyUser, getAllPosts);
router.post("/like", verifyUser, likePost);
router.get("/liked-posts", verifyUser, getLikedPosts);
router.post("/post-comment", verifyUser, postComment);
router.post("/delete-comment", verifyUser, deleteComment);
router.get("/user-posts", verifyUser, getUserPosts);
// router.get("/comments", verifyUser, getAllPostComments);
export default router;
