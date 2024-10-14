import React from "react";
import { Link, useParams } from "react-router-dom";

const MealCard = ({
  meal,
  showInput = false,
  showMissingIngredients = false,
}) => {
  console.log(meal);
  const mealId = meal.id || meal._id;
  return (
    <div className="">
      <Link to={`/recipe-details/${mealId}`}>
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
        <div className="text-sm">{meal.calories.toFixed(0)} calories</div>
      </div>
      {showMissingIngredients && (
        <p className="text-sm">
          Missing Ingredients: {meal.missingIngredientsCount}
        </p>
      )}
    </div>
  );
};

export default MealCard;
