import React, { useEffect, useState } from "react";
import { SiGreasyfork } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "../components/formInputs/TextInput";
import SelectInput from "../components/formInputs/SelectInput";
import AnimationComponent from "../components/AnimationComponent";
import axios from "axios";
import {
  dietPreferences,
  exerciseOptions,
  genderOptions,
  goalOptions,
} from "../../../server/utils/helper";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Preferences = () => {
  const [getStarted, setGetStarted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [exerciseLevel, setExerciseLevel] = useState("moderately_active");
  const [goal, setGoal] = useState("weight_loss");
  const [selectedDietaryPreferences, setSelectedDietaryPreferences] = useState(
    []
  );

  const navigate = useNavigate();

  const handleDietaryPreferenceChange = (e) => {
    const { id, checked } = e.target;
    setSelectedDietaryPreferences((prev) =>
      checked ? [...prev, id] : prev.filter((pref) => pref !== id)
    );
  };

  const skipToDashboard = () => {
    navigate("/dashboard");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/create-metrics",
        {
          gender,
          age,
          weight,
          height,
          exerciseLevel,
          goal,
          dietaryPreferences: selectedDietaryPreferences,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setLoading(true);
        setTimeout(() => {
          navigate("/dashboard");
          setLoading(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setGetStarted(false);
    }, 6000);
  }, []);

  return (
    <div className="flex flex-col gap-20  w-full  px-8 lg:px-24">
      {getStarted ? (
        <AnimationComponent />
      ) : (
        <>
          {/* <div className="flex justify-between items-center backdrop-blur-lg lg:backdrop-blur-0  fixed right-8 lg:right-16 lg:top-12 left-8 lg:left-24">
            <SiGreasyfork className="text-2xl lg:text-4xl   backdrop-blur-lg" />
            <Link
              to={"/"}
              className="border flex  items-center justify-center rounded-lg bg-[#d9d9d9] text-black w-20 h-8 "
            >
              Close
            </Link>
          </div> */}
          <div className="flex flex-col gap-8 pt-32 md:pt-28  lg:gap-0 lg:flex-row items-center justify-evenly  ">
            <div className="flex flex-col items-center w-full md:w-1/2 lg:w-auto   h-full lg:justify-center gap-2">
              <div className="flex flex-col  w-full gap-4">
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  Set up your <span className="block">Preferences</span>
                </h1>
                <p className="">
                  We recommend setting up your preferences to{" "}
                  <span className="block">
                    help us tailor your experience.{" "}
                  </span>
                </p>
              </div>
              <div className="mt-8 mr-4 hidden md:block">
                <SiGreasyfork className="text-2xl lg:text-8xl backdrop-blur-lg" />
              </div>
            </div>
            <div className=" w-[0.08px] h-full bg-[#343333]"></div>
            <div className="w-full md:w-1/2 lg:w-auto">
              <form onSubmit={onSubmit}>
                <div className="grid  lg:grid-cols-2 lg:gap-10">
                  <TextInput
                    label={"Age"}
                    type={"number"}
                    min={0}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                  <SelectInput
                    label={"Gender"}
                    id={"gender"}
                    options={genderOptions}
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <TextInput
                    label={"Height (cm)"}
                    type={"number"}
                    min={0}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                  <SelectInput
                    label={"Goal"}
                    id={"goal"}
                    options={goalOptions}
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  />

                  <TextInput
                    label={"Weight (kg)"}
                    min={0}
                    type={"number"}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />

                  <SelectInput
                    label={"Exercise Level"}
                    id={"exercise-level"}
                    options={exerciseOptions}
                    value={exerciseLevel}
                    onChange={(e) => setExerciseLevel(e.target.value)}
                  />
                </div>
                <div className=" flex flex-col gap-3">
                  <div>Dietary Preferences (optional)</div>
                  {dietPreferences.map((pref) => (
                    <div className="flex gap-4 items-center" key={pref.id}>
                      <label
                        className="text-lg lg:text-sm  w-32"
                        htmlFor={pref.id}
                      >
                        {pref.name}
                      </label>
                      <input
                        type="checkbox"
                        className="transform scale-150 "
                        id={pref.id}
                        name={pref.id}
                        onChange={handleDietaryPreferenceChange}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-10 mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#B678F0] py-2 text-center flex items-center justify-center w-full  rounded-md"
                  >
                    {loading ? (
                      <AiOutlineLoading3Quarters className="spin text-2xl" />
                    ) : (
                      "Save"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={skipToDashboard}
                    className="text-[#A3A3A3] flex justify-end"
                  >
                    Skip
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Preferences;
