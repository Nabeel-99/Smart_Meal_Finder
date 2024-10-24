import React from "react";

const PostComment = ({
  comment,
  setComment,
  postUserComment,
  selectedPost,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-end  pt-8 border-t border-t-[#1d1d1d] justify-between gap-10 ">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="bg-[#0c0c0c] w-full h-10 overflow-scroll border text-sm border-[#1d1d1d] rounded-md px-2 py-2"
      />
      <button
        onClick={() => postUserComment(selectedPost.postId)}
        className="text-blue-500 text-sm font-semibold hover:text-blue-300"
      >
        Post
      </button>
    </div>
  );
};

export default PostComment;
