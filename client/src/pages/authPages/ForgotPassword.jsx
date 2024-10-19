import React, { useEffect, useState } from "react";
import { SiGreasyfork } from "react-icons/si";
import { Link } from "react-router-dom";
import TextInput from "../../components/formInputs/TextInput";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/request-reset-password",
        { email }
      );
      console.log(response.data);
      if (response.status === 200) {
        setShowError(false);
        setShowSuccess(true);
        setSuccess(
          "We've sent a link to your email. Please follow the instructions to proceed."
        );
        setResendTimer(60);
        setTimeout(() => {
          setShowError(false);
          setShowSuccess(false);
          setSuccess("");
        }, 10000);
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 404) {
        setShowError(true);
        setError("An error occurred. Please try again later.");
        setTimeout(() => {
          setShowError(false);
          setError("");
        }, 10000);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/auth/request-reset-password",
        { email }
      );
      if (response.status === 200) {
        setShowError(false);
        setShowSuccess(true);
        setSuccess(
          "We've sent a link to your email. Please follow the instructions to proceed."
        );
        setResendTimer(60);
        setTimeout(() => {
          setShowError(false);
          setShowSuccess(false);
          setSuccess("");
        }, 10000);
      }
    } catch (error) {
      setShowError(true);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [resendTimer]);
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
          <form className="" onSubmit={handleSubmit}>
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
            <TextInput
              label={"Email"}
              htmlFor={"email"}
              id={"email"}
              type={"email"}
              labelClassName="lg:text-lg"
              className="lg:w-96"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#B678F0] py-2 text-center w-full flex items-center justify-center lg:w-96 rounded-lg"
              >
                {loading ? (
                  <AiOutlineLoading3Quarters className="spin text-2xl" />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
            <div className="pt-4 flex gap-1 justify-end">
              <p>Didn't receive an email?</p>
              <button
                onClick={handleResend}
                disabled={resendTimer > 0 || loading}
                className={`${
                  resendTimer > 0
                    ? "cursor-not-allowed text-gray-400"
                    : "hover:text-white hover:underline cursor-pointer"
                }`}
              >
                Resend {resendTimer > 0 && `(${resendTimer}s)`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
