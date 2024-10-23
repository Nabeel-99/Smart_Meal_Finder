import React, { useEffect, useRef, useState } from "react";
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
import {
  FaBarsStaggered,
  FaFile,
  FaHeart,
  FaRegHeart,
  FaXmark,
} from "react-icons/fa6";
import { IoCloudUploadOutline } from "react-icons/io5";
import SkeletonLoader from "../../components/SkeletonLoader";
import food from "../../assets/food4.jpg";
import DashboardContent from "./DashboardContent";
import SavedMeals from "./SavedMeals";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CookingChoice from "./CookingChoice";
import MobileSideMenu from "../../components/menuCards/MobileSideMenu";
import SideMenu from "../../components/menuCards/SideMenu";
import Settings from "./Settings";
import { Routes, Route } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import axios from "axios";
import PantryPage from "./PantryPage";
import DialogComponent from "../../components/DialogComponent";
import DashboardHome from "./DashboardHome";
import PopperComponent from "../../components/PopperComponent";

import ModalComponent from "../../components/ModalComponent";
import TextInput from "../../components/formInputs/TextInput";
import SelectInput from "../../components/formInputs/SelectInput";
import { mealCategories } from "../../../../server/utils/helper";
import { Autocomplete, TextField } from "@mui/material";
import ingredientsData from "../../../../server/utils/ingredientsHelper.json";
import CreatePost from "../../components/CreatePost";
import Profile from "./Profile";
import MobileNotificationCard from "../../components/MobileNotificationCard";
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
  const [viewNotifications, setViewNotifications] = useState(false);
  const [createPost, setCreatePost] = useState(false);
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [item, setItem] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [prepTime, setPrepTime] = useState(0);
  const anchorRef = useRef(null);
  const navigate = useNavigate();

  const addIngredient = () => {
    if (item && !ingredients.includes(item)) {
      setIngredients([...ingredients, item]);
      setItem("");
    }
  };
  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter((item) => item !== ingredient));
  };

  const showPostModal = () => setCreatePost(!createPost);

  const showNotifications = () => setViewNotifications(!viewNotifications);

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

      if (response.status === 200) {
        window.location = "/home";
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
        setDashboardRecipes(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingInProgress(false);
    }
  };

  const getCurrentView = () => {
    if (location.pathname === "/profile") return "Profile";
    if (location.pathname === "/content") return "Dashboard";
    if (location.pathname === "/saved-meals") return "Saved Meals";
    if (location.pathname === "/my-cooking-choices")
      return "My Cooking Choices";
    if (location.pathname === "/settings") return "Settings";
    if (location.pathname === "/pantry-items") return "Pantry";
  };

  const renderContentView = () => {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <DashboardHome
              anchorRef={anchorRef}
              showNotifications={showNotifications}
              currentUserId={userData._id}
            />
          }
        />
        <Route path="/profile" element={<Profile userData={userData} />} />
        <Route
          path="content"
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
        <Route path="pantry-items" element={<PantryPage />} />
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
            showPostModal={showPostModal}
          />
        )}

        <div className="lg:hidden pt-6 pl-6 flex items-center text-sm gap-4 border-b pb-3 border-b-[#343333] fixed bg-[#0c0c0c] z-50 w-full">
          <div className="flex items-center">
            <button onClick={showSideMenu} className="">
              {sideMenu ? (
                <FaXmark className="text-2xl" />
              ) : (
                <FaBarsStaggered className="text-2xl" />
              )}
            </button>
            {location.pathname === "/" && (
              <button
                ref={anchorRef}
                onClick={showNotifications}
                className="fixed right-5"
              >
                <FaRegHeart className="text-2xl" />
              </button>
            )}
            {viewNotifications && (
              <PopperComponent
                viewPopper={viewNotifications}
                anchorRef={anchorRef}
                setViewPopper={setViewNotifications}
              >
                <MobileNotificationCard />
              </PopperComponent>
            )}
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
            showPostModal={showPostModal}
          />
        )}
        <div className="bg-[#0c0c0c] lg:pl-64 flex flex-col min-h-screen pb-8 w-full">
          <div
            className={`hidden lg:block   pb-6  z-30 w-full ${
              location.pathname === "/"
                ? ""
                : "border-b border-b-[#1d1d1d] fixed bg-[#0c0c0c]  pt-6"
            }`}
          >
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
      {createPost && (
        <ModalComponent showModal={createPost} setShowModal={setCreatePost}>
          <CreatePost setCreatePost={setCreatePost} />
        </ModalComponent>
      )}
    </>
  );
};

export default Dashboard;
