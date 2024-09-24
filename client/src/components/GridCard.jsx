import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";

const GridCard = ({ header, image, description, to }) => {
  return (
    <div className="flex flex-col text-sm bg-[#08090a] md:text-lg gap-2 z-20 max-w-[351px] md:max-w-[440px] md:max-h-[511px] max-h-[448px] border rounded-[20px] p-6 border-[#1919199d]">
      <p className="">{header}</p>
      <img
        src={image}
        alt=""
        className="object-cover max-w-[277px] max-h-[236px] md:max-w-[351px] md:max-h-[282px] rounded-tl-[20px] rounded-br-[100px]"
      />
      <p className="text-[#C0BBBB] font-medium">{description}</p>
      <Link to={to} className="flex items-center text-sm">
        See more <MdKeyboardArrowRight />
      </Link>
    </div>
  );
};

export default GridCard;
