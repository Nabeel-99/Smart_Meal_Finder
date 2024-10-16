import React from "react";
import { FaTrash } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";

const MealCard = ({
  meals,
  showInput = false,
  showTrash = false,
  showMissingIngredients = false,
  isGridView,
  isListView,
  openDialog,
  sourceType,
}) => {
  console.log("sourceType", sourceType);
  console.log(meals);
  return (
    <>
      <div className="grid grid-col-1  md:grid-cols-2 xl:grid-cols-3 gap-10">
        {meals.map(
          (meal, index) =>
            isGridView && (
              <div className="" key={index}>
                <Link
                  to={`/recipe-details/${meal._id || meal.id}`}
                  state={{ source: sourceType }}
                >
                  <div className="pb-2">
                    <img
                      src={meal.image}
                      alt=""
                      className="w-full h-[250px] object-cover rounded-xl"
                    />
                  </div>
                </Link>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-2">
                      {meal.title.length > 23
                        ? meal.title.slice(0, 23).concat("...")
                        : meal.title}
                    </div>
                    {showInput && <input type="checkbox" />}
                  </div>
                  <div className="text-sm ">
                    {meal.calories.toFixed(0)} calories
                  </div>
                </div>
                {showMissingIngredients && (
                  <p className="text-sm">
                    Missing Ingredients: {meal.missingIngredientsCount}
                  </p>
                )}
                {showTrash && (
                  <div className="flex flex-col justify-end items-end gap-1">
                    <button
                      onClick={() => openDialog(meal._id)}
                      className="hover:text-red-400 transition-all duration-200"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            )
        )}
      </div>
      <div className="flex flex-col gap-10">
        {meals.map(
          (meal, index) =>
            isListView && (
              <div className="flex flex-col gap-6 w-full" key={index}>
                <div className="flex justify-between w-full">
                  <div className="flex w-full gap-4">
                    <Link
                      to={{
                        pathname: `/recipe-details/${meal._id || meal.id}`,
                        state: { source: sourceType },
                      }}
                    >
                      <img
                        src={meal.image}
                        alt=""
                        className={`h-44  w-full md:w-96  lg:w-72 rounded-md bg-[#595959] border border-[#7d7d7d]`}
                      />
                    </Link>
                    <div className="flex flex-col gap-2 w-full">
                      <p>{meal.title}</p>
                      <p>{meal.calories.toFixed(0)} calories</p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    {showInput && <input type="checkbox" />}
                    {showTrash && (
                      <button
                        onClick={() => openDialog(meal._id)}
                        className="hover:text-red-400 transition-all duration-200"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    </>
  );
};

export default MealCard;
