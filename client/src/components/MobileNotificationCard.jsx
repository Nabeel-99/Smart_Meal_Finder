import React from "react";
import food from "../assets/food4.jpg";
import {
  FaBookmark,
  FaHeart,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa6";
import { IoIosNotifications, IoIosNotificationsOutline } from "react-icons/io";

const MobileNotificationCard = () => {
  return (
    <div className="mt-10 xl:sticky py-2 flex flex-col  border border-[#1d1d1d] h-80 bg-[#0f0f0f]">
      <div className="flex items-center  justify-center border-b border-b-[#2a2a2a] px-4 py-2 text-lg gap-2">
        Notifications
        <IoIosNotifications className="text-2xl w-6" />
      </div>
      <div className="overflow-y-scroll flex flex-col pt-4 pb-4 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <React.Fragment key={index}>
            <div
              className="flex justify-between items-center pr-6"
              key={`like-${index}`}
            >
              <div className="flex items-center gap-2 px-4">
                <div className="w-12 h-12 rounded-full font-bold text-sm text-center flex items-center justify-center bg-[#B678F0]">
                  N
                </div>
                <div>
                  {" "}
                  <span className="font-bold pr-1">cristiano</span>liked your
                  post
                </div>
              </div>
              <div>
                <img
                  src={food}
                  className="w-12 min-w-12 max-w-12 rounded h-12"
                />
              </div>
            </div>
            <div
              className="flex justify-between items-center pr-6"
              key={`comment-${index}`}
            >
              <div className="flex items-center gap-2 px-4">
                <div className="max-w-12 min-w-12 w-12 h-12 rounded-full font-bold text-sm text-center flex items-center justify-center bg-[#B678F0]">
                  N
                </div>
                <div>
                  {" "}
                  <span className="font-bold pr-1">cristiano</span>
                  Commented:{" "}
                  <span className="">
                    Tried it and it turned out so nice!😍{" "}
                  </span>
                </div>
              </div>
              <div>
                <img
                  src={food}
                  className="w-12 min-w-12 max-w-12 rounded h-12"
                />
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MobileNotificationCard;
