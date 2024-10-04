import React, { useState } from "react";
import { SiGreasyfork } from "react-icons/si";
import { Link } from "react-router-dom";
import TextInput from "../components/formInputs/TextInput";
import SelectInput from "../components/formInputs/SelectInput";

const Preferences = () => {
  const [getStarted, setGetStarted] = useState(true);
  const themeOptions = ["Light", "Dark", "System theme"];
  const genderOptions = ["male", "female"];
  const goalOptions = ["muscle_gain", "weight_loss", "maintenance"];
  const dietaryPreferences = [
    { name: "Vegetarian", id: "vegetarian" },
    { name: "Vegan", id: "vegan" },
    { name: "Gluten-free", id: "gluten-free" },
    { name: "Dairy-free", id: "dairy-free" },
    { name: "Nut-free", id: "nut-free" },
  ];
  const exerciseOptions = [
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extra_active",
  ];

  return (
    <div className="flex flex-col gap-20  w-full  px-8 lg:px-24">
      <div className="flex justify-between items-center backdrop-blur-lg lg:backdrop-blur-0  fixed right-8 lg:right-16 lg:top-12 left-8 lg:left-24">
        <SiGreasyfork className="text-2xl lg:text-4xl   backdrop-blur-lg" />
        <Link
          to={"/"}
          className="border flex  items-center justify-center rounded-lg bg-[#d9d9d9] text-black w-20 h-8 "
        >
          Close
        </Link>
      </div>
      <div className="flex flex-col gap-8 pt-32 md:pt-28  lg:gap-0 lg:flex-row items-center justify-evenly  ">
        <div className="flex flex-col items-center w-full md:w-1/2 lg:w-auto   h-full lg:justify-center gap-2">
          <div className="flex flex-col  w-full gap-4">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Set up your <span className="block">Preferences</span>
            </h1>
            <p className="">
              We recommend setting up your preferences to{" "}
              <span className="block">help us tailor your experience. </span>
            </p>
          </div>
          <div className="mt-8 mr-4 hidden md:block">
            <SiGreasyfork className="text-2xl lg:text-8xl backdrop-blur-lg" />
          </div>
        </div>
        <div className=" w-[0.08px] h-full bg-[#343333]"></div>
        <div className="w-full md:w-1/2 lg:w-auto">
          <form>
            <div className="grid  lg:grid-cols-2 lg:gap-10">
              <TextInput label={"Age"} type={"number"} />
              <SelectInput
                label={"Gender"}
                id={"gender"}
                options={genderOptions}
              />
              <TextInput label={"Height (cm)"} type={"number"} />
              <SelectInput label={"Goal"} id={"goal"} options={goalOptions} />

              <TextInput label={"Weight (kg)"} type={"number"} />

              <SelectInput
                label={"Exercise Level"}
                id={"exercise-level"}
                options={exerciseOptions}
              />
            </div>
            <div className=" flex flex-col gap-3">
              <div>Dietary Preferences (optional)</div>
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
            <div className="flex flex-col gap-10 mt-8">
              <button
                type="submit"
                className="w-full py-2 bg-[#B678F0] rounded-md"
              >
                Save
              </button>
              <button className="text-[#A3A3A3] flex justify-end">Skip</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
