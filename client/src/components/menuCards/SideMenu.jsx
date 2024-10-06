import React from "react";
import { CiBookmark, CiGrid41, CiSettings } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { mapText } from "../../../../server/utils/helper";

const SideMenu = ({ showPreferences, preferences, userData, userMetrics }) => {
  const navigate = useNavigate();

  return (
    <div className="hidden lg:flex flex-col pt-6 justify-between  w-64 border-r border-r-[#343333] bg-[#171717] h-full fixed ">
      <div>
        <div className="flex px-3 items-center gap-2">
          <div className="w-6 h-6 rounded-full text-center flex items-center justify-center bg-[#B678F0]">
            {userData.firstName.slice(0, 1)}
          </div>
          <div>
            {userData.firstName} {userData.lastName}
          </div>
        </div>
        <div className="flex px-3 pt-8 flex-col border-b border-b-[#343333] pb-4 text-sm gap-4">
          <div className="flex items-center gap-2">
            <CiGrid41 className="w-6" />
            <button
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Dashboard
            </button>
          </div>
          <div className="flex items-center gap-2">
            <CiBookmark className="w-6" />
            <button
              onClick={() => {
                navigate("/dashboard/saved-meals");
              }}
            >
              Saved Meals
            </button>
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
            <button
              onClick={() => {
                navigate("/dashboard/my-cooking-choices");
              }}
            >
              My Cooking Choices
            </button>
          </div>
        </div>
        <div className="flex px-3 pt-8 flex-col border-b border-b-[#343333] pb-4 text-sm gap-4">
          <div className="flex items-center gap-2">
            <CiSettings className="w-6" />
            <button
              onClick={() => {
                navigate("/dashboard/settings");
              }}
            >
              Settings
            </button>
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
                <li className="">Age: {userMetrics.age}</li>
                <li>Goal: {mapText[userMetrics.goal]}</li>
                <li>Weight: {userMetrics.weight} kg</li>
                <li>Height: {userMetrics.height} cm</li>
                <li>
                  Diet:{" "}
                  {userMetrics.dietaryPreferences.length > 0 ? (
                    userMetrics.dietaryPreferences.map((diet, index) => (
                      <span key={index}>{diet}</span>
                    ))
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
      <div className="flex flex-col pb-10 gap-4 text-sm px-3">
        <div className="flex items-center gap-2">
          <IoIosLogOut className="w-6" />
          <div>Log out</div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
