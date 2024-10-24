import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Link as ScrollToLink } from "react-scroll";

const BurgerMenu = ({ closeMenu }) => {
  const pathNames = ["/ingredients-based", "/metrics-based"];
  const location = useLocation();
  return (
    <div className="h-screen w-screen z-50  fixed inset-0 top-16 bg-[#08090a]">
      <div className="flex text-lg flex-col gap-4 items-start h-screen px-8 pt-6">
        {pathNames.every((path) => !location.pathname.startsWith(path)) ? (
          <ScrollToLink smooth="true" to="/" onClick={closeMenu}>
            Home
          </ScrollToLink>
        ) : (
          <Link to="/" duration={500} smooth="true" onClick={closeMenu}>
            Home
          </Link>
        )}

        {pathNames.every((path) => !location.pathname.startsWith(path)) && (
          <>
            <ScrollToLink smooth="true" to="features" onClick={closeMenu}>
              Features
            </ScrollToLink>
            <ScrollToLink smooth="true" to="about" onClick={closeMenu}>
              About
            </ScrollToLink>
          </>
        )}
      </div>
    </div>
  );
};

export default BurgerMenu;
