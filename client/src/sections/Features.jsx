import React from "react";
import { FaDiceD6, FaKeyboard } from "react-icons/fa6";
import formImg from "../assets/form-lg.png";
import formImgMobile from "../assets/form-mobile.png";
import { Link } from "react-router-dom";
const Features = () => {
  return (
    <div className="pt-14 flex flex-col items-center justify-start w-full ">
      <h1 className="text-[16px] lg:text-xl tracking-[5px] font-medium">
        FEATURES
      </h1>
      <div className="flex flex-col gap-12 lg:gap-0 lg:flex-row items-start  pt-10">
        <div className="flex flex-col gap-6">
          <p className="font-bold text-2xl lg:text-4xl tracking-tight">
            Ingredient-Based
            <span className="block"> Recipe Generation</span>
          </p>
          <p className="text-[#bababa] text-sm lg:text-lg">
            Meals are generated based on{" "}
            <span className="text-[#ffffff]">provided items</span>
            <span className="block">
              {" "}
              giving you personalized recipes that utilize your{" "}
            </span>
            available ingredients.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <FaKeyboard /> Entering ingredients
            </div>
            <div className="flex items-center gap-1">
              <FaDiceD6 /> Matching Algorithm
            </div>
          </div>
        </div>
        {/* bigger screen */}
        <div className="hidden max-w-[568px] max-h-[635px] md:block relative ">
          <img src={formImg} alt="" className="lg:h-2/2 lg:ml-28 relative" />
          <div className="absolute bottom-10 left-36  gap-8">
            <p className="text-[#A3A3A3] text-sm lg:text-xl">
              The Algorithm optimizes the ingredient-{" "}
              <span className="block">
                matching, suggesting the recipes based on{" "}
              </span>{" "}
              <span className="block">provided inputs.</span>
            </p>
            <div className="pt-8">
              <Link
                to={"/"}
                className="bg-[#B678F0]  rounded-lg px-8 py-2 text-lg "
              >
                Test
              </Link>
            </div>
          </div>
        </div>
        {/* mobile screen  */}
        <div className="md:hidden max-w-[336px] max-h-[442px] relative ">
          <img src={formImgMobile} alt="" className="relative h-full" />
          <div className="absolute bottom-5 left-4  gap-8">
            <p className="text-[#A3A3A3] text-sm lg:text-xl">
              The Algorithm optimizes the ingredient-{" "}
              <span className="block">
                matching, suggesting the recipes based on{" "}
              </span>{" "}
              <span className="block">provided inputs.</span>
            </p>
            <div className="pt-4">
              <Link
                to={"/"}
                className="bg-[#B678F0]  rounded-lg px-6 py-2 text-sm "
              >
                Test
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
