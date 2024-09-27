import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./sections/Home";
import Features from "./sections/Features";
import Hero from "./pages/Hero";
import Footer from "./components/Footer";
import SignUp from "./pages/SignUp";
import MaybeShowComponent from "./components/MaybeShowComponent";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

const App = () => {
  return (
    <div className="flex flex-col h-full w-screen pb-20 gap-10">
      <Router>
        <MaybeShowComponent>
          <Navbar />
        </MaybeShowComponent>

        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
        <MaybeShowComponent>
          <Footer />
        </MaybeShowComponent>
      </Router>
    </div>
  );
};

export default App;
