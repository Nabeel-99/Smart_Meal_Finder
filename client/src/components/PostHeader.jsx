import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";

const PostHeader = ({ firstName, lastName, title, time, recipeId }) => {
  return (
    <div className="flex flex-col items-start border-b  border-b-[#1d1d1d] w-full pb-4 gap-4">
      <div className="flex items-center gap-4 ">
        <div className="min-w-10 max-w-10 h-10 rounded-full font-bold text-sm text-center flex items-center justify-center bg-[#B678F0]">
          N
        </div>
        <div className="text-sm font-semibold">
          {" "}
          {firstName} {lastName} {moment(time).fromNow()}
        </div>
      </div>
      <div className="md:pl-14 flex flex-col gap-4 items-start lg:flex-row lg:items-center w-full justify-between">
        <p className="text-sm  text-gray-200">{title}</p>
        <Link
          to={`/recipe-details/${recipeId}`}
          className="text-sm text-nowrap text-gray-400 hover:text-white"
        >
          View full details
        </Link>
      </div>
    </div>
  );
};

export default PostHeader;
