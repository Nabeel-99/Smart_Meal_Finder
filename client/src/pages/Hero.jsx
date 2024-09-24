import React from "react";
import Home from "../sections/Home";
import Features from "../sections/Features";

const Hero = () => {
  return (
    <div className="flex flex-col gap-20 ">
      <Home />
      <Features />
    </div>
  );
};

export default Hero;
