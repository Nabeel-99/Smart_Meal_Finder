import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import animationData from "../assets/animation.json";
const AnimationComponent = () => {
  const [bar, setBar] = useState("Authenticating");
  useEffect(() => {
    setTimeout(() => {
      setBar("Getting Started");
    }, 3000);
  }, []);
  return (
    <div className="flex flex-col items-center gap-10 mt-44 justify-center h-screen">
      <div>{bar}</div>
      <div className="border border-[#1d1d1d] w-full xl:w-32 h-3 flex items-center rounded-full ">
        <div className="progress-bar h-full bg-white rounded-full"></div>
      </div>
    </div>
  );
};

export default AnimationComponent;
