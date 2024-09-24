import React from "react";
import { Link } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import ingredients from "../assets/recipe-based.png";
import metrics from "../assets/body-metrics.jpeg";
import GridCard from "../components/GridCard";

const Home = () => {
  return (
    <div className="flex flex-col gap-2 pt-8 justify-center items-center">
      <h1 className="text-4xl md:text-6xl font-bold text-center tracking-tighter">
        Smart <span className="block">Meal Finder</span>{" "}
      </h1>
      <p className="text-center text-sm lg:text-xl text-[#A3A3A3]">
        Discover personalized recipes based on your{" "}
        <span className="block">ingredients and body metrics.</span>
      </p>
      <div className="relative pt-10  bg-gradient-to-b  from-[#08090a] to-[#02031A] w-full pb-9">
        <div className="absolute -bottom-10 h-44 w-full bg-gradient-to-t from-[#08090a]  to-[#02031A] "></div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          <GridCard
            header={"Get recipes based on Ingredients"}
            image={ingredients}
            description={
              "Easily get meal suggestions by entering your available ingredients. Our tool helps you find meals that match what you have on hand."
            }
            to={"/"}
          />
          <GridCard
            header={"Get recipes based on Body Metrics"}
            image={metrics}
            description={`Adjust your meal plans by entering your body metrics. Our tool
              will recommend meals that aligns with your health goals.`}
            to={"/"}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
