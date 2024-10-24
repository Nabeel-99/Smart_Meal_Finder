import React, { useState } from "react";
import moment from "moment";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBookmark,
  FaChevronRight,
  FaHeart,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { FaChevronLeft } from "react-icons/fa";
import axios from "axios";

const PostCard = ({ post, likeRecipe, isLiked, openModal, images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = (post) => {
    if (currentImageIndex < post.posts.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  const handlePreviousImage = (post) => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const saveRecipe = async (post) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/recipes/save-recipe",
        {
          recipeDetails: post.posts,
        },
        { withCredentials: true }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const isLastImage = currentImageIndex === post.posts.images.length - 1;
  const isFirstImage = currentImageIndex === 0;
  return (
    <div className="flex pt-8 lg:px-10 flex-col w-full lg:w-[650px] gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full font-bold text-sm text-center flex items-center justify-center bg-[#B678F0]">
            {post.firstName.slice(0, 1)}
          </div>
          <div className="text-sm font-semibold">
            {" "}
            {post.firstName} {post.lastName}{" "}
            {moment(post.posts.updatedAt || post.posts.createdAt).fromNow()}
          </div>
        </div>
        <Link
          to={`/recipe-details/${post.posts._id}`}
          className="text-sm text-nowrap text-gray-400 hover:text-white"
        >
          View full details
        </Link>
      </div>

      <div className="relative bg-[#0c0c0c] border border-[#171717] rounded-lg">
        <Tooltip title="previous">
          <button
            className={`absolute flex  backdrop-blur-md hover:bg-[#484848]  p-2  rounded-full items-center justify-center top-[50%] ${
              isFirstImage ? "hidden" : ""
            }`}
            onClick={() => handlePreviousImage(post)}
            type="button"
            disabled={isFirstImage}
          >
            <FaChevronLeft />
          </button>
        </Tooltip>

        <img
          src={`http://localhost:8000/${images[currentImageIndex]}`}
          onDoubleClick={() => likeRecipe(post.postId)}
          className="w-full h-[450px] md:h-[550px] lg:h-[650px] rounded-md object-contain "
        />

        <Tooltip title="next">
          <button
            className={`absolute flex  backdrop-blur-md hover:bg-[#484848]  p-2  rounded-full right-0 items-center justify-center top-[50%] ${
              isLastImage ? "hidden" : ""
            }`}
            type="button"
            onClick={() => handleNextImage(post)}
            disabled={isLastImage}
          >
            <FaChevronRight />
          </button>
        </Tooltip>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => likeRecipe(post.postId)}>
            {" "}
            {isLiked ? (
              <FaHeart className="text-xl  text-red-500" />
            ) : (
              <FaRegHeart className="text-xl" />
            )}
          </button>
          <button>
            <FaRegComment onClick={() => openModal(post)} className="text-xl" />
          </button>
        </div>
        <div>
          <Tooltip title="save">
            <button
              onClick={() => saveRecipe(post)}
              className="relative group "
            >
              {" "}
              <FaRegBookmark className="text-xl group-hover:hidden" />
              <FaBookmark className="text-xl hidden group-hover:block " />
            </button>
          </Tooltip>
        </div>
      </div>
      <div>
        {post.likesCount > 0 && (
          <p>
            {post.likesCount}
            {post.likesCount === 1 ? " like" : " likes"}
          </p>
        )}
      </div>
      <div className="">
        <span className="font-bold pr-2">
          {" "}
          {post.firstName} {post.lastName}
        </span>
        {post.posts.title}
      </div>
      <div>
        {post.commentsCount > 0 ? (
          <button
            onClick={() => openModal(post)}
            className="text-sm text-gray-500 hover:text-white"
          >
            View {post.commentsCount === 1 ? "" : "all"} {post.commentsCount}{" "}
            {post.commentsCount === 1 ? "comment" : "comments"}
          </button>
        ) : (
          <button
            onClick={() => openModal(post)}
            className="text-sm text-gray-500 hover:text-white"
          >
            Add a comment
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
