import React, { useState } from "react";
import { SiGreasyfork } from "react-icons/si";
import { Link } from "react-router-dom";
import TextInput from "../components/TextInput";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");

  return (
    <div className="flex flex-col gap-20  lg:gap-64 w-full pt-10 px-8 lg:px-24">
      <div className="flex justify-between items-center backdrop-blur-lg  fixed right-8 lg:right-16 lg:top-12 left-8 lg:left-24">
        <SiGreasyfork className="text-2xl lg:text-4xl   backdrop-blur-lg" />
        <Link
          to={"/"}
          className="border flex  items-center justify-center rounded-lg bg-[#d9d9d9] text-black w-20 h-8 "
        >
          Close
        </Link>
      </div>
      <div className="flex flex-col gap-8 pt-32 lg:gap-0 lg:flex-row items-center justify-evenly  ">
        <div className="flex flex-col items-center  w-full md:w-2/3 lg:w-auto  h-full lg:justify-center gap-2">
          <div className="flex flex-col w-full gap-4">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Sign Up
            </h1>
            <p className="">
              Join Smart Meal Finder and{" "}
              <span className="lg:block">
                {" "}
                Personalize Your Meal Experience.
              </span>
            </p>
          </div>
          <div className="mt-8 mr-4 hidden md:block">
            <SiGreasyfork className="text-2xl lg:text-8xl backdrop-blur-lg" />
          </div>
        </div>
        <div className="w-[0.08px] h-full bg-[#343333]"></div>
        <div className="w-full md:w-2/3 lg:w-auto">
          <form className="">
            <TextInput
              label={"First name"}
              htmlFor={"first-name"}
              id={"first-name"}
              type={"text"}
              className="lg:w-96"
            />
            <TextInput
              label={"Last name"}
              htmlFor={"last-name"}
              id={"last-name"}
              type={"text"}
              className="lg:w-96"
            />
            <TextInput
              label={"Email"}
              htmlFor={"email"}
              id={"email"}
              type={"email"}
              className="lg:w-96"
            />
            <TextInput
              label={"Password"}
              htmlFor={"password"}
              id={"password"}
              type={"password"}
              className="lg:w-96"
            />
            <div className="pt-4">
              <button
                type="submit"
                className="bg-[#B678F0] py-2 text-center w-full lg:w-96 rounded-lg"
              >
                Create account
              </button>
            </div>
          </form>

          <div className="flex gap-2 pt-4">
            <p>Already have an account?</p>
            <Link to={"/login"}>Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
