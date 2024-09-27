import React from "react";
import Home from "../sections/Home";
import Features from "../sections/Features";
import About from "../sections/About";

const Hero = () => {
  return (
    <div className="flex flex-col w-full overflow-hidden gap-20 ">
      <Home />
      <Features />
      <About />
    </div>
  );
};

export default Hero;
