import React, { useEffect, useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { SiGreasyfork } from "react-icons/si";
import { CiGrid41 } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { LuArrowDownWideNarrow } from "react-icons/lu";
import { CiSettings } from "react-icons/ci";
import { HiBars3 } from "react-icons/hi2";
import Food1 from "../../assets/food1.jpg";
import Food2 from "../../assets/food2.jpg";
import Food3 from "../../assets/food3.jpg";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import SkeletonLoader from "../../components/SkeletonLoader";

import DashboardContent from "./DashboardContent";
import SavedMeals from "./SavedMeals";
import { useLocation, useNavigate } from "react-router-dom";
import CookingChoice from "./CookingChoice";
import MobileSideMenu from "../../components/menuCards/MobileSideMenu";
import SideMenu from "../../components/menuCards/SideMenu";
import Settings from "./Settings";
import { Routes, Route } from "react-router-dom";

const Dashboard = () => {
  const [preferences, setPreferences] = useState(false);
  const [sideMenu, setSideMenu] = useState(false);
  const [listView, setListView] = useState(false);
  const [gridView, setGridView] = useState(true);
  const [viewOptions, setViewOptions] = useState(false);
  const showListView = () => {
    setListView(true);
    setGridView(false);
    setViewOptions(false);
  };
  const showGridView = () => {
    setGridView(true);
    setListView(false);
    setViewOptions(false);
  };
  const showOptions = () => setViewOptions(!viewOptions);
  const showSideMenu = () => setSideMenu(!sideMenu);
  const showPreferences = () => setPreferences(!preferences);
  const userPreferences = [
    "Age: 25",
    "Height: 175cm",
    "Weight: 78kg",
    "Exercise Level: Active",
    "Goal: Weight Loss",
    "Diet: Vegetarian",
  ];
  const location = useLocation();
  const getCurrentView = () => {
    if (location.pathname === "/dashboard") return "Dashboard";
    if (location.pathname === "/dashboard/saved-meals") return "Saved Meals";
    if (location.pathname === "/dashboard/my-cooking-choices")
      return "My Cooking Choices";
    if (location.pathname === "/dashboard/settings") return "Settings";
  };
  const renderContentView = () => {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <DashboardContent
              showOptions={showOptions}
              showGridView={showGridView}
              showListView={showListView}
              viewOptions={viewOptions}
              gridView={gridView}
              listView={listView}
            />
          }
        />
        <Route
          path="saved-meals"
          element={
            <SavedMeals
              showGridView={showGridView}
              showListView={showListView}
              gridView={gridView}
              listView={listView}
            />
          }
        />
        <Route
          path="my-cooking-choices"
          element={
            <CookingChoice
              showGridView={showGridView}
              showListView={showListView}
              gridView={gridView}
              listView={listView}
            />
          }
        />
        <Route path="settings" element={<Settings />} />
      </Routes>
    );
  };
  useEffect(() => {
    if (sideMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [sideMenu]);
  return (
    <div className="flex flex-col lg:flex-row bg-[#171717] w-full  gap-10">
      <SideMenu
        showPreferences={showPreferences}
        preferences={preferences}
        userPreferences={userPreferences}
      />
      <div className="lg:hidden pt-6 pl-6 flex items-center text-sm gap-4 border-b pb-3 border-b-[#343333] fixed bg-[#171717] z-30 w-full">
        <div>
          <button onClick={showSideMenu} className="">
            {sideMenu ? (
              <FaXmark className="text-2xl" />
            ) : (
              <FaBarsStaggered className="text-2xl" />
            )}
          </button>
        </div>
        <div className="mb-1 text-lg">{getCurrentView()}</div>
      </div>
      {/* mobile side menu */}
      {sideMenu && (
        <MobileSideMenu
          showPreferences={showPreferences}
          userPreferences={userPreferences}
          preferences={preferences}
          setSideMenu={setSideMenu}
        />
      )}
      <div className="bg-[#171717] lg:pl-64 flex flex-col min-h-screen pb-8 w-full">
        <div className="hidden lg:block fixed bg-[#171717] pt-6 pb-6 border-b border-b-[#343333] z-30 w-full">
          <div className="px-10 text-sm">{getCurrentView()}</div>
        </div>
        {renderContentView()}
      </div>
    </div>
  );
};

export default Dashboard;
