import React, { useState } from "react";
import { CiBookmark, CiGrid41, CiSettings } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { mapText } from "../../../../server/utils/helper";
import { TbFridge } from "react-icons/tb";
import axios from "axios";
import DialogComponent from "../DialogComponent";

const MobileSideMenu = ({
  showPreferences,
  userMetrics,
  preferences,
  setSideMenu,
}) => {
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const openDialog = () => {
    setShowDialog(true);
  };
  const navigate = useNavigate();
  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/logout",
        null,
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.status === 200) {
        window.location = "/";
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex lg:hidden flex-col  pt-20 justify-between  w-full z-40  bg-[#171717] h-full fixed ">
        <div className="px-2">
          <div className="flex px-5 items-center text-lg gap-4">
            <div className="w-6 h-6 rounded-full text-center flex items-center justify-center bg-[#B678F0]">
              F
            </div>
            <div className="text-[#d2d2d2]">Farouk Nabeel</div>
          </div>
          <div className="flex px-4 pt-8 flex-col border-b border-b-[#343333] pb-4 text-sm gap-4">
            <button
              onClick={() => {
                navigate("/dashboard");
                setSideMenu(false);
              }}
              className="flex items-center text-lg gap-4"
            >
              <CiGrid41 className="w-6 text-xl" />
              Dashboard
            </button>
            <button
              onClick={() => {
                navigate("/dashboard/saved-meals");
                setSideMenu(false);
              }}
              className="flex items-center text-lg gap-4"
            >
              <CiBookmark className="w-6 text-xl" />
              Saved Meals
            </button>

            <button
              onClick={() => {
                navigate("/dashboard/my-cooking-choices");
                setSideMenu(false);
              }}
              className="flex items-center text-lg gap-4"
            >
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
              My Cooking Choices
            </button>
          </div>
          <div className="flex px-4 pt-8 flex-col border-b border-b-[#343333] pb-4  text-lg gap-4">
            <button
              onClick={() => {
                navigate("/dashboard/settings");
                setSideMenu(false);
              }}
              className="flex items-center text-lg gap-4"
            >
              <CiSettings className="w-6 text-xl" />
              Settings
            </button>
            <button
              onClick={() => {
                navigate("/dashboard/pantry");
              }}
              className="flex items-center gap-4"
            >
              <TbFridge className="w-6 text-xl text-[#adadad]" />
              Pantry
            </button>
            <button
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
            </button>
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
        <div className="flex flex-col px-7 pb-10 text-lg gap-4 ">
          <button
            onClick={openDialog}
            className="flex items-center text-lg gap-4"
          >
            <IoIosLogOut className="w-6 text-xl" />
            <div>Log out</div>
          </button>
        </div>
      </div>
      {showDialog && (
        <DialogComponent
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          handleAction={handleLogout}
          title={"Arer you sure you want to log out?"}
        />
      )}
    </>
  );
};

export default MobileSideMenu;
