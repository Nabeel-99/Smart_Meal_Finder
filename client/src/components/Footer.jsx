import React from "react";
import { SiGreasyfork } from "react-icons/si";
import { Link } from "react-router-dom";
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
const Footer = () => {
  return (
    <div className="flex flex-col gap-32 w-full px-8 pt-10 md:px-16 lg:px-32 xl:px-64">
      <div className="flex flex-col gap-10 lg:gap-0 md:flex-row items-start justify-between">
        <div className="flex gap-2 items-center">
          <SiGreasyfork />
          Smart Meal Finder
        </div>
        <div className="flex gap-20">
          <div className="flex flex-col gap-2">
            <Link>About</Link>
            <Link>Features</Link>
            <Link>Contact</Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link>Privacy Policy</Link>
            <Link>Terms & Conditions</Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <FaXTwitter />
          <FaGithub />
        </div>
        <div className="border-t border-t-[#343333]">
          <p className="pt-2 text-xs lg:text-sm">
            &copy; 2024 Smart Meal Finder. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
