import React from "react";
import { Link } from "react-router-dom";

const BurgerMenu = () => {
  return (
    <div className="h-screen w-screen z-30  fixed inset-0 top-16 bg-[#08090a]">
      <div className="absolute inset-0 h-full"></div>
      <div className="flex text-lg flex-col gap-4 items-start h-screen px-8 pt-6">
        <Link>Home</Link>
        <Link>Features</Link>
        <Link>About</Link>
      </div>
    </div>
  );
};

export default BurgerMenu;
