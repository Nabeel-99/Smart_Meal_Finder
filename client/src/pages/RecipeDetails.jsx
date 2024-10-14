import React, { useEffect, useState } from "react";
import Food1 from "../assets/food1.jpg";
import { FaBookmark } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import axios from "axios";
const RecipeDetails = () => {
  const [recipeDetails, setRecipeDetails] = useState(null);
  const { id } = useParams();
  const fetchRecipeDetails = async () => {
    try {
      if (!isNaN(id)) {
        const storedRecipes = JSON.parse(
          localStorage.getItem("fetchedRecipes")
        );
        const localRecipe = storedRecipes[id];
        if (localRecipe) {
          setRecipeDetails(localRecipe);
        } else {
          console.log("No recipe found in localstorage");
        }
      } else {
        const response = await axios.get(
          `http://localhost:8000/api/recipes/get-recipe-details/${id}`
        );
        if (response.status === 200) {
          console.log(response.data);
          setRecipeDetails(response.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(recipeDetails);
  useEffect(() => {
    fetchRecipeDetails();
  }, [id]);
  return (
    <div className="flex flex-col gap-8 pt-8 pb-44 justify-center items-center px-4">
      <div className="flex flex-col items-center justify-center bg-[#0E0F10] w-full  md:min-w-[200px] md:max-w-[400px] lg:min-w-[400px] lg:max-w-[600px] min-h-[100px] border border-[#343333] rounded-xl gap-2">
        <div className="text-xl font-bold">{recipeDetails?.title}</div>
        <button className="flex items-center border px-3 rounded-md bg-[#dadada] text-black gap-2">
          Save Recipe
          <FaBookmark className="text-xl" />
        </button>
      </div>
      <div className="flex flex-col w-full justify-center md:w-[600px] lg:w-auto lg:flex-row gap-10">
        <div className="">
          <img
            src={recipeDetails?.image}
            alt=""
            className="w-full h-[280px] md:w-[600px] md:h-[400px] lg:w-[500px] lg:h-[400px] xl:w-[700px] xl:h-[500px] object-cover rounded-2xl"
          />
        </div>
        <div className="flex flex-col bg-[#0E0F10] gap-1 overflow-y-scroll  min-w-80 lg:max-w-96 border border-[#343333] rounded-2xl">
          <div className="bg-[#181818] border-b rounded-t-2xl border-b-[#343333]">
            <h2 className="px-6 py-2">Nutritional Information</h2>
          </div>
          <div className="px-6 overflow-y-scroll pt-4">
            <ul className="list-disc">
              {Array.from({ length: 10 }).map((_, index) => (
                <li key={index} className="pb-2">
                  Item {index + 1}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full  md:w-[600px] lg:w-auto justify-center lg:flex-row gap-10">
        <div className="flex flex-col bg-[#0E0F10] overflow-y-scroll gap-1 w-full h-[380px] md:w-[600px] md:h-[400px] lg:w-[500px] lg:h-[400px] xl:w-[700px] xl:h-[500px] border order-1 lg:order-none border-[#343333] rounded-2xl">
          <div className="bg-[#181818] border-b rounded-t-2xl border-b-[#343333]">
            <h2 className="px-6 py-2">Steps to Prepare</h2>
          </div>
          <div className="px-6 overflow-y-scroll pt-4">
            <ul className="list-disc">
              {recipeDetails?.instructions.map((instruction, index) => (
                <li key={index} className="pb-2">
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col bg-[#0E0F10] overflow-y-scroll  gap-1 min-w-80 w-full lg:max-w-96 border border-[#343333] rounded-2xl">
          <div className="bg-[#181818] border-b rounded-t-2xl border-b-[#343333]">
            <h2 className="px-6 py-2">Ingredients</h2>
          </div>
          <div className="px-6 overflow-y-scroll  pt-4">
            <ul className="list-disc">
              {recipeDetails?.ingredients.map((ingredient, index) => (
                <li key={index} className="pb-2">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
