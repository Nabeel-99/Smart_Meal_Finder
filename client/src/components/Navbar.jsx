import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Link as ScrollToLink } from "react-scroll";
import { SiGreasyfork } from "react-icons/si";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import BurgerMenu from "./menuCards/BurgerMenu";

const Navbar = () => {
  const location = useLocation();
  const pathNames = ["/ingredients-based", "/metrics-based"];
  const [isBurgerMenu, setIsBurgerMenu] = useState(false);
  const toggleMenu = () => setIsBurgerMenu(!isBurgerMenu);

  useEffect(() => {
    // handle background scrolling when burger menu is open
    if (isBurgerMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isBurgerMenu]);
  return (
    <div className="flex justify-center text-md z-50 items-center pt-6 px-6 lg:pt-10 lg:px-10">
      <div className="">
        <Link
          to={"/"}
          className="hidden lg:flex fixed top-7 lg:top-12  z-50  left-8 lg:left-24"
        >
          {" "}
          <SiGreasyfork className="text-2xl lg:text-4xl backdrop-blur-lg" />
        </Link>
      </div>
      <div className="hidden lg:flex  justify-center  items-center  gap-10 border border-[#302d2d] bg-[#08090A] rounded-xl w-[328px] h-[55px] ">
        <Link to="/" duration={500} smooth="true">
          Home
        </Link>
        {pathNames.every((path) => !location.pathname.startsWith(path)) && (
          <>
            <ScrollToLink
              className="cursor-pointer"
              to="features"
              duration={500}
              smooth="true"
            >
              Features
            </ScrollToLink>
            <ScrollToLink
              className="cursor-pointer"
              to={"about"}
              duration={500}
              smooth="true"
            >
              About
            </ScrollToLink>
          </>
        )}
      </div>

      <div className="hidden lg:flex items-center z-50 gap-4 border border-[#302d2d]  backdrop-blur-lg rounded-xl px-6 h-[55px] fixed right-10">
        <Link
          to={"/login"}
          className="border flex items-center justify-center rounded-lg border-[#343333] bg-[#29292a] w-20 h-8 "
        >
          Log in
        </Link>
        <Link
          to={"/sign-up"}
          className="border flex items-center justify-center rounded-lg bg-[#d9d9d9] text-black w-20 h-8 "
        >
          Sign Up
        </Link>
      </div>

      {/* burger menu*/}
      <div
        className={`lg:hidden fixed px-4 pt-8 w-full z-50 flex items-center justify-between ${
          isBurgerMenu ? "bg-[#08090a]" : ""
        }  backdrop-blur-lg pb-4`}
      >
        <div className="pl-4">
          <Link to={"/"} className="">
            {" "}
            <SiGreasyfork className="text-2xl lg:text-4xl" />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Link
              to={"/login"}
              className="border flex items-center justify-center rounded-lg border-[#343333] bg-[#29292a] w-20 h-8 "
            >
              Log in
            </Link>
            <Link
              to={"/sign-up"}
              className="border flex items-center justify-center rounded-lg bg-[#d9d9d9] text-black w-20 h-8 "
            >
              Sign Up
            </Link>
          </div>
          <button onClick={toggleMenu} className="">
            {isBurgerMenu ? (
              <FaXmark className="text-2xl" />
            ) : (
              <FaBarsStaggered className="text-2xl" />
            )}
          </button>
        </div>
      </div>
      {isBurgerMenu && <BurgerMenu />}
    </div>
  );
};

export default Navbar;
