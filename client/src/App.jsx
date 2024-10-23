import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SignUp from "./pages/authPages/SignUp";
import MaybeShowComponent from "./components/MaybeShowComponent";
import Login from "./pages/authPages/Login";
import ResetPassword from "./pages/authPages/ResetPassword";
import ForgotPassword from "./pages/authPages/ForgotPassword";
import IngredientsBased from "./pages/IngredientsBased";
import Home from "./pages/Home";
import MetricsBased from "./pages/MetricsBased";
import ScrollToTop from "./components/ScrollToTop";
import RecipeDetails from "./pages/RecipeDetails";
import Dashboard from "./pages/dashboard/Dashboard";
import SavedMeals from "./pages/dashboard/SavedMeals";
import DashboardContent from "./pages/dashboard/DashboardContent";
import CookingChoice from "./pages/dashboard/CookingChoice";
import Settings from "./pages/dashboard/Settings";
import Preferences from "./pages/Preferences";
import axios from "axios";
import AnimationComponent from "./components/AnimationComponent";
import PantryItems from "./pages/PantryItems";

const App = () => {
  const [userData, setUserData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      return storedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const authenticateUser = async () => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const response = await axios.get("http://localhost:8000/api/auth", {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log(response.data);
        setUserData(response.data.user);
      }
    } catch (error) {
      console.log("Auth error", error);
    } finally {
      setIsFetching(false);
    }
  };
  // app theme
  const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const systemMode = () => {
    const isSystemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(isSystemDark);
    localStorage.removeItem("theme");
    applyTheme(isSystemDark ? "dark" : "light");
  };

  const updateTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    if (selectedTheme === "light") {
      applyTheme("light");
      setIsDarkMode(false);
    } else if (selectedTheme === "dark") {
      applyTheme("dark");
      setIsDarkMode(true);
    } else {
      systemMode();
    }
  };
  useEffect(() => {
    if (theme === "system") {
      systemMode();
    } else {
      applyTheme(theme);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (theme === "system") {
        applyTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);
  useEffect(() => {
    authenticateUser();
  }, []);
  return (
    <div className="flex flex-col h-full w-screen pb-20 gap-10">
      <Router>
        <ScrollToTop />
        <MaybeShowComponent>
          <Navbar userData={userData} />
        </MaybeShowComponent>
        <Routes>
          <Route path="/home" element={<Home userData={userData} />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/login"
            element={<Login authenticateUser={authenticateUser} />}
          />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/pantry" element={<PantryItems />} />
          <Route
            path="/*"
            element={
              <Dashboard userData={userData} fetchUserData={authenticateUser} />
            }
          ></Route>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/ingredients-based"
            element={<IngredientsBased userData={userData} />}
          />
          <Route
            path="/metrics-based"
            element={<MetricsBased userData={userData} />}
          />
          <Route path="/recipe-details/:id" element={<RecipeDetails />} />
        </Routes>
        <MaybeShowComponent>
          <Footer />
        </MaybeShowComponent>
      </Router>
    </div>
  );
};

export default App;
