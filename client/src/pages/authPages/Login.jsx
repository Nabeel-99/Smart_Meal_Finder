import React, { useState } from "react";
import { SiGreasyfork } from "react-icons/si";
import { Link } from "react-router-dom";
import TextInput from "../../components/formInputs/TextInput";

const Login = () => {
  const [firstName, setFirstName] = useState("");

  return (
    <div className="flex flex-col gap-20  w-full pt-10 px-8 lg:px-24">
      <div className="flex justify-between items-center backdrop-blur-lg lg:backdrop-blur-0  fixed right-8 lg:right-16 lg:top-12 left-8 lg:left-24">
        <SiGreasyfork className="text-2xl lg:text-4xl   backdrop-blur-lg" />
        <Link
          to={"/"}
          className="border flex  items-center justify-center rounded-lg bg-[#d9d9d9] text-black w-20 h-8 "
        >
          Close
        </Link>
      </div>
      <div className="flex flex-col gap-8 pt-32 md:pt-40 lg:pt-44 lg:gap-0 lg:flex-row items-center justify-evenly  ">
        <div className="flex flex-col items-center w-full md:w-1/2 lg:w-auto   h-full lg:justify-center gap-2">
          <div className="flex flex-col  w-full gap-4">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Log in
            </h1>
            <p className="">
              Discover Smart Meals Tailored to your{" "}
              <span className="block">Ingredients and Goals.</span>
            </p>
          </div>
          <div className="mt-8 mr-4 hidden md:block">
            <SiGreasyfork className="text-2xl lg:text-8xl backdrop-blur-lg" />
          </div>
        </div>
        <div className=" w-[0.08px] h-full bg-[#343333]"></div>
        <div className="w-full md:w-1/2 lg:w-auto">
          <form className="">
            <TextInput
              label={"Email"}
              htmlFor={"email"}
              id={"email"}
              type={"email"}
              labelClassName="lg:text-lg"
              className="lg:w-96"
            />
            <TextInput
              label={"Password"}
              htmlFor={"password"}
              id={"password"}
              type={"password"}
              labelClassName="lg:text-lg"
              className="lg:w-96"
            />
            <div className="flex justify-end pb-4">
              <Link to={"/forgot-password"}>Forgot password?</Link>
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="bg-[#B678F0] py-2 text-center w-full lg:w-96 rounded-lg"
              >
                Login
              </button>
            </div>
          </form>

          <div className="flex gap-2 pt-4">
            <p>Don't have an account?</p>
            <Link to={"/sign-up"}>Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
