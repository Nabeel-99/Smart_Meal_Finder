import React, { useEffect, useState } from "react";
import food from "../../assets/food4.jpg";
import {
  FaBookmark,
  FaHeart,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa6";
import { IoIosNotifications, IoIosNotificationsOutline } from "react-icons/io";
import ModalComponent from "../../components/ModalComponent";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const DashboardHome = ({ anchorRef, showNotifications }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likedPosts, setLikedPosts] = useState({});

  const fetchAllPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/recipes/posts",
        { withCredentials: true }
      );
      console.log(response.data);
      setPosts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const openModal = (id) => {
    setSelectedPost(id);
    setShowModal(true);
    console.log(id);
  };

  const likeRecipe = async (postId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/recipes/like",
        {
          postId: postId,
        },
        { withCredentials: true }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="px-4 lg:px-10 flex flex-col gap-8 w-full">
        <div className="flex gap-2 items-center justify-between border-b border-b-[#1d1d1d] w-full pb-2">
          For you
          <div className="lg:block xl:hidden">
            <button ref={anchorRef} onClick={showNotifications}>
              <FaRegHeart className="text-2xl w-6" />
            </button>
          </div>
        </div>
        <div className="flex w-full  ">
          <div className="flex flex-col gap-4 w-full">
            {posts.map((post, index) => {
              const images = post.posts.images;
              const isLiked = likedPosts[post.postId];
              return (
                <div
                  className="flex pt-8 lg:px-10 flex-col w-full lg:w-[650px] gap-3"
                  key={index}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full font-bold text-sm text-center flex items-center justify-center bg-[#B678F0]">
                      {post.firstName.slice(0, 1)}
                    </div>
                    <div className="text-sm font-semibold">
                      {" "}
                      {post.firstName} {post.lastName}{" "}
                      {moment(
                        post.posts.updatedAt || post.posts.createdAt
                      ).fromNow()}
                    </div>
                  </div>
                  <div className="bg-[#0c0c0c] border border-[#171717] rounded-lg">
                    <img
                      src={`http://localhost:8000/${images[currentImageIndex]}`}
                      onDoubleClick={() => likeRecipe(post.postId)}
                      onClick={() => openModal(post)}
                      className="w-full h-[450px] md:h-[550px] lg:h-[650px] rounded-md object-contain "
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <button onClick={() => likeRecipe(post.postId)}>
                        {" "}
                        {isLiked ? (
                          <FaHeart className="text-xl  text-red-500" />
                        ) : (
                          <FaRegHeart className="text-xl" />
                        )}
                      </button>
                      <button>
                        <FaRegComment
                          onClick={() => openModal(post)}
                          className="text-xl"
                        />
                      </button>
                    </div>
                    <div>
                      <button>
                        {" "}
                        <FaRegBookmark className="text-xl" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p>2,128,022 likes</p>
                  </div>
                  <div className="">
                    <span className="font-bold pr-2">
                      {" "}
                      {post.firstName} {post.lastName}
                    </span>
                    {post.posts.title}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      View all 24,000 comments
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-16 ">
            <div className="hidden xl:sticky top-[60px] w-96 py-2 xl:flex flex-col  border border-[#1d1d1d] rounded-xl h-80 bg-[#0f0f0f]">
              <div className="flex items-center  justify-center border-b border-b-[#2a2a2a] px-4 py-2 text-lg gap-2">
                Notifications
                <IoIosNotifications className="text-2xl w-6" />
              </div>
              <div className="overflow-y-scroll flex flex-col pt-4 pb-4 gap-6">
                {Array.from({ length: 10 }).map((_, index) => (
                  <React.Fragment key={index}>
                    <div className="flex justify-between items-center pr-6">
                      <div className="flex items-center gap-2 px-4">
                        <div className="w-12 h-12 rounded-full font-bold text-sm text-center flex items-center justify-center bg-[#B678F0]">
                          N
                        </div>
                        <div className="text-sm">
                          {" "}
                          <span className="font-bold pr-1">cristiano</span>liked
                          your post
                        </div>
                      </div>
                      <div>
                        <img
                          src={food}
                          className="w-12 min-w-12 max-w-12 rounded h-12"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center pr-6">
                      <div className="flex items-center gap-2 px-4">
                        <div className="max-w-12 min-w-12 w-12 h-12 rounded-full font-bold text-sm text-center flex items-center justify-center bg-[#B678F0]">
                          N
                        </div>
                        <div className="text-sm">
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
          </div>
        </div>
      </div>
      {showModal && (
        <ModalComponent showModal={showModal} setShowModal={setShowModal}>
          <div className="flex flex-col gap-2 lg:flex-row justify-between items-center overflow-scroll lg:items-stretch p-8 h-[40rem]  lg:h-[35rem] xl:h-[45rem] w-full">
            <div className=" w-[15rem] lg:w-[200rem] xl:w-[230rem]  border border-[#2a2a2a] rounded-md">
              <img
                src={food}
                className="rounded-md w-full md:h-full lg:w-full lg:h-full xl:w-full  xl:h-full object-contain"
              />
            </div>
            <div className="flex flex-col  px-4 lg:w-[200rem] xl:w-[230rem] h-full">
              <div className="flex flex-col items-start border-b  border-b-[#1d1d1d] w-full pb-4 gap-4">
                <div className="flex items-center gap-4 ">
                  <div className="min-w-10 max-w-10 h-10 rounded-full font-bold text-sm text-center flex items-center justify-center bg-[#B678F0]">
                    N
                  </div>
                  <div className="text-sm font-semibold">
                    {" "}
                    {selectedPost.firstName} {selectedPost.lastName} 3hrs ago
                  </div>
                </div>
                <div className="md:pl-14 flex items-center w-full justify-between">
                  <p className="text-sm  text-gray-200">
                    {selectedPost.posts.title}
                  </p>
                  <Link
                    to={`/recipe-details/${selectedPost.posts._id}`}
                    className="text-sm text-nowrap text-gray-400 hover:text-white"
                  >
                    View full details
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-4 pb-2  pt-8 overflow-y-scroll">
                {Array.from({ length: 30 }).map((_, index) => (
                  <div className="flex items-center gap-4" key={index}>
                    <div className="min-w-10 max-w-10 h-10 rounded-full font-bold text-sm text-center flex items-center justify-center bg-[#B678F0]">
                      N
                    </div>
                    <div className="flex flex-col gap-1 text-sm">
                      <div>
                        {" "}
                        <span className="font-bold pr-1">cristiano</span>
                        <span className="">
                          Tried it and it turned out so nice!😍{" "}
                        </span>
                      </div>
                      <div>2hrs ago</div>
                    </div>
                  </div>
                ))}
              </div>
              <form className="flex flex-col md:flex-row items-end  pt-8 border-t border-t-[#1d1d1d] justify-between gap-10 ">
                <textarea
                  placeholder="Add a comment..."
                  className="bg-[#0c0c0c] w-full h-10 overflow-scroll border text-sm border-[#1d1d1d] rounded-md px-2 py-2"
                />
                <button className="text-blue-500 text-sm font-semibold hover:text-blue-300">
                  Post
                </button>
              </form>
            </div>
          </div>
        </ModalComponent>
      )}
    </>
  );
};

export default DashboardHome;
