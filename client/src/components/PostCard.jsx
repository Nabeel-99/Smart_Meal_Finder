import React from "react";
import moment from "moment";
import {
  FaHeart,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

const PostCard = ({
  post,
  likeRecipe,
  isLiked,
  openModal,
  images,
  currentImageIndex,
}) => {
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

      <div className="bg-[#0c0c0c] border border-[#171717] rounded-lg">
        <img
          src={`http://localhost:8000/${images[currentImageIndex]}`}
          onDoubleClick={() => likeRecipe(post.postId)}
          className="w-full h-[450px] md:h-[550px] lg:h-[650px] rounded-md object-contain "
        />
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
          <button>
            {" "}
            <FaRegBookmark className="text-xl" />
          </button>
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
