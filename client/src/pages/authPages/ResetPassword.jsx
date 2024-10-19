import React, { useState } from "react";
import { SiGreasyfork } from "react-icons/si";
import { Link, useParams } from "react-router-dom";
import TextInput from "../../components/formInputs/TextInput";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const { token } = useParams();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/reset-password",
        {
          token,
          newPassword: password,
          confirmPassword: confirmPassword,
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        setShowSuccess(true);
        setError(false);
        setSuccess("Password updated successfully. redirecting...");
        setTimeout(() => {
          setSuccess("");
          window.location = "/login";
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
        setShowError(true);
        setTimeout(() => {
          setError("");
        }, 5000);
      }
    }
  };
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
          <div className="flex flex-col items-center  w-full gap-4">
            <h1 className="text-4xl  font-bold tracking-tight">
              Reset Password
            </h1>
            <p className="">Enter a new password for your account.</p>
          </div>
        </div>
        <div className=" w-[0.08px] h-full bg-[#343333]"></div>
        <div className="w-full md:w-1/2 lg:w-auto">
          <form onSubmit={handleSubmit} className="">
            {showError && (
              <div
                className={`text-red-500 text-sm mt-1 pb-4 transition-opacity ease-in-out  duration-1000 ${
                  showError ? "opacity-100" : "opacity-0"
                }`}
              >
                {error}
              </div>
            )}
            {showSuccess && (
              <div
                className={`text-green-500  md:w-96 text-sm mt-1 pb-4 transition-opacity ease-in-out  duration-1000 ${
                  showSuccess ? "opacity-100" : "opacity-0"
                }`}
              >
                {success}
              </div>
            )}
            <div className="relative">
              <TextInput
                label={"New Password"}
                htmlFor={"new-password"}
                id={"new-password"}
                type={isPasswordVisible ? "text" : "password"}
                labelClassName="lg:text-sm"
                className="lg:w-96 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-10"
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="relative">
              <TextInput
                label={"Confirm Password"}
                htmlFor={"confirm-password"}
                id={"confirm-password"}
                type={isConfirmPasswordVisible ? "text" : "password"}
                labelClassName="lg:text-sm"
                className="lg:w-96 pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-10"
                onClick={toggleConfirmPasswordVisibility}
              >
                {isConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="bg-[#B678F0] py-2 text-center w-full lg:w-96 rounded-lg"
              >
                {loading ? (
                  <AiOutlineLoading3Quarters className="spin text-2xl" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
