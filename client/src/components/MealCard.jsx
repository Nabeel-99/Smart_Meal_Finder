import React from "react";
import { Link, useParams } from "react-router-dom";

const MealCard = ({ meal }) => {
  return (
    <div className="">
      <Link to={`/recipe-details/${meal._id}`}>
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
          <div>
            {meal.title.length > 23
              ? meal.title.slice(0, 23).concat("...")
              : meal.title}
          </div>
          <input type="checkbox" />
        </div>
        <div className="text-sm">{meal.calories.toFixed(0)} calories</div>
      </div>
    </div>
  );
};

export default MealCard;
