import React, { useState } from "react";
import TextInput from "../../components/formInputs/TextInput";
import SelectInput from "../../components/formInputs/SelectInput";
import {
  dietPreferences,
  exerciseOptions,
  genderOptions,
  goalOptions,
} from "../../../../server/utils/helper";
const Settings = ({ userData }) => {
  const [name, setName] = useState("");
  const [isChangingName, setIsChangingName] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [isAccount, setIsAccount] = useState(true);
  const [isPreferenecs, setIsPreferences] = useState(false);
  const [userPreferences, setUserPreferences] = useState(false);
  const showAccount = () => {
    setIsAccount(true);
    setIsPreferences(false);
  };
  const showPreferences = () => {
    setIsPreferences(true);
    setIsAccount(false);
  };

  const toggleEditPreferences = () => setUserPreferences(!userPreferences);

  const showPasswordFields = () => setChangePassword(true);
  const closePasswordFields = () => setChangePassword(false);
  const showInput = () => setIsChangingName(!isChangingName);

  const themeOptions = ["Light", "Dark", "System theme"];

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
                <form className="flex flex-col  items-start lg:flex-row lg:items-center gap-3 lg:gap-8">
                  <TextInput
                    className="w-72"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <button className="px-3 py-1 mb-2 bg-green-600 hover:bg-green-700 rounded-md">
                    Save
                  </button>
                </form>
              </div>
            ) : (
              <p>
                {userData.firstName} {userData.lastName}
              </p>
            )}

            <button onClick={showInput} className="text-blue-400 text-sm">
              {isChangingName ? "Cancel" : "Change name"}
            </button>
          </div>
          <div className="flex flex-col items-start gap-4">
            <div className="text-lg">Email</div>
            <p>{userData.email}</p>
            <button className="text-blue-400 text-sm">Change email</button>
          </div>
          <div className="flex flex-col border-b border-b-[#343333] pb-4 items-start gap-4">
            <div className="text-lg">Password</div>
            <button
              onClick={showPasswordFields}
              className="text-blue-400 text-sm"
            >
              Change password
            </button>
            {changePassword && (
              <form className="mt-7">
                <TextInput
                  label={"New Password"}
                  htmlFor={"new-password"}
                  id={"new-password"}
                  type={"password"}
                  labelClassName="lg:text-sm"
                  className="lg:w-96"
                />
                <TextInput
                  label={"Confirm Password"}
                  htmlFor={"confirm-password"}
                  id={"confirm-password"}
                  type={"password"}
                  labelClassName="lg:text-sm"
                  className="lg:w-96"
                />
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
                    className="px-3 py-1 bg-green-600 rounded-md"
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
            {userPreferences ? "Cancel" : "Edit preferences"}
          </button>
          <form>
            <div className="grid  lg:grid-cols-2 lg:gap-10">
              <TextInput
                label={"Age"}
                type={"number"}
                disabled={!userPreferences}
                className={`${userPreferences ? "" : "cursor-not-allowed"}`}
              />
              <SelectInput
                label={"Gender"}
                id={"gender"}
                options={genderOptions}
                className={`${userPreferences ? "" : "cursor-not-allowed"}`}
                disabled={!userPreferences}
              />
              <TextInput
                label={"Height (cm)"}
                type={"number"}
                disabled={!userPreferences}
                className={`${userPreferences ? "" : "cursor-not-allowed"}`}
              />
              <SelectInput
                label={"Goal"}
                id={"goal"}
                options={goalOptions}
                className={`${userPreferences ? "" : "cursor-not-allowed"}`}
                disabled={!userPreferences}
              />

              <TextInput
                label={"Weight (kg)"}
                type={"number"}
                disabled={!userPreferences}
                className={`${userPreferences ? "" : "cursor-not-allowed"}`}
              />

              <SelectInput
                label={"Exercise Level"}
                id={"exercise-level"}
                options={exerciseOptions}
                className={`${userPreferences ? "" : "cursor-not-allowed"}`}
                disabled={!userPreferences}
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
                  />
                </div>
              ))}
            </div>
            {userPreferences && (
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
