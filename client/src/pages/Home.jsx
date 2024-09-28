import React from "react";
import Hero from "../sections/Hero";
import Features from "../sections/Features";
import About from "../sections/About";

const Home = () => {
  return (
    <div className="flex flex-col w-full overflow-hidden gap-20 ">
      <Hero />
      <Features />
      <About />
    </div>
  );
};

export default Home;
