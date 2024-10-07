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
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import axios from "axios";
const Dashboard = ({ userData }) => {
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState(false);
  const [sideMenu, setSideMenu] = useState(false);
  const [listView, setListView] = useState(false);
  const [gridView, setGridView] = useState(true);
  const [viewOptions, setViewOptions] = useState(false);
  const [userMetrics, setUserMetrics] = useState(null);
  const [dashboardRecipes, setDashboardRecipes] = useState([]);
  const [fetchingInProgress, setFetchingInProgress] = useState(false);

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

  const getUserMetrics = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/users/get-user-metrics",
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUserMetrics(response.data.metrics);
      }
      if (response.status === 404) {
        console.log("User has no metrics");
        setUserMetrics("You haven't set your preferences yet.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
              dashboardRecipes={dashboardRecipes}
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

  const fetchUserDashboardRecipes = async () => {
    if (fetchingInProgress) return;
    setFetchingInProgress(true);

    try {
      try {
        console.log("creating dashboard recipes..");
        const newResponse = await axios.post(
          "http://localhost:8000/api/recipes/prepare-dashboard-recipes",
          {},
          { withCredentials: true }
        );

        if (newResponse.status === 200) {
          console.log("New dashboard created successfully");
          setDashboardRecipes(newResponse.data);
          return;
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          console.log("Dashboard already exists, fetching existing one");
        } else {
          console.log("Error creating dashboard recipes", error);
          return;
        }
      }

      // Fetch existing dashboard recipes
      const response = await axios.get(
        "http://localhost:8000/api/recipes/dashboard-recipes",
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log(response.data);
        setDashboardRecipes(response.data);
        return;
      }
    } catch (error) {
      console.log("Error fetching dashboard recipes", error);
    } finally {
      setFetchingInProgress(false);
    }
  };

  useEffect(() => {
    getUserMetrics();
  }, []);

  useEffect(() => {
    fetchUserDashboardRecipes();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (sideMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [sideMenu]);

  if (loading || !userData || !userMetrics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <AiOutlineLoading3Quarters className="spin text-3xl" />
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col lg:flex-row bg-[#171717] w-full  gap-10">
        {userData && userMetrics && (
          <SideMenu
            userData={userData}
            userMetrics={userMetrics}
            showPreferences={showPreferences}
            preferences={preferences}
          />
        )}

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
        {sideMenu && userData && userMetrics && (
          <MobileSideMenu
            userData={userData}
            userMetrics={userMetrics}
            showPreferences={showPreferences}
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
    </>
  );
};

export default Dashboard;
