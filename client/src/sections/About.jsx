import React from "react";
import metricsRecipe from "../assets/metrics-recipe.png";
import metricsRecipeMobile from "../assets/metrics-recipe-mobile.png";
import { Link } from "react-router-dom";
const About = () => {
  return (
    <div
      id="about"
      className="flex flex-col gap-9 md:gap-20  lg:px-0  pt-8 items-center justify-center"
    >
      <h1 className="text-[16px] lg:text-xl tracking-[5px] font-medium">
        ABOUT
      </h1>
      <div className="flex flex-col px-8 md:flex-row items-start gap-6 md:gap-10  lg:gap-20 xl:gap-44 ">
        <div>
          <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold">
            Smart Meal Finder:{" "}
            <span className="block">Making Meal Decisons </span>
            <span className="block">Easy and Personalized</span>
          </h2>
        </div>
        <div className="flex flex-col gap-8">
          <p>
            Smart Meal Finder is your ultimate tool for taking the stress out of
            <span className="md:block">
              {" "}
              meal planning. Whether you’re trying to figure out what to cook
            </span>
            <span className="md:block">
              with the ingredients you have at home or you want personalized
            </span>{" "}
            meal plan based on your health and fitness goals, we’ve got you
            covered.
          </p>
          <div>
            <p className="border-b pb-2  border-b-[#343333]">Our Purpose</p>
            <p className="pt-2">
              In a fast-paced world, making daily decisions about food can be a
              <span className="md:block">
                challenge. At Smart Meal Finder, our goal is to simplify this
                process
              </span>
              <span className="md:block">
                {" "}
                by offering tailored meal recommendations that save you time,
              </span>{" "}
              reduce food waste, and help you achieve your nutritional goals.
            </p>
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <img src={metricsRecipe} alt="" className="max-h-[600px] px-10" />
      </div>
      <div className="md:hidden px-8">
        <img src={metricsRecipeMobile} alt="" className="" />
      </div>
      {/* CTA */}
      <div className="flex flex-col px-8 gap-20 md:flex-row items-start md:items-center border-b border-b-[#343333] pt-20 pb-20 w-full md:justify-between md:px-16  xl:justify-around bg-gradient-to-b from-[#08090a] to-[#161616]">
        <div>
          <h2 className="text-2xl  md:text-5xl xl:text-6xl tracking-tighter">
            Plan the present. <span className="block">Cook Later.</span>
          </h2>
        </div>
        <div>
          <Link
            to={"/"}
            className="bg-[#e6e6e6] text-black rounded-md px-4 py-2"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
