import React, { useState } from "react";
import { CiBookmark, CiGrid41, CiSettings } from "react-icons/ci";
import { IoIosAddCircleOutline, IoIosLogOut } from "react-icons/io";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { mapText } from "../../../../server/utils/helper";
import { TbFridge } from "react-icons/tb";
import axios from "axios";
import DialogComponent from "../DialogComponent";
import { GoHomeFill } from "react-icons/go";

const MobileSideMenu = ({
  showPreferences,
  userMetrics,
  preferences,
  setSideMenu,
  openDialog,
  userData,
  showPostModal,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      <div className="flex lg:hidden flex-col  pt-20 justify-between  w-full z-40  bg-[#08090a] h-full fixed ">
        <div className="flex flex-col w-full gap-2">
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
                setSideMenu(false);
                navigate("/home");
              }}
              className={`flex items-center border py-3 rounded-md border-none hover:bg-[#181818] transition-all duration-300  px-2 gap-2 ${
                location.pathname === "/home" ? "bg-[#181818]" : ""
              }`}
            >
              <GoHomeFill className="w-6 text-xl " />
              Home
            </button>
            <button
              onClick={() => {
                setSideMenu(false);
                showPostModal();
              }}
              className={`flex items-center border py-3 rounded-md border-none hover:bg-[#181818] transition-all duration-300  px-2 gap-2 `}
            >
              <IoIosAddCircleOutline className="w-6 text-xl" />
              Create Post
            </button>

            <button
              onClick={() => {
                setSideMenu(false);
                navigate("/content");
              }}
              className={`flex items-center border py-3 rounded-md border-none hover:bg-[#181818] transition-all duration-300  px-2 gap-2 ${
                location.pathname === "/content" ? "bg-[#181818]" : ""
              }`}
            >
              <CiGrid41 className="w-6 text-xl " />
              Dashboard
            </button>

            <button
              onClick={() => {
                setSideMenu(false);
                navigate("/saved-meals");
              }}
              className={`flex items-center border py-3 rounded-md border-none hover:bg-[#181818] transition-all duration-300  px-2 gap-2 ${
                location.pathname === "/saved-meals" ? "bg-[#181818]" : ""
              }`}
            >
              <CiBookmark className="w-6 text-xl" />
              Saved Meals
            </button>
            <button
              onClick={() => {
                setSideMenu(false);
                navigate("/pantry-items");
              }}
              className={`flex items-center border py-3 rounded-md border-none hover:bg-[#181818] transition-all duration-300  px-2 gap-2 ${
                location.pathname === "/pantry-items" ? "bg-[#181818]" : ""
              }`}
            >
              <TbFridge className="w-6 text-xl  text-[#c8c7c7]" />
              Pantry
            </button>
            <button
              onClick={() => {
                setSideMenu(false);
                navigate("/settings");
              }}
              className={`flex items-center border py-3 rounded-md border-none hover:bg-[#181818] transition-all duration-300  px-2 gap-2 ${
                location.pathname === "/settings" ? "bg-[#181818]" : ""
              }`}
            >
              <CiSettings className="w-6 text-xl" />
              Settings
            </button>

            <button
              onClick={() => {
                setSideMenu(false);
                navigate("/profile");
              }}
              className={`flex items-center border py-3 rounded-md border-none hover:bg-[#181818] transition-all duration-300  px-2 gap-2 ${
                location.pathname === "/profile" ? "bg-[#181818]" : ""
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
            <IoIosLogOut className="w-6 text-xl " />
            <div>Log out</div>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileSideMenu;
