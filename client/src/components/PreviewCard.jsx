import { Tooltip } from "@mui/material";
import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaTrash } from "react-icons/fa6";
import { HiOutlineSquare2Stack } from "react-icons/hi2";

const PreviewCard = ({
  imagePreviews,
  images,
  setImages,
  handleImageUpload = null,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const handleNextImage = () => {
    if (currentImageIndex < imagePreviews.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  const removeImage = (image) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((i) => i !== image);

      if (updatedImages.length === 0) {
        setCurrentImageIndex(0);
      } else if (currentImageIndex >= updatedImages.length) {
        setCurrentImageIndex(updatedImages.length - 1);
      }
      return updatedImages;
    });
  };
  const isLastImage = currentImageIndex === imagePreviews.length - 1;
  const isFirstImage = currentImageIndex === 0;

  return (
    <div className="flex h-full ">
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

      <div className="absolute flex  items-center gap-2  w-full justify-end bottom-2  right-2 ">
        <Tooltip title="delete">
          <button
            type="button"
            onClick={() => removeImage(images[currentImageIndex])}
            className="flex border hover:bg-[#484848] border-[#676767] p-2 bg-[#1d1d1d] rounded-full items-center  justify-center  "
          >
            <FaTrash />
          </button>
        </Tooltip>
        {images.length < 3 && (
          <Tooltip title="Add images">
            <label
              type="button"
              htmlFor="file-upload"
              className="flex flex-col cursor-pointer border hover:bg-[#484848] border-[#676767] p-2 bg-[#1d1d1d] rounded-full items-center  justify-center  "
            >
              <HiOutlineSquare2Stack />
            </label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="file-upload"
              multiple
              onChange={handleImageUpload}
            />
          </Tooltip>
        )}
      </div>

      <img
        src={imagePreviews[currentImageIndex]}
        alt={`uploaded image - ${currentImageIndex + 1}`}
        className=" rounded-md w-full h-[16rem] md:h-[20rem] lg:w-full lg:h-full xl:w-full  xl:h-full object-contain"
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

export default PreviewCard;
