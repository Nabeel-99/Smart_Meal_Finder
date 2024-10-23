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
      .populate({
        path: "comments.userId",
        select: "firstName lastName",
      })
      .sort({ createdAt: -1 });

    const allPosts = posts.map((post) => ({
      postId: post._id,
      userId: post.userId._id,
      firstName: post.userId.firstName,
      lastName: post.userId.lastName,
      posts: post.recipeId,
      likes: post.likes,
      likesCount: post.likes.size,
      comments: post.comments,
      commentsCount: post.comments.length,
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
    return res
      .status(200)
      .json({ likes: post.likes, likesCount: post.likes.size });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get liked stated
export const getLikedPosts = async (req, res) => {
  try {
    const { userId } = req;
    const likedPosts = await UserPost.find({ [`likes.${userId}`]: true })
      .select("_id") //[post id]
      .lean();

    const likedPostIds = likedPosts.map((post) => post._id.toString());

    return res.status(200).json({ likedPostIds });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// comment on post
export const postComment = async (req, res) => {
  try {
    const { userId } = req;
    const { postId, comment } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!postId) {
      return res.status(400).json({ message: "Post id is required" });
    }

    const post = await UserPost.findById(postId);
    if (post) {
      post.comments.push({ userId, text: comment });
    }
    await post.save();

    return res.status(200).json({ message: "comment posted", comment: post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// delete comment
export const deleteComment = async (req, res) => {
  try {
    const { userId } = req;
    const { postId, commentId } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const post = await UserPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }
    post.comments.pull(commentId);
    await post.save();

    return res.status(200).json({ message: "comment deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get user posts
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const posts = await UserPost.find({ userId: userId }).populate("recipeId");
    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }
    let totalLikes = 0;

    const userPosts = posts.map((post) => {
      const likes = post.likes.size;
      totalLikes += likes;
      return {
        postId: post._id,
        userId: post.userId._id,
        posts: post.recipeId,
        likes: post.likes,
        likesCount: post.likes.size,
        comments: post.comments,
        commentsCount: post.comments.length,
      };
    });
    return res.status(200).json({
      userPosts,
      totalLikes: totalLikes,
    });
  } catch (error) {
    console.log(error);
  }
};
