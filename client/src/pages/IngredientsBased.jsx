import React, { useEffect, useState } from "react";
import IngredientsImg from "../assets/ingredients-slanted.png";
import IngredientsImgMobile from "../assets/ingredients-slanted-mobile.png";
import { FaInfo, FaXmark } from "react-icons/fa6";
import { FaCircleInfo } from "react-icons/fa6";
import TextInput from "../components/formInputs/TextInput";
import { TbCircleDotted } from "react-icons/tb";
import Food1 from "../assets/food1.jpg";
import SkeletonLoader from "../components/SkeletonLoader";
import { json, Link } from "react-router-dom";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { dietPreferences } from "../../../server/utils/helper";
import { Autocomplete, TextField } from "@mui/material";
import ingredientsData from "../../../server/utils/ingredientsHelper.json";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import MealCard from "../components/MealCard";
import { AiOutlineLoading } from "react-icons/ai";

const IngredientsBased = () => {
  const [item, setItem] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [ingredientCount, setIngredientCount] = useState(6);
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [selectedDietaryPreferences, setSelectedDietaryPreferences] = useState(
    []
  );
  const [fetchedRecipes, setFetchedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const addIngredient = () => {
    if (item && !ingredients.includes(item)) {
      setIngredients([...ingredients, item]);
      setItem("");
    }
  };
  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter((item) => item !== ingredient));
  };
  const incrementCount = () => {
    setIngredientCount(ingredientCount + 1);
    if (ingredientCount >= 9) {
      setIngredientCount(9);
    }
  };
  const decrementCount = () => {
    setIngredientCount(ingredientCount - 1);
    if (ingredientCount <= 0) {
      setIngredientCount(0);
    }
  };
  const handleChecboxChange = (e) => {
    const { id, checked } = e.target;
    setSelectedDietaryPreferences((prev) =>
      checked ? [...prev, id] : prev.filter((pref) => pref !== id)
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem("fetchedRecipes");
    setFetchedRecipes([]);
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/recipes/get-ingredients-recipes",
        {
          ingredients: ingredients,
          dietaryPreferences: selectedDietaryPreferences,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const recipes = response.data.recipes;
        const validRecipes = recipes.filter(
          (recipe) =>
            recipe &&
            Array.isArray(recipe.userUsedIngredients) &&
            recipe.userUsedIngredients.length > 0
        );

        localStorage.setItem("fetchRecipes", JSON.stringify(validRecipes));
        setFetchedRecipes(validRecipes);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  console.log("recipes length:", fetchedRecipes.length);
  useEffect(() => {
    const storedRecipes = localStorage.getItem("fetchRecipes");
    if (storedRecipes) {
      setFetchedRecipes(JSON.parse(storedRecipes));
    }
  }, []);
  return (
    <div className="overflow-hidden flex flex-col gap-8 pt-8 justify-center items-center">
      <div className="flex items-center gap-2 text-sm">
        <div className="h-4 w-6 rounded-xl bg-[#361BFF]"></div>
        <p>Ingredients-based</p>
      </div>
      <div className="relative  w-full h-[550px]  flex flex-col items-center">
        <h1 className="text-center text-4xl lg:text-6xl shadow-lg tracking-tighter z-10 font-semibold">
          Prepare a Meal with
          <span className="block">What You Have</span>
        </h1>
        <div className="absolute left-0 bg-gradient-to-r from-[#08090a] from-15% to-transparent lg:shadow-xl lg:drop-shadow-xl h-full w-20 lg:h-3/4 lg:w-72"></div>
        <div className="absolute right-0  bg-gradient-to-l from-[#08090a] from-15% to-transparent lg:shadow-xl lg:drop-shadow-xl h-full w-20 lg:h-3/4 lg:w-72"></div>
        <div className="absolute bottom-12 lg:bottom-0 w-full bg-gradient-to-t  from-[#08090a] from-80% to-transparent h-20 lg:h-44"></div>
        {/* bigger screen */}
        <div className="hidden absolute w-full top-0 md:flex -z-10 items-center justify-center">
          <img src={IngredientsImg} alt="" className="w-full object-contain" />
        </div>
        {/* mobile */}
        <div className="flex absolute w-full -top-0 md:hidden -z-10 items-center justify-center">
          <img
            src={IngredientsImgMobile}
            alt=""
            className="w-full object-contain"
          />
        </div>
      </div>
      <div className="flex flex-col gap-6 items-center   w-full px-2 lg:px-44">
        <div className="flex justify-center w-full lg:justify-end  lg:w-2/3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p>Use your body metrics</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className=" sr-only peer" />
                <div className="w-11 h-6 bg-[#4B4B4B] peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-[#343333] rounded-full peer peer-checked:bg-green-600 transition-colors duration-300"></div>
                <div className="absolute w-5 h-5 bg-white rounded-full shadow-md left-0.5 peer-checked:translate-x-full transition-transform duration-300"></div>
              </label>
            </div>
            <div className="flex gap-1 items-center">
              <FaCircleInfo className="" />
              <p className="text-sm italic text-[#A3A3A3]">
                This requires creating an account
              </p>
            </div>
          </div>
        </div>
        <div className=" lg:relative border border-[#343333] w-96  md:w-2/3 rounded-xl py-2 px-2 bg-[#0E0F10] min-h-[700px] h-full  ">
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-8 p-8 items-center justify-center "
          >
            <div className="text-center text-xl">
              Enter the ingredients you have
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-evenly w-full ">
              <div className="flex flex-col lg:flex-row order-1 lg:order-none items-center gap-6">
                <Autocomplete
                  disablePortal
                  options={ingredientsData}
                  getOptionLabel={(option) => option.name}
                  sx={{
                    width: 350,
                    "& .MuiInputBase-root": {
                      backgroundColor: "#171717",
                      border: "1px solid #343333",
                      color: "white",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#343333",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ffffff",
                    },
                    "& .MuiAutocomplete-popupIndicator": {
                      color: "#ffffff",
                    },
                    "& .MuiAutocomplete-groupLabel": {
                      color: "#08090a",
                    },
                    "& .MuiAutocomplete-clearIndicator": {
                      color: "#ffffff",
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="e.g chicken,pasta,rice..."
                      slotProps={{
                        inputLabel: { style: { color: "#a3a3a3" } },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          height: 15,
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
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4  max-h-44 overflow-auto">
              {ingredients.length > 0 &&
                ingredients.map((ingredient, index) => (
                  <div
                    className="bg-[#dedede] px-3 py-2 rounded-xl text-black flex items-center w-full justify-between"
                    key={index}
                  >
                    <p className="pr-4">{ingredient}</p>
                    <button
                      type="button"
                      onClick={() => removeIngredient(ingredient)}
                    >
                      <FaXmark className="text-red-700 hover:text-red-500" />
                    </button>
                  </div>
                ))}
            </div>
            <div className="flex flex-col items-start  gap-2 ">
              <p className="border-b pb-2 border-b-[#343333]  w-full">
                Dietary Preferences (optional)
              </p>
              {/* checkbox */}
              {dietPreferences.map((pref) => (
                <div className="flex gap-4 items-center" key={pref.id}>
                  <label className="text-lg lg:text-sm  w-32" htmlFor={pref.id}>
                    {pref.name}
                  </label>
                  <input
                    type="checkbox"
                    className="transform scale-150 "
                    id={pref.id}
                    name={pref.id}
                    onChange={handleChecboxChange}
                  />
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-t-[#343333]">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={decrementCount}
                  type="button"
                  className="md:hidden"
                >
                  <BiSolidLeftArrow className="text-2xl" />
                </button>
                <TextInput
                  label={"Specify number of recipes"}
                  type={"number"}
                  min={0}
                  max={9}
                  value={ingredientCount}
                  onChange={(e) => setIngredientCount(e.target.value)}
                  className=" px-3"
                />
                <button
                  onClick={incrementCount}
                  type="button"
                  className="md:hidden"
                >
                  <BiSolidRightArrow className="text-2xl" />
                </button>
              </div>
            </div>
            <div className="pt-10">
              <button
                type="submit"
                disabled={loading}
                className={`bg-[#B678F0] py-2 text-center px-6 w-44 rounded-lg ${
                  loading ? "cursor-not-allowed bg-[#b678f096] " : ""
                }
              `}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        {/* showing results */}
        <div className="flex flex-col gap-3 items-center mt-24">
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <AiOutlineLoading3Quarters className="spin duration-2000 text-[3rem] animate-bounce" />
              <p className="animate-pulse text-3xl">
                Generating meal recommendations...
              </p>
            </div>
          ) : (
            <div className="grid grid-col-1  md:grid-cols-2 xl:grid-cols-3  w-full h-full gap-10">
              {fetchedRecipes.length > 0 ? (
                [...fetchedRecipes]
                  .sort(
                    (a, b) =>
                      a.missingIngredientsCount - b.missingIngredientsCount
                  )
                  .map((recipe, index) => (
                    <MealCard
                      key={index}
                      meal={recipe}
                      showInput={false}
                      showMissingIngredients={true}
                    />
                  ))
              ) : (
                <p className=""></p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col px-8 gap-20 md:flex-row items-start md:items-center border-b border-b-[#343333] pt-20 mt-20 pb-20  md:justify-between md:px-16  xl:justify-around bg-gradient-to-b from-[#08090a] to-[#221300] w-full">
        <div>
          <h2 className="text-2xl  md:text-3xl xl:text-6xl tracking-tighter">
            Want meal recommendations?{" "}
            <span className="block">
              Discover the best choices just for You!
            </span>
          </h2>
        </div>
        <div>
          <Link
            to={"/"}
            className="bg-[#e6e6e6] text-black rounded-md px-4 py-2"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IngredientsBased;
