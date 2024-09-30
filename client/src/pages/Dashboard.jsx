import React, { useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { SiGreasyfork } from "react-icons/si";
import { CiGrid41 } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { HiBars3 } from "react-icons/hi2";
import Food1 from "../assets/food1.jpg";
import Food2 from "../assets/food2.jpg";
import Food3 from "../assets/food3.jpg";
const Dashboard = () => {
  const [preferences, setPreferences] = useState(false);
  const showPreferences = () => setPreferences(!preferences);
  const userPreferences = [
    "Age: 25",
    "Height: 175cm",
    "Weight: 78kg",
    "Exercise Level: Active",
    "Goal: Weight Loss",
    "Diet: Vegetarian",
  ];
  return (
    <div className="flex bg-[#171717]   gap-10">
      <div className="flex flex-col pt-6 justify-between  w-64 border-r border-r-[#343333] bg-[#171717] h-full fixed ">
        <div>
          <div className="flex px-3 items-center gap-2">
            <div className="w-6 h-6 rounded-full text-center flex items-center justify-center bg-[#B678F0]">
              F
            </div>
            <div>Farouk Nabeel</div>
          </div>
          <div className="flex px-3 pt-8 flex-col border-b border-b-[#343333] pb-4 text-sm gap-4">
            <div className="flex items-center gap-2">
              <CiGrid41 className="w-6" />
              <div>Dashboard</div>
            </div>
            <div className="flex items-center gap-2">
              <CiBookmark className="w-6" />
              <div>Saved Meals</div>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-6"
                title="page 16"
                aria-label="page 16"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 16 16"
              >
                <path
                  fill="#ffffff"
                  fillOpacity=".7"
                  fillRule="evenodd"
                  stroke="none"
                  d="M3 1h5.707l.147.146 4 4 .146.147V15H3zm1 1v12h8V6H8V2zm5 .707L11.293 5H9z"
                ></path>
              </svg>
              <div>My Cooking Choices</div>
            </div>
          </div>
          <div className="flex px-3 pt-8 flex-col border-b border-b-[#343333] pb-4 text-sm gap-4">
            <div className="flex items-center gap-2">
              <CiSettings className="w-6" />
              <div>Settings</div>
            </div>
            <div
              onClick={showPreferences}
              className="flex cursor-pointer items-center gap-2"
            >
              <svg
                className="w-6"
                title="folder 16"
                aria-label="folder 16"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 16 16"
              >
                <path
                  fill="#ffffff"
                  fillOpacity=".7"
                  fillRule="evenodd"
                  stroke="none"
                  d="M3 2H2v11h12V4H8V2zm4 2V3H3v1zM3 5v7h10V5z"
                ></path>
              </svg>
              <div>Preferences</div>
              <div className="pt-1">
                {preferences ? (
                  <MdOutlineKeyboardArrowUp />
                ) : (
                  <MdOutlineKeyboardArrowDown />
                )}
              </div>
            </div>
            {preferences && (
              <div className="flex px-3   pb-4 text-sm ">
                <div className="w-5"></div>
                <ul className="flex flex-col gap-2">
                  {userPreferences.map((pref, index) => (
                    <li key={index} className="">
                      {pref}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col pb-10 gap-4 text-sm px-3">
          <div className="flex items-center gap-2">
            <IoIosLogOut className="w-6" />
            <div>Log out</div>
          </div>
        </div>
      </div>
      <div className="bg-[#171717] pl-64 flex flex-col w-full">
        <div className="fixed bg-[#171717] pt-6 pb-6 border-b border-b-[#343333] w-full">
          <div className="px-10 text-sm">Dashboard</div>
        </div>
        <div className="flex flex-col h-full gap-8 pt-28 px-10">
          <div className="flex items-center gap-10">
            <div className="border border-[#343333] bg-[#2e2e2e] rounded-lg h-20 w-64 flex items-center justify-center gap-3">
              <SiGreasyfork className="text-3xl " />
              <div className="font-semibold">Get Meal By Ingredients</div>
            </div>
            <div className="border border-[#343333] bg-[#2e2e2e] rounded-lg h-20 w-64 flex items-center justify-center gap-3">
              <SiGreasyfork className="text-3xl" />
              <div className="font-semibold">Get Meal By Body Metrics</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="font-semibold">Calories Target</div>
              <div className="border border-[#343333] pl-1  w-96 h-10 flex items-center rounded-full">
                <div className="w-64 h-8   rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-green-500 flex items-center justify-center">
                  <div className="text-sm font-bold">400/2406 Calories</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full  h-full gap-4">
            <div className="text-3xl font-bold">
              Personalized Meal Suggestions for You
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="border border-[#343333] px-3 py-1 bg-[#2e2e2e] rounded-md">
                  Breakfast
                </button>
                <button className=" -[#343333] px-3 py-1  rounded-md">
                  Lunch
                </button>
                <button className=" -[#343333] px-3 py-1  rounded-md">
                  Dinner
                </button>
              </div>
              <div className="flex items-center gap-10">
                <div className="text-sm border py-2 border-[#343333] bg-[#2e2e2e] font-semibold  px-4 rounded-md">
                  Regenerate breakfast meals
                </div>
                <div className="flex items-center gap-2">
                  <CiGrid41 />
                  <HiBars3 className="text-lg" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 w-full h-full gap-10">
            <div className="">
              <div className="pb-2">
                <img
                  src={Food1}
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
            </div>
            <div className="">
              <div className="pb-2">
                <img
                  src={Food2}
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
            </div>
            <div className="">
              <div className="pb-2">
                <img
                  src={Food3}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
