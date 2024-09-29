import React, { useState } from "react";
import MetricsImg from "../assets/background-metrics.png";
import MetricsBg from "../assets/background-circle.svg";
import { FaInfo, FaXmark } from "react-icons/fa6";
import { FaCircleInfo } from "react-icons/fa6";
import TextInput from "../components/TextInput";
import { TbCircleDotted } from "react-icons/tb";
import Food1 from "../assets/food1.jpg";
import SkeletonLoader from "../components/SkeletonLoader";
import { Link } from "react-router-dom";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import SelectInput from "../components/SelectInput";

const MetricsBased = () => {
  const [item, setItem] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [ingredientCount, setIngredientCount] = useState(6);
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("");
  const [age, setAge] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [exerciseLevel, setExerciseLevel] = useState("");
  const genderOptions = ["male", "female"];
  const goalOptions = ["muscle_gain", "weight_loss", "maintenance"];
  const exerciseOptions = [
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extra_active",
  ];
  const dietaryPreferences = [
    { name: "Vegetarian", id: "vegetarian" },
    { name: "Vegan", id: "vegan" },
    { name: "Gluten-free", id: "gluten-free" },
    { name: "Dairy-free", id: "dairy-free" },
    { name: "Nut-free", id: "nut-free" },
  ];
  const addIngredient = () => {
    if (item) {
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
  const onSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="overflow-hidden flex flex-col gap-8 pt-8 justify-center items-center">
      <div className="flex items-center gap-2 pt-20 text-sm">
        <div className="h-4 w-6 rounded-xl bg-[#361BFF]"></div>
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
        <div className=" lg:relative border border-[#343333] w-96  md:w-auto   rounded-xl py-2 px-2 bg-[#0E0F10] min-h-[700px] h-full  ">
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
                className="w-72"
              />
              <TextInput
                label={"Age"}
                id={"age"}
                htmlFor={"age"}
                type={"number"}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-72"
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
                className="w-72"
              />
              <TextInput
                label={"Weight(kg)"}
                id={"weight"}
                min={0}
                htmlFor={"weight"}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                type={"number"}
                className="w-72"
              />
              <SelectInput
                label={"Goal"}
                id={"goal"}
                options={goalOptions}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-72"
              />
              <SelectInput
                label={"Exercise Level"}
                id={"exercise-level"}
                options={exerciseOptions}
                value={exerciseLevel}
                onChange={(e) => setExerciseLevel(e.target.value)}
                className="w-72"
              />
            </div>

            <div className="flex flex-col items-start w-full  gap-2 ">
              <p className="border-b pb-2 border-b-[#343333]  w-full">
                Dietary Preferences (optional)
              </p>
              {/* checkbox */}
              {dietaryPreferences.map((pref) => (
                <div className="flex gap-4 items-center" key={pref.id}>
                  <label className="text-lg lg:text-sm  w-32" htmlFor={pref.id}>
                    {pref.name}
                  </label>
                  <input
                    type="checkbox"
                    className="transform scale-150 "
                    id={pref.id}
                    name={pref.id}
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

            <div className="pt-10 flex items-center w-full ">
              <button
                type="submit"
                className="bg-[#B678F0] py-2 text-center px-6 w-full lg:w-44 rounded-lg"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        {/* showing results */}
        <div className="flex flex-col gap-3 items-center mt-24">
          {/* <TbCircleDotted className="spin duration-2000 text-4xl" />
          <p className="">Generating meal recommendations</p> */}

          <div className="flex flex-col ">
            {/* <SkeletonLoader count={ingredientCount} /> */}
            {/* <div className="flex flex-col gap-1 text-[#c7c6c6] cursor-pointer hover:text-white">
              <img
                src={Food1}
                alt=""
                className="w-[300px] h-[250px] object-cover rounded-2xl"
              />
              <p className="">Chicken Fried Rice</p>
            </div> */}
          </div>
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

export default MetricsBased;
