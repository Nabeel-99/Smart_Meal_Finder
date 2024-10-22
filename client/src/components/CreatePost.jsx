import React, { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import TextInput from "./formInputs/TextInput";
import SelectInput from "./formInputs/SelectInput";
import { mealCategories } from "../../../server/utils/helper";
import {
  Autocomplete,
  Button,
  Snackbar,
  TextField,
  Tooltip,
} from "@mui/material";
import { FaArrowLeft, FaArrowRight, FaTrash, FaXmark } from "react-icons/fa6";
import ingredientsData from "../../../server/utils/ingredientsHelper.json";
import { HiOutlineSquare2Stack } from "react-icons/hi2";
import axios from "axios";

const CreatePost = ({ setCreatePost }) => {
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoLink, setVideoLink] = useState(null);
  const [prepTime, setPrepTime] = useState(0);
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [item, setItem] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [category, setCategory] = useState("breakfast");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [displayMsg, setDisplayMsg] = useState(true);
  const [message, setMessage] = useState("");

  const handleNextImage = () => {
    if (currentImageIndex < imagePreviews.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const removeImage = (image) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((i) => i !== image);

      if (updatedImages.length === 0) {
        setCurrentImageIndex(0);
      } else if (currentImageIndex >= updatedImages.length) {
        setCurrentImageIndex(updatedImages.length - 1);
      }
      return updatedImages;
    });
  };

  const addIngredient = () => {
    if (item && !ingredients.includes(item)) {
      setIngredients([...ingredients, item]);
      setItem("");
    }
  };
  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter((item) => item !== ingredient));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setSnackbarOpen(true);
      setSnackbarMessage("You can only upload a maximum of 3 images.");
      return;
    }
    const newImages = files.map((file) => file);
    setImages((prevImages) => [...prevImages, ...newImages]);
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const isLastImage = currentImageIndex === imagePreviews.length - 1;
  const isFirstImage = currentImageIndex === 0;
  useEffect(() => {
    const newImagePreviews = images.map((image) => URL.createObjectURL(image));
    setImagePreviews(newImagePreviews);

    return () => {
      newImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [images]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("instructions", instructions);
    formData.append("ingredients", ingredients);
    formData.append("category", category);
    formData.append("prepTime", prepTime);
    formData.append("videoLink", videoLink);

    images.forEach((image) => {
      formData.append("images", image);
    });
    try {
      const response = await axios.post(
        "http://localhost:8000/api/recipes/post",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      if (response.status === 201) {
        setCreatePost(false);
        setMessage("Your post has been shared");
        setDisplayMsg(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {snackbarOpen && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <div className="flex flex-col gap-3 bg-[#1d1d1d] p-8 rounded-md">
            <div>{snackbarMessage}</div>
            <div className="flex items-end justify-end mt-4">
              <button
                className="bg-blue-600 py-1 w-14 px-2 text-sm rounded-md"
                onClick={handleCloseSnackbar}
              >
                OK
              </button>
            </div>
          </div>
        </Snackbar>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row justify-between items-center overflow-scroll lg:items-stretch p-4 lg:p-12 h-[40rem] w-80 md:w-full xl:w-full  lg:h-[35rem] xl:h-[45rem]"
      >
        <div className="hidden lg:block lg:fixed right-4 top-2  pb-10">
          <button className="text-blue-500 font-semibold hover:text-blue-300">
            Post
          </button>
        </div>

        <div className="relative w-[15rem] lg:w-[200rem] xl:w-[230rem]  border border-[#2a2a2a] rounded-md">
          {imagePreviews.length > 0 ? (
            <div className="flex h-full ">
              <Tooltip title="previous">
                <button
                  className={`absolute flex border backdrop-blur-md hover:bg-[#484848] border-[#676767] p-2 bg-[#1d1d1d] rounded-full items-center justify-center top-[50%] ${
                    isFirstImage ? "hidden" : ""
                  }`}
                  onClick={handlePreviousImage}
                  type="button"
                  disabled={isFirstImage}
                >
                  <FaArrowLeft />
                </button>
              </Tooltip>

              <div className="absolute flex  items-center gap-2  w-full justify-end bottom-2  right-2 ">
                <Tooltip title="delete">
                  <button
                    type="button"
                    onClick={() => removeImage(images[currentImageIndex])}
                    className="flex border hover:bg-[#484848] border-[#676767] p-2 bg-[#1d1d1d] rounded-full items-center  justify-center  "
                  >
                    <FaTrash />
                  </button>
                </Tooltip>
                {images.length < 3 && (
                  <Tooltip title="Add images">
                    <label
                      type="button"
                      htmlFor="file-upload"
                      className="flex flex-col cursor-pointer border hover:bg-[#484848] border-[#676767] p-2 bg-[#1d1d1d] rounded-full items-center  justify-center  "
                    >
                      <HiOutlineSquare2Stack />
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="file-upload"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </Tooltip>
                )}
              </div>

              <img
                src={imagePreviews[currentImageIndex]}
                alt={`uploaded image - ${currentImageIndex + 1}`}
                className=" rounded-md w-full h-[16rem] md:h-[20rem] lg:w-full lg:h-full xl:w-full  xl:h-full object-contain"
              />
              <Tooltip title="next">
                <button
                  className={`absolute flex border backdrop-blur-md hover:bg-[#484848] border-[#676767] p-2 bg-[#1d1d1d] rounded-full right-0 items-center justify-center top-[50%] ${
                    isLastImage ? "hidden" : ""
                  }`}
                  type="button"
                  onClick={handleNextImage}
                  disabled={isLastImage}
                >
                  <FaArrowRight />
                </button>
              </Tooltip>
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-center justify-center w-full h-64 lg:h-[416px] xl:h-full">
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <IoCloudUploadOutline className="text-xl" />
                <div>Upload file</div>
                <div className="text-sm text-[#969696]">
                  maximum of 3 images.
                </div>
              </label>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="file-upload"
                multiple
                onChange={handleImageUpload}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col  pt-8 gap-3  w-full lg:px-4 l lg:w-[200rem] xl:w-[230rem] h-full lg:overflow-scroll">
          <TextInput
            label={"Title"}
            bgColor="bg-[#0c0c0c]"
            className=""
            type={"text"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex flex-col lg:flex-row items-center gap-4 w-full">
            <TextInput
              label={"Cooking time"}
              className="w-full"
              type={"number"}
              min={0}
              bgColor="bg-[#0c0c0c]"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
            />
            <SelectInput
              label={"Category"}
              options={mealCategories}
              id={"category"}
              bgColor="bg-[#0c0c0c]"
              className=" w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3 ">
            <div className="flex flex-col  items-start w-full gap-2">
              <label
                htmlFor="ingredients-autocomplete"
                className="text-sm text-white"
              >
                Ingredients
              </label>
              <div className="flex items-center justify-between w-full gap-2">
                <Autocomplete
                  id="ingredients-autocomplete"
                  disablePortal
                  options={ingredientsData}
                  getOptionLabel={(option) => option.name}
                  sx={{
                    width: 300,
                    "& .MuiInputBase-root": {
                      backgroundColor: "#0c0c0c",
                      borderRadius: "8px",
                      paddingLeft: "12px",
                      paddingRight: "12px",
                      color: "white",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1d1d1d",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ffffff",
                    },
                    "& .MuiAutocomplete-popupIndicator": {
                      color: "#ffffff",
                    },
                    "& .MuiAutocomplete-clearIndicator": {
                      color: "#ffffff",
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="e.g chicken, pasta ..."
                      className="text-sm"
                      sx={{
                        "& .MuiInputBase-input": {
                          height: 15,
                          backgroundColor: "#0c0c0c",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          color: "white",
                        },
                      }}
                    />
                  )}
                  value={autocompleteValue}
                  onChange={(event, value) => {
                    setItem(value.name);
                    setAutocompleteValue(null);
                  }}
                />
                <button
                  onClick={addIngredient}
                  type="button"
                  className="bg-[#D9D9D9]  px-6 h-10 rounded-xl text-black"
                >
                  Add
                </button>
              </div>
            </div>
            <div className=" rounded-md bg-[#0c0c0c] border border-[#1d1d1d] h-44 max-h-44 w-full p-8  overflow-auto  ">
              {" "}
              <div className="grid  gap-2">
                {ingredients.length > 0 &&
                  ingredients.map((ingredient, index) => (
                    <div
                      className="bg-[#2d2d2d] border border-[#444544] px-3 py-2 rounded-xl text-white flex items-center w-full justify-between"
                      key={index}
                    >
                      <p className="pr-4">{ingredient}</p>
                      <button
                        type="button"
                        onClick={() => removeIngredient(ingredient)}
                        className="border border-[#7a7a7a] bg-[#535252] rounded-full p-1 hover:text-white hover:bg-[#34343d]"
                      >
                        <FaXmark className="text-gray-400 hover:text-white " />
                      </button>
                    </div>
                  ))}
              </div>
              {ingredients.length <= 0 && (
                <div className="flex items-center justify-center text-sm h-full">
                  <p>Ingredients added will appear here.</p>
                </div>
              )}
            </div>
          </div>

          <div className="text-sm flex  lg:pb-0 flex-col gap-2">
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              placeholder="Type instructions here"
              className="bg-[#0c0c0c] w-full min-h-52 overflow-scroll border text-sm border-[#1d1d1d] rounded-md px-2 py-2"
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
            />
          </div>
          <div className="lg:hidden pb-12">
            <button
              type="submit"
              className=" bg-blue-600 p-2 w-full rounded-md font-semibold hover:bg-blue-700"
            >
              Create post
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreatePost;
