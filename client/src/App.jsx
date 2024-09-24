import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./sections/Home";
import Features from "./sections/Features";
import Hero from "./pages/Hero";

const App = () => {
  return (
    <div className="flex flex-col h-full w-screen pb-20 gap-10">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
