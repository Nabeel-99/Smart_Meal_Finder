import { Tooltip } from "@mui/material";
import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

const ImageCard = ({ selectedPost }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const handleNextImage = () => {
    if (currentImageIndex < selectedPost.posts.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  const isLastImage =
    currentImageIndex === selectedPost.posts.images.length - 1;
  const isFirstImage = currentImageIndex === 0;
  return (
    <div className="relative w-[15rem] lg:w-[200rem] xl:w-[230rem]  border border-[#2a2a2a] rounded-md">
      <Tooltip title="previous">
        <button
          className={`absolute flex border backdrop-blur-md hover:bg-[#484848] border-[#676767] p-2 bg-[#1d1d1d] rounded-full items-center justify-center top-[50%] ${
            isFirstImage ? "hidden" : ""
          }`}
          onClick={handlePreviousImage}
          type="button"
          disabled={isFirstImage}
        >
          <FaArrowLeft />
        </button>
      </Tooltip>
      <img
        src={`http://localhost:8000/${selectedPost.posts.images[currentImageIndex]}`}
        className="rounded-md w-full h-72 md:h-64 lg:w-full lg:h-full xl:w-full   object-contain"
      />
      <Tooltip title="next">
        <button
          className={`absolute flex border backdrop-blur-md hover:bg-[#484848] border-[#676767] p-2 bg-[#1d1d1d] rounded-full right-0 items-center justify-center top-[50%] ${
            isLastImage ? "hidden" : ""
          }`}
          type="button"
          onClick={handleNextImage}
          disabled={isLastImage}
        >
          <FaArrowRight />
        </button>
      </Tooltip>
    </div>
  );
};

export default ImageCard;
