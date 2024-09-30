import React, { useEffect } from "react";
import { FaDiceD6, FaKeyboard } from "react-icons/fa6";
import formImg from "../assets/form-lg.png";
import formImgMobile from "../assets/form-mobile.png";
import bgAlgorithm from "../assets/algorithm-bg.png";
import bgAlgorithmMobile from "../assets/algorithm-bg-mobile.png";
import formMetrics from "../assets/form-metrics.png";
import formMetricsMobile from "../assets/form-metrics-mobile.png";
import personLG from "../assets/person-lg.png";
import personMobile from "../assets/person-small.png";
import { Link, useLocation } from "react-router-dom";
const Features = () => {
  return (
    <div
      id="features"
      className="pt-14 flex flex-col items-center justify-start w-full pb-20 "
    >
      <h1 className="text-[16px] lg:text-xl tracking-[5px] font-medium">
        FEATURES
      </h1>
      <div className="flex flex-col gap-12 lg:gap-0 lg:flex-row items-start px-8 lg:px-0  pt-10">
        <div className="flex flex-col gap-6">
          <p className="font-bold text-2xl lg:text-4xl tracking-tight">
            Ingredient-Based
            <span className="block"> Recipe Generation</span>
          </p>
          <p className="text-[#bababa] text-sm md:text-lg">
            Meals are generated based on{" "}
            <span className="text-[#ffffff]">provided items</span>
            <span className="md:block">
              {" "}
              giving you personalized recipes that utilize your{" "}
            </span>
            available ingredients.
          </p>
          <div className="flex items-center gap-6 text-xs lg:text-sm">
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
                to={"/ingredients-based"}
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
                to={"/ingredients-based"}
                className="bg-[#B678F0]  rounded-lg px-6 py-2 text-sm "
              >
                Test
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* bigger screen */}
      <div className="hidden md:flex relative  items-start  gap-10 pt-44 px-10 xl:px-64 pb-44">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Multiple Recipe Suggestions</h1>
          <p className="text-lg">
            To minimize decision fatigue, 3-5 recipes are{" "}
            <span className="lg:block">
              generated with option to view more, making it easy to choose your
              preferred meal.
            </span>{" "}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Ingredient Substitutions</h1>
          <p className="text-lg">
            In the absence of certain ingredients,{" "}
            <span className="lg:block">
              {" "}
              suitable alternatives are suggested to accommodate meal
              preparation.
            </span>{" "}
          </p>
        </div>
        <div className="absolute  top-56 lg:top-36 -z-10">
          <img src={bgAlgorithm} alt="" />
        </div>
      </div>
      {/* mobile screen */}
      <div className="md:hidden flex flex-col gap-44 pt-20 px-8 relative">
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-bold">Multiple Recipe Suggestions</h1>
          <p className="text-sm">
            To minimize decision fatigue, 3-5 recipes are{" "}
            <span className="block">
              generated with option to view more, making it easy to choose your
              preferred meal.
            </span>{" "}
          </p>
        </div>
        <div className="absolute top-52  -z-10">
          <img src={bgAlgorithmMobile} alt="" />
        </div>
        <div className="flex flex-col gap-4 ">
          <h1 className="text-xl font-bold">Ingredient Substitutions</h1>
          <p className="text-sm">
            In the absence of certain ingredients,{" "}
            <span className="block">
              {" "}
              suitable alternatives are suggested to accommodate meal
              preparation.
            </span>{" "}
          </p>
        </div>
      </div>

      {/* metrics bigger screen */}
      <div className="hidden md:flex flex-col items-center gap-10 px-20 pt-64">
        <div className="flex items-center gap-20">
          <h1 className="text-2xl xl:text-[40px] leading-[2.5rem] font-bold">
            Body Metrics-Based{" "}
            <span className="block">Meal Recommendations</span>{" "}
          </h1>
          <p className="text-[#bababa] ">
            Using body metrics such as age, weight, height,{" "}
            <span className="block">
              {" "}
              and activity level., Meal plans are generated to
            </span>{" "}
            align with health and nutritional goals.
          </p>
        </div>
        <div className="relative">
          <img
            src={formMetrics}
            alt=""
            className="max-h-[700px] max-w-[900px] px-20 xl:px-0"
          />
          <div className="absolute bottom-10 left-28 xl:left-8  gap-8">
            <p className="text-[#A3A3A3] text-sm lg:text-xl">
              The Algorithm creates personalized daily meals,{" "}
              <span className="block">
                supporting goals like weight loss, muscle gains, or overall
              </span>{" "}
              health objectives.
            </p>
            <div className="pt-8">
              <Link
                to={"/metrics-based"}
                className="bg-[#B678F0]  rounded-lg px-8 py-2 text-lg "
              >
                Test
              </Link>
            </div>
          </div>
          <div className="absolute top-10 right-32 xl:right-10">
            <img src={personLG} alt="hey" className="h-[400px] xl:h-[600px]" />
          </div>
        </div>
      </div>
      {/* metrics mobile screen */}
      <div className="md:hidden flex flex-col items-center gap-10 pt-64">
        <div className="flex flex-col items-start justify-center pt-24 px-8 gap-6">
          <h1 className="text-xl font-bold">
            Body Metrics-Based{" "}
            <span className="block">Meal Recommendations</span>{" "}
          </h1>
          <p className="text-[#bababa] ">
            Using body metrics such as age, weight, height,{" "}
            <span className="">
              {" "}
              and activity level., Meal plans are generated to
            </span>{" "}
            align with health and nutritional goals.
          </p>
        </div>
        <div className="relative">
          <img
            src={formMetricsMobile}
            alt=""
            className="max-h-[700px] max-w-[353px] px-2"
          />
          <div className="absolute bottom-10 left-4  gap-8">
            <p className="text-[#A3A3A3] text-sm lg:text-xl">
              The Algorithm creates personalized daily meals,{" "}
              <span className="block">
                supporting goals like weight loss, muscle gains,{" "}
              </span>{" "}
              or overall health objectives.
            </p>
            <div className="pt-8">
              <Link
                to={"/metrics-based"}
                className="bg-[#B678F0]  rounded-lg px-8 py-2 text-lg "
              >
                Test
              </Link>
            </div>
          </div>
          <div className="absolute top-10 right-10">
            <img src={personLG} alt="" className="h-52" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
