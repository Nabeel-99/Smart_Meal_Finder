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

const App = () => {
  const [userData, setUserData] = useState(null);
  const authenticateUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/auth", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserData(response.data.user);
      }
    } catch (error) {
      console.log("Auth error", error);
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);
  return (
    <div className="flex flex-col h-full w-screen pb-20 gap-10">
      <Router>
        <ScrollToTop />
        <MaybeShowComponent>
          <Navbar />
        </MaybeShowComponent>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/login"
            element={<Login authenticateUser={authenticateUser} />}
          />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/dashboard/*" element={<Dashboard />}></Route>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/ingredients-based" element={<IngredientsBased />} />
          <Route path="/metrics-based" element={<MetricsBased />} />
          <Route path="/recipe-details" element={<RecipeDetails />} />
        </Routes>
        <MaybeShowComponent>
          <Footer />
        </MaybeShowComponent>
      </Router>
    </div>
  );
};

export default App;
