import React, { useState } from "react";
import { SiGreasyfork } from "react-icons/si";
import { Link } from "react-router-dom";
import TextInput from "../components/TextInput";

const ForgotPassword = () => {
  const [firstName, setFirstName] = useState("");

  return (
    <div className="flex flex-col gap-20  w-full pt-10 px-8 lg:px-24">
      <div className="flex justify-between items-center backdrop-blur-lg  lg:backdrop-blur-0   fixed right-8 lg:right-16 lg:top-12 left-8 lg:left-24">
        <SiGreasyfork className="text-2xl lg:text-4xl   backdrop-blur-lg" />
        <Link
          to={"/"}
          className="border flex  items-center justify-center rounded-lg bg-[#d9d9d9] text-black w-20 h-8 "
        >
          Close
        </Link>
      </div>
      <div className="flex flex-col gap-8 pt-32 items-center justify-evenly  ">
        <div className="flex flex-col items-center w-full md:w-1/2 lg:w-auto   h-full lg:justify-center gap-2">
          <div className="flex flex-col w-full gap-4">
            <h1 className="text-4xl  font-bold tracking-tight">
              Forgot Password
            </h1>
            <p className="md:w-96">
              Enter the email address associated with your account and we will
              send you instructions to reset your password.
            </p>
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
              className="lg:w-96"
            />
            <div className="pt-4">
              <button
                type="submit"
                className="bg-[#B678F0] py-2 text-center w-full lg:w-96 rounded-lg"
              >
                Submit
              </button>
            </div>
            <div className="pt-4 flex gap-1 justify-end">
              <p>Didn't receive an email?</p>
              <button>Resend</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
