import React, { useEffect, useState } from "react";
import MetricsImg from "../assets/background-metrics.png";
import MetricsBg from "../assets/background-circle.svg";
import { FaInfo, FaXmark } from "react-icons/fa6";
import { FaCircleInfo } from "react-icons/fa6";
import TextInput from "../components/formInputs/TextInput";
import { TbCircleDotted } from "react-icons/tb";
import Food1 from "../assets/food1.jpg";
import SkeletonLoader from "../components/SkeletonLoader";
import { Link } from "react-router-dom";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import SelectInput from "../components/formInputs/SelectInput";
import {
  dietPreferences,
  exerciseOptions,
  genderOptions,
  goalOptions,
} from "../../../server/utils/helper";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import MealCard from "../components/MealCard";

const MetricsBased = ({ userData }) => {
  let gridView = true;
  const [ingredientCount, setIngredientCount] = useState(24);
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("");
  const [age, setAge] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [exerciseLevel, setExerciseLevel] = useState("");
  const [selectedDietaryPreferences, setSelectedDietaryPreferences] = useState(
    []
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchedRecipes, setFetchedRecipes] = useState([]);
  const getUserMetrics = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/users/get-user-metrics",
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("user metrics", response.data);
        const metrics = response.data.metrics;
        setAge(metrics.age || "");
        setHeight(metrics.height || "");
        setWeight(metrics.weight || "");
        setGender(metrics.gender || "");
        setGoal(metrics.goal || "");
        setExerciseLevel(metrics.exerciseLevel || "");
        setSelectedDietaryPreferences(metrics.dietaryPreferences || []);
      }
      if (response.status === 404) {
        console.log("User has no metrics");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/recipes/get-metrics-recipes",
        {
          gender: gender,
          age: age,
          height: height,
          weight: weight,
          goal: goal,
          exerciseLevel: exerciseLevel,
          dietaryPreferences: selectedDietaryPreferences,
          numberOfRecipes: ingredientCount,
        },
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.status === 200) {
        const recipes = response.data.recipes;
        sessionStorage.setItem("metricsBased", JSON.stringify(recipes));
        setFetchedRecipes(recipes);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUserMetrics();
  }, []);

  useEffect(() => {
    if (userData) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [userData]);

  useEffect(() => {
    const storedRecipes = sessionStorage.getItem("metricsBased");
    if (storedRecipes) {
      setFetchedRecipes(JSON.parse(storedRecipes));
    }
  }, []);
  return (
    <div className="overflow-hidden flex flex-col gap-8 pt-8 justify-center items-center">
      <div className="flex items-center gap-2 pt-20 text-sm">
        <div className="h-4 w-6 rounded-xl bg-[#d08824]"></div>
        <p>Metrics-based</p>
      </div>
      <div className="  w-full h-[300px] lg:h-[550px]  flex flex-col items-center">
        <h1 className="text-center text-2xl lg:text-6xl shadow-lg tracking-tighter z-10 font-semibold">
          Plan from Body Metrics
          <span className="block">to Meal Recommendations</span>
        </h1>
        <div className="hidden lg:flex absolute  top-40 left-0 bg-gradient-to-r from-[#08090a] from-15% to-transparent lg:shadow-xl lg:drop-shadow-xl h-full w-20 lg:h-3/4 lg:w-96"></div>
        <div className="hidden lg:flex absolute right-0 top-40  bg-gradient-to-l from-[#08090a] from-15% to-transparent lg:shadow-xl lg:drop-shadow-xl h-full w-20 lg:h-3/4 lg:w-96"></div>

        <div className="absolute w-screen -top-8 lg:top-24 lg:rotate-180  md:flex -z-10 items-center justify-center">
          <img
            src={MetricsBg}
            alt=""
            className="w-[3000px] h-[600px] object-contain lg:object-fill "
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 items-center  w-full px-2 lg:px-44">
        <div className=" lg:relative border border-[#1d1d1d] w-96  md:w-auto   rounded-xl py-2 px-2 bg-[#0E0F10] min-h-[700px] h-full  ">
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-8 p-8 lg:px-14 items-start justify-center "
          >
            <div className="text-center text-xl">Enter your Body Metrics</div>
            <div className="text-sm border-b pb-2 border-b-[#343333] w-full">
              Personal Information
            </div>
            <div className="flex flex-col text-sm lg:flex-row  gap-8 ">
              <SelectInput
                label={"Gender"}
                id={"gender"}
                options={genderOptions}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-72 cursor-pointer"
              />
              <TextInput
                label={"Age"}
                id={"age"}
                htmlFor={"age"}
                type={"number"}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-72 cursor-pointer"
              />
            </div>
            <div className="text-sm border-b pb-2 border-b-[#343333] w-full">
              Body Measurements / Fitness Goals
            </div>
            <div className="grid lg:grid-cols-2 gap-8 gap-y-4 ">
              <TextInput
                label={"Height(cm)"}
                id={"height"}
                min={0}
                htmlFor={"height"}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                type={"number"}
                className="w-72 cursor-pointer"
              />
              <TextInput
                label={"Weight(kg)"}
                id={"weight"}
                min={0}
                htmlFor={"weight"}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                type={"number"}
                className="w-72 cursor-pointer"
              />
              <SelectInput
                label={"Goal"}
                id={"goal"}
                options={goalOptions}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-72 cursor-pointer"
              />
              <SelectInput
                label={"Exercise Level"}
                id={"exercise-level"}
                options={exerciseOptions}
                value={exerciseLevel}
                onChange={(e) => setExerciseLevel(e.target.value)}
                className="w-72 cursor-pointer"
              />
            </div>

            <div className="flex flex-col items-start w-full  gap-2 ">
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
                    checked={selectedDietaryPreferences.includes(pref.id)}
                    onChange={handleChecboxChange}
                  />
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-t-[#343333] w-full">
              <div className="flex items-center gap-4">
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
                  max={30}
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

            <div className="pt-10 flex items-center w-full ">
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
          ) : fetchedRecipes.length > 0 ? (
            <MealCard
              meals={[...fetchedRecipes].sort(
                (a, b) => a.calories - b.calories
              )}
              showInput={false}
              isGridView={gridView}
              sourceType={"metricsBased"}
            />
          ) : (
            <p className=""></p>
          )}
        </div>
      </div>
      {!isLoggedIn && (
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
              to={"/login"}
              className="bg-[#e6e6e6] text-black rounded-md px-4 py-2"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsBased;
