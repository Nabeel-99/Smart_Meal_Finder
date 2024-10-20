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
import PantryPage from "./PantryPage";
import DialogComponent from "../../components/DialogComponent";

const Dashboard = ({ userData, fetchUserData }) => {
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState(false);
  const [sideMenu, setSideMenu] = useState(false);
  const [listView, setListView] = useState(false);
  const [gridView, setGridView] = useState(true);
  const [viewOptions, setViewOptions] = useState(false);
  const [userMetrics, setUserMetrics] = useState(null);
  const [dashboardRecipes, setDashboardRecipes] = useState([]);
  const [fetchingInProgress, setFetchingInProgress] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const openDialog = () => {
    setShowDialog(true);
  };

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
  const location = useLocation();

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

  const getUserMetrics = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/users/get-user-metrics",
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUserMetrics(response.data.metrics);
        console.log("user metrics", response.data);
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

  const fetchUserDashboardRecipes = async () => {
    if (fetchingInProgress) return;
    setFetchingInProgress(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/recipes/dashboard-recipes",
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log(response.data);
        setDashboardRecipes(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingInProgress(false);
    }
  };

  const getCurrentView = () => {
    if (location.pathname === "/dashboard") return "Dashboard";
    if (location.pathname === "/dashboard/saved-meals") return "Saved Meals";
    if (location.pathname === "/dashboard/my-cooking-choices")
      return "My Cooking Choices";
    if (location.pathname === "/dashboard/settings") return "Settings";
    if (location.pathname === "/dashboard/pantry") return "Pantry";
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
              setViewOptions={setViewOptions}
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
        <Route
          path="settings"
          element={
            <Settings
              userData={userData}
              refreshUserData={fetchUserData}
              userMetrics={userMetrics}
              refreshSideMenu={getUserMetrics}
            />
          }
        />
        <Route path="pantry" element={<PantryPage />} />
      </Routes>
    );
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
    if (userMetrics) {
      const refetchData = async () => await fetchUserData();
      refetchData();
      console.log("User metrics updated", userMetrics);
    }
  }, [userMetrics]);

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
      <div className="flex flex-col lg:flex-row bg-[#08090a] w-full  gap-10">
        {userData && userMetrics && (
          <SideMenu
            userData={userData}
            userMetrics={userMetrics}
            showPreferences={showPreferences}
            preferences={preferences}
            openDialog={openDialog}
          />
        )}

        <div className="lg:hidden pt-6 pl-6 flex items-center text-sm gap-4 border-b pb-3 border-b-[#343333] fixed bg-[#0c0c0c] z-50 w-full">
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
            openDialog={openDialog}
          />
        )}
        <div className="bg-[#0c0c0c] lg:pl-64 flex flex-col min-h-screen pb-8 w-full">
          <div className="hidden lg:block fixed bg-[#0c0c0c] pt-6 pb-6 border-b border-b-[#1d1d1d] z-30 w-full">
            <div className="px-10 text-sm">{getCurrentView()}</div>
          </div>
          {renderContentView()}
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

export default Dashboard;
