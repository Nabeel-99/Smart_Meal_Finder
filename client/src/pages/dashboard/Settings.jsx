import React, { useEffect, useState } from "react";
import TextInput from "../../components/formInputs/TextInput";
import SelectInput from "../../components/formInputs/SelectInput";
import {
  dietPreferences,
  exerciseOptions,
  genderOptions,
  goalOptions,
  themeOptions,
} from "../../../../server/utils/helper";
import axios from "axios";
import { FaEyeSlash, FaEye } from "react-icons/fa6";

const Settings = ({
  userData,
  refreshUserData,
  userMetrics,
  refreshSideMenu,
}) => {
  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [email, setEmail] = useState(userData.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingName, setIsChangingName] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isAccount, setIsAccount] = useState(true);
  const [isPreferenecs, setIsPreferences] = useState(false);
  const [isChangingPreferences, setIsChangingPreferences] = useState(false);
  const [gender, setGender] = useState(userMetrics.gender || "");
  const [age, setAge] = useState(userMetrics.age || "");
  const [weight, setWeight] = useState(userMetrics.weight || "");
  const [height, setHeight] = useState(userMetrics.height || "");
  const [exerciseLevel, setExerciseLevel] = useState(
    userMetrics.exerciseLevel || "moderately_active"
  );
  const [goal, setGoal] = useState(userMetrics.goal || "maintenance");
  const [selectedDietaryPreferences, setSelectedDietaryPreferences] = useState(
    userMetrics.dietaryPreferences || []
  );
  const [preferenceSuccess, setPreferenceSuccess] = useState("");
  const [preferenceError, setPreferenceError] = useState("");
  const [showPreferenceSuccess, setShowPreferenceSuccess] = useState("");
  const [showPreferenceError, setShowPreferenceError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEmailSuccess, setShowEmailSuccess] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  const [showError, setShowError] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const showAccount = () => {
    setIsAccount(true);
    setIsPreferences(false);
  };
  const showPreferences = () => {
    setIsPreferences(true);
    setIsAccount(false);
  };

  const toggleEditPreferences = () =>
    setIsChangingPreferences(!isChangingPreferences);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };
  const showPasswordFields = () => setIsChangingPassword(true);
  const closePasswordFields = () => setIsChangingPassword(false);
  const showInput = () => setIsChangingName(!isChangingName);
  const showEmailInput = () => setIsChangingEmail(!isChangingEmail);

  const updateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password) {
      if (password !== confirmPassword) {
        setShowPasswordError(true);
        setPasswordError("Passwords do not match");
        setTimeout(() => {
          setPasswordError("");
        }, 3000);
        return;
      }
    }
    const updatedData = {};
    if (firstName !== userData.firstName) updatedData.firstName = firstName;
    if (lastName !== userData.lastName) updatedData.lastName = lastName;
    if (email !== userData.email) updatedData.email = email;
    if (password) updatedData.password = password;
    try {
      const response = await axios.patch(
        "http://localhost:8000/api/auth/update",
        updatedData,
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.status === 200) {
        setIsChangingName(false);
        setIsChangingEmail(false);
        setIsChangingPassword(false);

        if (updatedData.firstName || updatedData.lastName) {
          setSuccess("Name updated successfully.");
          setShowSuccess(true);
        } else if (updatedData.email) {
          setEmailSuccess("Email updated successfully.");
          setShowEmailSuccess(true);
        } else if (updatedData.password) {
          setPasswordSuccess("Password updated successfully.");
          setShowPasswordSuccess(true);
        }

        await refreshUserData();
        setTimeout(() => {
          setSuccess("");
          setEmailSuccess("");
          setPasswordSuccess("");
          setShowEmailSuccess(false);
          setShowPasswordSuccess(false);
          setShowSuccess(false);
        }, 3000);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      if (error.response && error.response.status === 400) {
        setError("This email already exists");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDietaryPreferenceChange = (e) => {
    const { id, checked } = e.target;
    setSelectedDietaryPreferences((prev) =>
      checked ? [...prev, id] : prev.filter((pref) => pref !== id)
    );
  };

  const updatePreferences = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updateData = {};
    if (age) updateData.age = age;
    if (gender) updateData.gender = gender;
    if (height) updateData.height = height;
    if (weight) updateData.weight = weight;
    if (goal) updateData.goal = goal;
    if (exerciseLevel) updateData.exerciseLevel = exerciseLevel;
    if (selectedDietaryPreferences)
      updateData.dietaryPreferences = selectedDietaryPreferences;
    try {
      const response = await axios.patch(
        "http://localhost:8000/api/users/update-metrics",
        updateData,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        setIsChangingPreferences(false);
        setPreferenceSuccess("Preferences updated successfully.");
        setShowPreferenceSuccess(true);
        setTimeout(() => {
          setShowPreferenceSuccess(false);
          setPreferenceSuccess("");
        }, 3000);
        await refreshSideMenu();
      }
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.status >= 404 &&
        error.response.status <= 500
      ) {
        setError("error updating preferences");
        setPreferenceError("Error updating preferences.");
        setShowPreferenceError(true);
        setTimeout(() => {
          setShowPreferenceError(false);
          setPreferenceSuccess("");
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 pt-28 px-6 lg:px-10">
      <div className="flex sticky top-[69px] pt-8 lg:pt-4 z-20 bg-[#171717] items-center border-b border-b-[#343333] pb-3 gap-10">
        <button
          onClick={showAccount}
          className={`${isAccount ? "" : "text-[#959595]"}`}
        >
          Account
        </button>
        <button
          onClick={showPreferences}
          className={`${isPreferenecs ? "" : "text-[#959595]"}`}
        >
          Preferences
        </button>
      </div>
      {/* account */}
      {isAccount && (
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-start gap-4">
            <div className="text-lg">Name</div>
            {isChangingName ? (
              <div className="">
                <form
                  onSubmit={updateAccount}
                  className="flex flex-col  items-start lg:flex-row lg:items-center gap-3 lg:gap-8"
                >
                  <TextInput
                    label={"First name"}
                    className="w-64"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <TextInput
                    label={"Last name"}
                    className="w-64"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 mt-2 bg-green-600 hover:bg-green-700 rounded-md"
                  >
                    Save
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex gap-4 items-center">
                <p>
                  {userData.firstName} {userData.lastName}
                </p>
                {showSuccess && (
                  <div
                    className={`text-green-500 text-sm mt-1 transition-opacity ease-in-out  duration-1000 ${
                      showSuccess ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {success}
                  </div>
                )}
              </div>
            )}

            <button onClick={showInput} className="text-blue-400 text-sm">
              {isChangingName ? "Cancel" : "Change name"}
            </button>
          </div>
          <div className="flex flex-col items-start gap-4">
            <div className="text-lg">Email</div>
            {showError && (
              <div
                className={`text-red-500 text-sm mt-1 transition-opacity ease-in-out  duration-1000 ${
                  showError ? "opacity-100" : "opacity-0"
                }`}
              >
                {error}
              </div>
            )}
            {isChangingEmail ? (
              <form
                onSubmit={updateAccount}
                className="flex flex-col  items-start lg:flex-row lg:items-center gap-3 lg:gap-8"
              >
                <TextInput
                  className="w-64"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-3 py-1 mb-2 bg-green-600 hover:bg-green-700 rounded-md"
                >
                  Save
                </button>
              </form>
            ) : (
              <div className="flex gap-4 items-center">
                <p>{userData.email}</p>
                {showEmailSuccess && (
                  <div
                    className={`text-green-500 text-sm mt-1 transition-opacity ease-in-out  duration-1000 ${
                      showEmailSuccess ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {emailSuccess}
                  </div>
                )}
              </div>
            )}

            <button onClick={showEmailInput} className="text-blue-400 text-sm">
              {" "}
              {isChangingEmail ? "Cancel" : "Change email"}
            </button>
          </div>
          <div className="flex flex-col border-b border-b-[#343333] pb-4 items-start gap-4">
            <div className="text-lg">Password</div>
            <div className="flex gap-2 items-center">
              <button
                onClick={showPasswordFields}
                className="text-blue-400 text-sm"
              >
                Change password
              </button>
              {showPasswordSuccess && (
                <div
                  className={`text-green-500 text-sm mt-1 transition-opacity ease-in-out  duration-1000 ${
                    showPasswordSuccess ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {passwordSuccess}
                </div>
              )}
            </div>

            {isChangingPassword && (
              <form onSubmit={updateAccount} className="mt-3">
                {showPasswordError && (
                  <div
                    className={`text-red-500 text-sm mt-1 pb-2 transition-opacity ease-in-out  duration-1000 ${
                      showPasswordError ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {passwordError}
                  </div>
                )}
                <div className="relative">
                  <TextInput
                    label={"New Password"}
                    htmlFor={"new-password"}
                    id={"new-password"}
                    type={isPasswordVisible ? "text" : "password"}
                    labelClassName="lg:text-sm"
                    className="lg:w-72 pr-10"
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
                    className="lg:w-72 pr-10"
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
                <div className="flex items-center gap-6">
                  <button
                    onClick={closePasswordFields}
                    type="button"
                    className="px-3 py-1 bg-red-500 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}
          </div>
          <div className="flex flex-col gap-4  border-b border-b-[#343333] pb-4">
            <div>Theme</div>
            <SelectInput options={themeOptions} className="w-44" />
          </div>
          <div className="flex flex-col items-start gap-4 mt-8   pb-4">
            <div>Account</div>
            <button className="text-red-400 hover:text-red-500">
              Delete account
            </button>
          </div>
        </div>
      )}
      {/* Preferences */}
      {isPreferenecs && (
        <div className="flex flex-col items-start gap-4">
          <button onClick={toggleEditPreferences} className="text-blue-400">
            {isChangingPreferences ? "Cancel" : "Edit preferences"}
          </button>
          <form onSubmit={updatePreferences}>
            {showPreferenceError && (
              <div
                className={`text-red-500 text-sm mt-1 pb-2 transition-opacity ease-in-out  duration-1000 ${
                  showPreferenceError ? "opacity-100" : "opacity-0"
                }`}
              >
                {preferenceError}
              </div>
            )}
            <div className="grid  lg:grid-cols-2 lg:gap-10">
              <TextInput
                label={"Age"}
                type={"number"}
                min={0}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                disabled={!isChangingPreferences}
                className={`${
                  isChangingPreferences ? "" : "cursor-not-allowed"
                }`}
              />
              <SelectInput
                label={"Gender"}
                id={"gender"}
                options={genderOptions}
                className={`${
                  isChangingPreferences
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                }`}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={!isChangingPreferences}
              />
              <TextInput
                label={"Height (cm)"}
                type={"number"}
                min={0}
                disabled={!isChangingPreferences}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className={`${
                  isChangingPreferences ? "" : "cursor-not-allowed"
                }`}
              />
              <SelectInput
                label={"Goal"}
                id={"goal"}
                options={goalOptions}
                className={`${
                  isChangingPreferences
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                }`}
                disabled={!isChangingPreferences}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />

              <TextInput
                label={"Weight (kg)"}
                type={"number"}
                value={weight}
                min={0}
                disabled={!isChangingPreferences}
                className={`${
                  isChangingPreferences ? "" : "cursor-not-allowed"
                }`}
                onChange={(e) => setWeight(e.target.value)}
              />

              <SelectInput
                label={"Exercise Level"}
                id={"exercise-level"}
                options={exerciseOptions}
                className={`${
                  isChangingPreferences
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                }`}
                disabled={!isChangingPreferences}
                value={exerciseLevel}
                onChange={(e) => setExerciseLevel(e.target.value)}
              />
            </div>
            <div className=" flex flex-col gap-3">
              <div>Dietary Preferences</div>
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
                    onChange={handleDietaryPreferenceChange}
                    disabled={!isChangingPreferences}
                  />
                </div>
              ))}
            </div>
            {showPreferenceSuccess && (
              <div
                className={`text-green-500 text-sm mt-6 transition-opacity ease-in-out  duration-1000 ${
                  showPreferenceSuccess ? "opacity-100" : "opacity-0"
                }`}
              >
                {preferenceSuccess}
              </div>
            )}
            {isChangingPreferences && (
              <div className="flex items-center mt-10 gap-6">
                <button
                  onClick={toggleEditPreferences}
                  type="button"
                  className="px-3 py-1 bg-red-500 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-green-600 rounded-md"
                >
                  Update
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Settings;
