import Recipe from "../models/recipeModel.js";
import UserPost from "../models/userPostModel.js";

// post recipe
export const postRecipe = async (req, res) => {
  try {
    const { userId } = req;
    const { title, ingredients, instructions, category, videoLink, prepTime } =
      req.body;
    const images = req.files;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (images.length > 3) {
      return res.status(400).json({ message: "Maximum 3 images allowed" });
    }
    const formattedIngredients = ingredients
      .split(",")
      .map((ingredient) => ingredient.trim());
    const formattedInstructions = instructions
      .split(/\r?\n/)
      .map((instruction) => instruction.trim());
    const imagePaths = images.map((image) => image.path);
    const newRecipe = new Recipe({
      title,
      ingredients: formattedIngredients,
      instructions: formattedInstructions,
      images: imagePaths,
      category,
      videoLink,
      prepTime,
    });

    await newRecipe.save();

    const savedPost = new UserPost({
      userId,
      recipeId: newRecipe._id,
    });
    await savedPost.save();
    return res
      .status(201)
      .json({ message: "Recipe posted successfully", newRecipe });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// edit post
export const updateRecipePost = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const { title, ingredients, instructions, category, videoLink, prepTime } =
      req.body;
    const images = req.files;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const recipe = Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    const formattedIngredients = ingredients
      .split(",")
      .map((ingredient) => ingredient.trim());
    const formattedInstructions = instructions
      .split(/\r?\n/)
      .map((instruction) => instruction.trim());
    const updatedData = {
      ...(title && { title }),
      ...(ingredients && { ingredients: formattedIngredients }),
      ...(instructions && { instructions: formattedInstructions }),
      ...(category && { category }),
      ...(videoLink && { videoLink }),
      ...(prepTime && { prepTime }),
    };
    if (images && images.length > 0) {
      if (images.length > 3) {
        return res.status(400).json({ message: "Maximum 3 images allowed" });
      }
      const imagePaths = images.map((image) => image.path);
      updatedData.images = imagePaths;
    }

    const updatedPost = await Recipe.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "update was successful", updatedPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get all posts
export const getAllPosts = async (req, res) => {
  try {
    const { userId } = req;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const posts = await UserPost.find()
      .populate("recipeId")
      .populate("userId", "firstName lastName")
      .sort({ createdAt: -1 });

    const allPosts = posts.map((post) => ({
      postId: post._id,
      userId: post.userId._id,
      firstName: post.userId.firstName,
      lastName: post.userId.lastName,
      posts: post.recipeId,
      likes: post.likes,
      comments: post.comments,
    }));
    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }

    return res.status(200).json(allPosts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// like post
export const likePost = async (req, res) => {
  try {
    const { userId } = req;
    const { postId } = req.body;

    const post = await UserPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const hasLiked = post.likes.get(userId);
    if (hasLiked) {
      post.likes.delete(userId); //unlike
    } else {
      post.likes.set(userId, true); //like
    }
    await post.save();
    return res.status(200).json({ likes: post.likes });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get liked stated
