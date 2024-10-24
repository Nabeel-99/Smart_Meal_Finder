import React, { useEffect, useState } from "react";

import {
  FaArrowLeft,
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
import PostCard from "../../components/PostCard";
import NotificationCard from "../../components/NotificationCard";
import CommentsCard from "../../components/CommentsCard";
import PreviewCard from "../../components/PreviewCard";
import { Tooltip } from "@mui/material";
import ImageCard from "../../components/ImageCard";
import PostHeader from "../../components/PostHeader";
import PostComment from "../../components/PostComment";
import AutoHideSnackbar from "../../components/AutoHideSnackbar";

const DashboardHome = ({ anchorRef, showNotifications, currentUserId }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);

  const [likedPosts, setLikedPosts] = useState({});
  const [comment, setComment] = useState("");
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [displaySnackbar, setDisplaySnackbar] = useState("");

  const fetchAllPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/recipes/posts",
        { withCredentials: true }
      );

      setPosts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/recipes/liked-posts",
          { withCredentials: true }
        );

        const likedPostIds = response.data.likedPostIds;
        const likedPostsMap = {};

        likedPostIds.forEach((postId) => {
          likedPostsMap[postId] = true;
        });

        setLikedPosts(likedPostsMap);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLikedPosts();
  }, []);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const openModal = (id) => {
    setSelectedPost(id);
    setShowModal(true);
    console.log(id);
    console.log(selectedPost);
  };

  const likeRecipe = async (postId) => {
    try {
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
      const response = await axios.post(
        "http://localhost:8000/api/recipes/like",
        {
          postId: postId,
        },
        { withCredentials: true }
      );

      const likesCount = response.data.likesCount;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.postId === postId ? { ...post, likesCount } : post
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const postUserComment = async (postId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/recipes/post-comment",
        {
          postId: postId,
          comment: comment,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        const newComment = response.data.comment.comments.slice(-1)[0];

        setSelectedPost((prevPost) => ({
          ...prevPost,
          comments: [...prevPost.comments, newComment],
        }));

        await fetchAllPosts();
        console.log(newComment);
      }
      setComment("");
    } catch (error) {
      console.log("Error posting comment:", error);
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/recipes/delete-comment",
        {
          postId: postId,
          commentId: commentId,
        },
        { withCredentials: true }
      );
      console.log(response.data);

      setSelectedPost((prevPost) => {
        return {
          ...prevPost,
          comments: prevPost.comments.filter(
            (comment) => comment._id !== commentId
          ),
        };
      });
      if (response.status === 200) {
        setDisplaySnackbar(true);
        setSnackbarMsg("Comment deleted");
      }
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setDisplaySnackbar(error.response.message);
        setDisplaySnackbar(true);
      }
    }
  };

  return (
    <>
      <div className="px-4 lg:px-10 pt-14 lg:pt-0 flex flex-col gap-8 w-full">
        <div className="hidden  lg:flex gap-2 items-center justify-between border-b border-b-[#1d1d1d] w-full pb-2">
          For you
          <div className="lg:block  xl:hidden">
            <button ref={anchorRef} onClick={showNotifications}>
              <FaRegHeart className="text-2xl w-6" />
            </button>
          </div>
        </div>
        <div className="flex w-full  ">
          {/* post cards */}
          <div className="flex flex-col gap-4 w-full">
            {posts.map((post, index) => {
              const images = post.posts.images;
              const isLiked = likedPosts[post.postId];

              return (
                <PostCard
                  key={index}
                  post={post}
                  likeRecipe={likeRecipe}
                  isLiked={isLiked}
                  images={images}
                  openModal={openModal}
                />
              );
            })}
          </div>
          {/* notification card */}
          <div className="mt-16 ">
            <NotificationCard />
          </div>
        </div>
      </div>
      {showModal && (
        <ModalComponent showModal={showModal} setShowModal={setShowModal}>
          <div className="flex flex-col gap-4 lg:flex-row justify-between items-center overflow-scroll lg:items-stretch p-8 h-[40rem]  lg:h-[35rem] xl:h-[45rem] w-full">
            <ImageCard selectedPost={selectedPost} />

            <div className="flex flex-col  px-4 lg:w-[200rem] xl:w-[230rem] h-full">
              <PostHeader
                firstName={selectedPost.firstName}
                lastName={selectedPost.lastName}
                title={selectedPost.posts.title}
                recipeId={selectedPost.posts._id}
                time={
                  selectedPost.posts.updatedAt || selectedPost.posts.createdAt
                }
              />
              {/* comments  */}
              <div className="flex flex-col gap-4 pb-2  pt-8   h-96  xl:h-full overflow-y-scroll">
                {selectedPost.comments.length > 0 ? (
                  selectedPost.comments.map((comment, index) => (
                    <CommentsCard
                      key={index}
                      comment={comment}
                      deleteComment={deleteComment}
                      selectedPost={selectedPost}
                      currentUserId={currentUserId}
                    />
                  ))
                ) : (
                  <div className="text-sm text-center text-gray-400">
                    No comments yet
                  </div>
                )}
              </div>
              {/* post comment */}
              <PostComment
                comment={comment}
                setComment={setComment}
                postUserComment={postUserComment}
                selectedPost={selectedPost}
              />
            </div>
          </div>
        </ModalComponent>
      )}

      {displaySnackbar && (
        <AutoHideSnackbar
          message={snackbarMsg}
          openSnackbar={displaySnackbar}
          setSnackbar={setDisplaySnackbar}
        />
      )}
    </>
  );
};

export default DashboardHome;
