import React from "react";
import { CiBookmark, CiGrid41, CiSettings } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

const MobileSideMenu = ({
  showPreferences,
  userPreferences,
  preferences,
  setSideMenu,
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex lg:hidden flex-col pt-6 justify-between  w-full z-20  bg-[#171717] h-full fixed ">
      <div className="px-2">
        <div className="flex px-3 items-center text-lg gap-4">
          <div className="w-6 h-6 rounded-full text-center flex items-center justify-center bg-[#B678F0]">
            F
          </div>
          <div>Farouk Nabeel</div>
        </div>
        <div className="flex px-4 pt-8 flex-col border-b border-b-[#343333] pb-4 text-sm gap-4">
          <div className="flex items-center text-lg gap-4">
            <CiGrid41 className="w-6 text-xl" />
            <button
              onClick={() => {
                navigate("/dashboard");
                setSideMenu(false);
              }}
            >
              Dashboard
            </button>
          </div>
          <div className="flex items-center text-lg gap-4">
            <CiBookmark className="w-6 text-xl" />
            <button
              onClick={() => {
                navigate("/dashboard/saved-meals");
                setSideMenu(false);
              }}
            >
              Saved Meals
            </button>
          </div>
          <div className="flex items-center text-lg gap-4">
            <svg
              className="w-6 text-xl"
              title="page 16"
              aria-label="page 16"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
                setSideMenu(false);
              }}
            >
              My Cooking Choices
            </button>
          </div>
        </div>
        <div className="flex px-4 pt-8 flex-col border-b border-b-[#343333] pb-4 text-sm text-lg gap-4">
          <div className="flex items-center text-lg gap-4">
            <CiSettings className="w-6 text-xl" />
            <button
              onClick={() => {
                navigate("/dashboard/settings");
                setSideMenu(false);
              }}
            >
              Settings
            </button>
          </div>
          <div
            onClick={showPreferences}
            className="flex cursor-pointer items-center text-lg gap-4"
          >
            <svg
              className="w-6 text-xl"
              title="folder 16"
              aria-label="folder 16"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
              <ul className="flex flex-col px-3 gap-4">
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
      <div className="flex flex-col px-7 pb-10 text-lg gap-4 ">
        <div className="flex items-center text-lg gap-4">
          <IoIosLogOut className="w-6 text-xl" />
          <div>Log out</div>
        </div>
      </div>
    </div>
  );
};

export default MobileSideMenu;
