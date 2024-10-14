import React, { useState } from "react";
import { CiGrid41 } from "react-icons/ci";
import { HiBars3 } from "react-icons/hi2";
import { LuArrowDownWideNarrow } from "react-icons/lu";
import { SiGreasyfork } from "react-icons/si";
import SkeletonLoader from "../../components/SkeletonLoader";
import { Link } from "react-router-dom";
import MealCard from "../../components/MealCard";

const DashboardContent = ({
  showOptions,
  showGridView,
  showListView,
  viewOptions,
  gridView,
  listView,
  dashboardRecipes,
}) => {
  let breakfastMeals = dashboardRecipes.recipes?.breakfast || [];
  let lunchMeals = dashboardRecipes.recipes?.lunch || [];
  let dinnerMeals = dashboardRecipes.recipes?.dinner || [];
  let calorieTargetTotal = Number(dashboardRecipes?.calorieTarget) || 0;
  const [breakfast, setBreakfast] = useState(true);
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);

  const showBreakfast = () => {
    setBreakfast(true);
    setLunch(false);
    setDinner(false);
  };
  const showLunch = () => {
    setBreakfast(false);
    setLunch(true);
    setDinner(false);
  };
  const showDinner = () => {
    setBreakfast(false);
    setLunch(false);
    setDinner(true);
  };

  return (
    <div className="flex flex-col h-full gap-8 pt-28 px-6 lg:px-10">
      <div className="flex flex-col xl:flex-row lg:items-center gap-4 w-full lg:gap-10">
        <div className="flex flex-col gap-5  md:grid grid-cols-2 w-full items-center lg:gap-10">
          <Link
            to={"/ingredients-based"}
            className="border border-[#343333] bg-[#2e2e2e] hover:bg-[#5a4bc8] w-full rounded-lg h-20 xl:w-64 flex items-center justify-center gap-3"
          >
            <SiGreasyfork className="text-3xl " />
            <div className="font-semibold">Get Meal By Ingredients</div>
          </Link>
          <Link
            to={"/metrics-based"}
            className="border border-[#343333] bg-[#2e2e2e] hover:bg-[#d08824] w-full rounded-lg h-20 xl:w-64 flex items-center justify-center gap-3"
          >
            <SiGreasyfork className="text-3xl" />
            <div className="font-semibold">Get Meal By Body Metrics</div>
          </Link>
        </div>
        <div className="flex flex-col xl:flex-row items-center w-full gap-3">
          <div className="font-semibold">Calories Target</div>
          <div className="border border-[#343333] pl-1 w-full xl:w-96 h-10 flex items-center rounded-full">
            <div className="xl:w-64 h-8   rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-green-500 flex items-center justify-center">
              <div className="text-sm font-bold">
                400/{calorieTargetTotal.toFixed(0)} calories
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full sticky top-[60px] lg:top-[69px] z-10 bg-[#171717] pb-3 lg:pb-5  h-full gap-4">
        <div className="text-xl lg:text-3xl font-bold pt-6 lg:pt-8">
          Personalized Meal Suggestions for You
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center  lg:justify-between">
          <div className="flex items-center justify-between   lg:justify-normal gap-4">
            <div className="relative">
              <button
                onClick={showBreakfast}
                className={` px-3 py-1  rounded-md ${
                  breakfast ? "border border-[#343333] bg-[#2e2e2e]" : ""
                }`}
              >
                Breakfast
              </button>
              <button
                onClick={showLunch}
                className={` px-3 py-1  rounded-md ${
                  lunch ? "border border-[#343333] bg-[#2e2e2e]" : ""
                }`}
              >
                Lunch
              </button>
              <button
                onClick={showDinner}
                className={` px-3 py-1  rounded-md ${
                  dinner ? "border border-[#343333] bg-[#2e2e2e]" : ""
                }`}
              >
                Dinner
              </button>
            </div>
            <div className="lg:hidden flex items-center  gap-2">
              <button onClick={showOptions}>
                <LuArrowDownWideNarrow />
              </button>
              {viewOptions && (
                <div className="absolute right-0 top-28 p-4 bg-[#08090a] px-6 border border-[#343333] flex flex-col gap-4 rounded-md">
                  <button
                    onClick={showGridView}
                    className="flex items-center text-sm gap-4"
                  >
                    <CiGrid41 />
                    Grid view
                  </button>
                  <button
                    onClick={showListView}
                    className="flex items-center text-sm gap-4"
                  >
                    <HiBars3 className="text-" />
                    List View
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-10">
            <div className="text-sm border py-2 border-[#343333] bg-[#2e2e2e] font-semibold  px-4 rounded-md">
              Regenerate breakfast meals
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <button onClick={showGridView}>
                <CiGrid41 />
              </button>
              <button onClick={showListView}>
                {" "}
                <HiBars3 className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-col-1  md:grid-cols-2 xl:grid-cols-3  w-full h-full gap-10">
        {breakfast &&
          breakfastMeals.length > 0 &&
          breakfastMeals.map((meal, index) => (
            <MealCard key={index} meal={meal} />
          ))}
        {lunch &&
          lunchMeals.length > 0 &&
          lunchMeals.map((meal, index) => <MealCard key={index} meal={meal} />)}
        {dinner &&
          dinnerMeals.length > 0 &&
          dinnerMeals.map((meal, index) => (
            <MealCard key={index} meal={meal} />
          ))}
        {/* <div className="">
          <div className="pb-2">
            <img
              src={""}
              alt=""
              className="w-full h-[250px] object-cover rounded-xl"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>Chicken Sandwich</div>
              <input type="checkbox" />
            </div>
            <div>600 calories</div>
          </div>
        </div> */}
      </div>
      {/* <SkeletonLoader
        count={12}
        className="w-full"
        isGridView={gridView}
        isListView={listView}
      /> */}
    </div>
  );
};

export default DashboardContent;
