import React from "react";

const SkeletonLoader = ({ count }) => {
  return (
    <div className="grid grid-col-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col  animate-pulse  gap-1 cursor-pointer "
        >
          <div className=" bg-[#595959] h-[250px] border border-[#7d7d7d] w-[300px] duration-1000 ease-in-out   rounded-2xl" />
          <div className="bg-[#595959] mt-2 w-3/4 border border-[#7d7d7d] h-4 rounded  " />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
