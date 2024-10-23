import React, { useEffect, useState } from "react";
import { MdGridOn } from "react-icons/md";
import food from "../../assets/food4.jpg";
import axios from "axios";
import { Link } from "react-router-dom";
import { HiSquare2Stack } from "react-icons/hi2";

const Profile = ({ userData }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/recipes/user-posts",
        { withCredentials: true }
      );
      console.log(response.data);
      setUserPosts(response.data.userPosts);
      setTotalPosts(response.data.userPosts.length);
      setTotalLikes(response.data.totalLikes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);
  return (
    <div className="flex flex-col  h-full gap-8 pt-28 px-6 md:px-10 lg:px-20">
      <div className="flex pl-4 md:pl-52 lg:pl-24 xl:pl-64 items-center gap-6 xl:gap-10">
        <div className="h-20 w-20 md:h-32 md:w-32 xl:w-44 xl:h-44 bg-[#B678F0] rounded-full flex items-center justify-center ">
          <div className="text-2xl md:text-4xl xl:text-6xl font-bold">
            {userData.firstName.slice(0, 1)}
          </div>
        </div>
        <div className="flex flex-col gap-2 xl:gap-4">
          <div className="text-base xl:text-xl font-semi-bold">
            {userData.firstName} {userData.lastName}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex flex-col items-center">
              <div className="font-bold">{totalPosts}</div>
              <div>Posts</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-bold">{totalLikes}</div>
              <div>Likes</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 w-full  h-full">
        <div className="flex  text-sm xl:text-base items-center gap-2 justify-center ">
          <MdGridOn /> POSTS
        </div>
        {userPosts.length > 0 ? (
          <div className="grid grid-cols-3 w-full gap-2">
            {userPosts.map((post, index) => (
              <div key={index} className="relative">
                <Link to={`/recipe-details/${post.posts._id}`}>
                  <img
                    src={`http://localhost:8000/${post.posts.images[currentImageIndex]}`}
                    className="h-28 w-full md:h-52 lg:h-44 xl:h-80 xl:w-full rounded-sm object-cover"
                  />
                  {post.posts.images.length > 1 && (
                    <div className="absolute right-2 top-2 text-xl font-bold">
                      <HiSquare2Stack />
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-2xl flex h-full w-full items-center justify-center font-bold">
            No posts yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
