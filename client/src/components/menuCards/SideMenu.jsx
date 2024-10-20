import React from "react";
import { CiBookmark, CiGrid41, CiSettings } from "react-icons/ci";
import { IoIosAddCircleOutline, IoIosLogOut } from "react-icons/io";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { mapText } from "../../../../server/utils/helper";
import { TbFridge } from "react-icons/tb";
import DialogComponent from "../DialogComponent";
import { GoHomeFill } from "react-icons/go";
import { BsBrightnessHigh } from "react-icons/bs";
import { FaMoon } from "react-icons/fa6";
import { LuMoonStar } from "react-icons/lu";

const SideMenu = ({
  showPreferences,
  preferences,
  userData,
  userMetrics,
  openDialog,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      <div className="hidden lg:flex flex-col pt-6 justify-between z-30  w-64 border-r border-r-[#1d1d1d] bg-[#0c0c0c] h-full fixed ">
        <div className="flex flex-col w-full gap-8">
          <div className="flex px-5 font-semibold items-center w-full gap-2">
            <div className="w-6 h-6 rounded-full text-center flex items-center justify-center bg-[#B678F0]">
              {userData.firstName.slice(0, 1)}
            </div>
            <div>
              {userData.firstName} {userData.lastName}
            </div>
          </div>
          <div className="flex px-3 pt-8 flex-col  pb-4 text-base font-bold gap-4">
            <button
              onClick={() => {
                navigate("/dashboard");
              }}
              className={`flex items-center border py-3 rounded-md border-none hover:bg-[#181818] transition-all duration-300  px-2 gap-2 ${
                location.pathname === "/" ? "bg-[#181818]" : ""
              }`}
            >
              <GoHomeFill className="w-6 text-2xl " />
              Home
            </button>
            <button
              onClick={() => {
                navigate("/dashboard");
              }}
              className={`flex items-center border py-3 rounded-md border-none hover:bg-[#181818] transition-all duration-300  px-2 gap-2 ${
                location.pathname === "/" ? "bg-[#181818]" : ""
              }`}
            >
              <IoIosAddCircleOutline className="w-6 text-2xl" />
              Create Post
            </button>

            <button
              onClick={() => {
                navigate("/dashboard");
              }}
              className={`flex items-center border py-3 rounded-md border-none hover:bg-[#181818] transition-all duration-300  px-2 gap-2 ${
                location.pathname === "/dashboard" ? "bg-[#181818]" : ""
              }`}
            >
              <CiGrid41 className="w-6 text-2xl " />
              Dashboard
            </button>

            <button
              onClick={() => {
                navigate("/dashboard/saved-meals");
              }}
              className={`flex items-center border py-3 rounded-md border-none hover:bg-[#181818] transition-all duration-300  px-2 gap-2 ${
                location.pathname === "/dashboard/saved-meals"
                  ? "bg-[#181818]"
                  : ""
              }`}
            >
              <CiBookmark className="w-6 text-2xl" />
              Saved Meals
            </button>
            <button
              onClick={() => {
                navigate("/dashboard/pantry");
              }}
              className={`flex items-center border py-3 rounded-md border-none hover:bg-[#181818] transition-all duration-300  px-2 gap-2 ${
                location.pathname === "/dashboard/pantry" ? "bg-[#181818]" : ""
              }`}
            >
              <TbFridge className="w-6 text-2xl  text-[#c8c7c7]" />
              Pantry
            </button>
            <button
              onClick={() => {
                navigate("/dashboard/settings");
              }}
              className={`flex items-center border py-3 rounded-md border-none hover:bg-[#181818] transition-all duration-300  px-2 gap-2 ${
                location.pathname === "/dashboard/settings"
                  ? "bg-[#181818]"
                  : ""
              }`}
            >
              <CiSettings className="w-6 text-2xl" />
              Settings
            </button>
            {/* <button
              onClick={() => {
                navigate("/dashboard");
              }}
              className={`flex items-center border py-3 rounded-md border-none hover:bg-[#181818] transition-all duration-300  px-2 gap-2 ${
                location.pathname === "/dashboard" ? "bg-[#181818]" : ""
              }`}
            >
              <LuMoonStar className="w-6 text-2xl " />
              Appearance
            </button> */}
            <button
              onClick={() => {
                navigate("/dashboard");
              }}
              className={`flex items-center border py-3 rounded-md border-none hover:bg-[#181818] transition-all duration-300  px-2 gap-2 ${
                location.pathname === "/dashboard/appear" ? "bg-[#181818]" : ""
              }`}
            >
              <div className="w-6 h-6 rounded-full text-center flex items-center justify-center bg-[#B678F0]">
                {userData.firstName.slice(0, 1)}
              </div>
              Profile
            </button>
            {/* <button
              onClick={showPreferences}
              className="flex cursor-pointer items-center gap-2"
            >
              <svg
                className="w-6 text-xl"
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
            </button> */}
            {preferences && (
              <div className="flex px-3 pb-4 text-sm">
                <div className="w-5"></div>
                <ul className="flex flex-col gap-2">
                  <li>Age: {userMetrics.age}</li>
                  <li>Goal: {mapText[userMetrics.goal]}</li>
                  <li>Weight: {userMetrics.weight} kg</li>
                  <li>Height: {userMetrics.height} cm</li>
                  <li>
                    Diet:{" "}
                    {userMetrics.dietaryPreferences.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {userMetrics.dietaryPreferences.map((diet, index) => (
                          <li key={index} className="pl-1">
                            {diet}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>None</span>
                    )}
                  </li>
                  <li>Exercise Level: {mapText[userMetrics.exerciseLevel]}</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col pb-10 gap-4 text-base font-bold px-3">
          <button
            onClick={openDialog}
            className={`flex items-center border py-3 rounded-md border-none hover:bg-[#181818] transition-all duration-300  px-2 gap-2 
            `}
          >
            <IoIosLogOut className="w-6 text-2xl " />
            <div>Log out</div>
          </button>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
