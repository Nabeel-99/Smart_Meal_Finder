import React, { useEffect, useState } from "react";
import Food1 from "../assets/food1.jpg";
import { FaBookmark, FaVideo, FaYoutube } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import axios from "axios";
import { generateInstructionsNotInEnglish } from "../../../server/utils/helper";
import { response } from "express";
const RecipeDetails = () => {
  const [recipeDetails, setRecipeDetails] = useState(null);
  const { id } = useParams();

  const fetchRecipeDetails = async () => {
    const storedRecipes = localStorage.getItem("fetchRecipes");

    if (storedRecipes) {
      const recipes = JSON.parse(storedRecipes);
      const foundRecipe = recipes.find(
        (r) => r.id.toString() === id.toString()
      );

      if (foundRecipe) {
        setRecipeDetails(foundRecipe);
        console.log("Recipe found in local storage", foundRecipe);
        return;
      } else {
        console.log("Recipe not found in local storage");
      }
    }
    try {
      const response = await axios.get(
        `http://localhost:8000/api/recipes/get-recipe-details/${id}`
      );
      if (response.status === 200) {
        setRecipeDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching recipe from API", error);
    }
  };

  // const saveRecipe = async () => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8000/api/recipes/save-recipe",
  //       {
  //         ...recipeDetails,
  //       },
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     console.log(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    fetchRecipeDetails();
  }, [id]);

  return (
    <div className="flex flex-col gap-8 pt-8 pb-44 justify-center items-center px-4">
      <div className="flex flex-col items-center justify-center bg-[#0E0F10] w-full md:min-w-[200px] md:max-w-[400px] p-4 lg:min-w-[200px] lg:max-w-[500px] min-h-[100px] border border-[#343333] rounded-xl gap-2">
        <div className="text-xl text-center font-bold">
          {recipeDetails?.title}
        </div>
        <div className="flex items-center gap-6">
          {recipeDetails?.videoLink && (
            <button className="flex items-center border px-3 py-1 rounded-md bg-[#dadada] text-black gap-2">
              Watch Video
              <FaYoutube className="text-xl text-red-500" />
            </button>
          )}
          <button
            // onClick={saveRecipe}
            className="flex py-1 items-center border px-3 rounded-md bg-[#dadada] hover:bg-[#dddbdb] text-black gap-2"
          >
            Save Recipe
            <FaBookmark className="text-xl" />
          </button>
        </div>
      </div>
      <div className="flex flex-col w-full justify-center md:w-[600px] lg:w-auto lg:flex-row gap-10">
        <div className="">
          <img
            src={recipeDetails?.image}
            alt=""
            className="w-full h-[280px] md:w-[600px] md:h-[400px] lg:w-[500px] lg:h-[400px] xl:w-[700px] xl:h-[500px] object-cover rounded-2xl"
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col bg-[#0E0F10] gap-1 overflow-y-scroll min-w-80 lg:max-w-96 border border-[#343333] max-h-[300px] rounded-2xl">
            <div className="bg-[#181818] border-b rounded-t-2xl border-b-[#343333]">
              <h2 className="px-6 py-2">Nutritional Information</h2>
            </div>
            <div className="px-6 overflow-y-scroll pt-4  ">
              <ul className="list-disc">
                {(Array.isArray(recipeDetails?.nutrients)
                  ? recipeDetails.nutrients
                  : Object.entries(recipeDetails?.nutrients || {})
                ).map((nutrient, index) => (
                  <li key={index} className="pb-2 flex items-center w-full">
                    {Array.isArray(recipeDetails?.nutrients) ? (
                      <>
                        <span className="w-32">{nutrient.name}:</span>
                        <span>
                          {nutrient.amount}
                          <span className="pl-1">{nutrient.unit}</span>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="w-32">{nutrient[0]}:</span>
                        <span>{nutrient[1]}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {recipeDetails?.missingIngredients.length > 0 && (
            <div className="flex flex-col bg-[#0E0F10] gap-1 overflow-y-scroll min-w-80 lg:max-w-96 border border-[#343333] max-h-[200px] rounded-2xl">
              <div className="bg-[#181818] border-b rounded-t-2xl border-b-[#343333]">
                <h2 className="px-6 py-2">Missing Ingredients</h2>
              </div>
              <div className="px-6 overflow-y-scroll pt-4  ">
                <ul className="list-disc">
                  {recipeDetails?.missingIngredients.map((item, index) => (
                    <li key={index} className="pb-2 flex items-center w-full">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col w-full md:w-[600px] lg:w-auto justify-center lg:flex-row gap-10">
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
        <div className="flex flex-col bg-[#0E0F10] overflow-y-scroll gap-1 min-w-80 w-full lg:max-w-96 border border-[#343333] rounded-2xl">
          <div className="bg-[#181818] border-b rounded-t-2xl border-b-[#343333]">
            <h2 className="px-6 py-2">Ingredients</h2>
          </div>
          <div className="px-6 overflow-y-scroll pt-4">
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
