import React, { useEffect } from "react";
import Hero from "../sections/Hero";
import Features from "../sections/Features";
import About from "../sections/About";
import { useNavigate } from "react-router-dom";

const Home = ({ userData }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (userData) {
      navigate("/dashboard");
    }
  }, [userData]);
  return (
    <div className="flex flex-col w-full overflow-hidden gap-20 ">
      <Hero />
      <Features />
      <About />
    </div>
  );
};

export default Home;
