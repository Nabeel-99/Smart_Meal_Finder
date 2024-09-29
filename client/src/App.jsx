import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SignUp from "./pages/SignUp";
import MaybeShowComponent from "./components/MaybeShowComponent";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import IngredientsBased from "./pages/IngredientsBased";
import Home from "./pages/Home";
import MetricsBased from "./pages/MetricsBased";
import ScrollToTop from "./components/ScrollToTop";
import RecipeDetails from "./pages/RecipeDetails";

const App = () => {
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
          <Route path="/login" element={<Login />} />
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
