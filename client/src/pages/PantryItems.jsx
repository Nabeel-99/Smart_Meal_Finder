import React, { useState } from "react";
import pantryItems from "../../../server/utils/pantry.json";
import ingredientsData from "../../../server/utils/ingredientsHelper.json";
import { FaXmark } from "react-icons/fa6";
import TextInput from "../components/formInputs/TextInput";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const PantryItems = () => {
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const navigate = useNavigate();

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setSelectedItems((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((item) => item !== value)
        : [...prevSelected, value]
    );
  };
  const selectAllPantry = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedItems([...pantryItems.pantry, ...customItems]);
    } else {
      setSelectedItems([]);
    }
  };

  const allSelected =
    pantryItems.pantry.length + customItems.length > 0 &&
    selectedItems.length === pantryItems.pantry.length + customItems.length;

  const removeItem = (item) => {
    setSelectedItems((prevSelected) => prevSelected.filter((i) => i !== item));
    setCustomItems((prevCustom) => prevCustom.filter((i) => i !== item));
  };
  const addToPantry = () => {
    if (item && !selectedItems.includes(item)) {
      setCustomItems((prevCustom) => [...prevCustom, item]);
      setSelectedItems((prevSelected) => [...prevSelected, item]);
    }
    setItem("");
  };
  const skipToDashboard = () => {
    navigate("/content");
  };
  const savePantryItems = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/create-pantry",
        {
          items: selectedItems,
        },
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.status === 200) {
        setTimeout(() => {
          navigate("/content");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-20  w-full h-full  px-8 lg:px-24">
      <div className="flex flex-col  pt-32 md:pt-28  lg:gap-10 lg:flex-row items-center justify-between h-full  ">
        <div className="flex flex-col items-center w-full lg:w-auto  pb-24  xl:h-full lg:justify-center gap-2">
          <div className="flex flex-col  w-full gap-4">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Let's Get Your<span className="lg:block">Pantry Ready</span>
            </h1>
            <p className="">
              We suggest choosing a few items for your pantry to{" "}
              <span className="lg:block">
                help us customize your experience.{" "}
              </span>
            </p>
          </div>
          <div className="flex flex-col mt-4 justify-start gap-4 items-start w-full">
            <div className="flex items-center  gap-2">
              Select All
              <input
                type="checkbox"
                onChange={selectAllPantry}
                checked={allSelected}
              />
            </div>
            <div className=" gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 items-center xl:items-start justify-center xl:justify-start w-full xl:w-[400px]">
              {pantryItems.pantry.map((pantry, index) => (
                <div className="flex  items-center" key={pantry}>
                  <label className="w-32 ">
                    {" "}
                    {pantry.charAt(0).toUpperCase() +
                      pantry.slice(1).toLowerCase()}
                  </label>
                  <input
                    value={pantry}
                    type="checkbox"
                    className="transform "
                    onChange={handleCheckboxChange}
                    checked={selectedItems.includes(pantry)}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-col lg:flex-row items-center w-full gap-4">
              <Autocomplete
                disablePortal
                options={ingredientsData}
                getOptionLabel={(option) => option.name}
                sx={{
                  width: 300,

                  "& .MuiInputBase-root": {
                    backgroundColor: "#171717",
                    border: "1px solid #343333",
                    color: "white",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#343333",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ffffff",
                  },
                  "& .MuiAutocomplete-popupIndicator": {
                    color: "#ffffff",
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add more pantry items..."
                    variant="outlined"
                    slotProps={{
                      inputLabel: {
                        style: { color: "#a3a3a3" },
                      },
                    }}
                  />
                )}
                value={autocompleteValue}
                onChange={(event, value) => {
                  if (value) {
                    setItem(value.name);
                    setAutocompleteValue(null);
                  }
                }}
              />
              <button
                onClick={addToPantry}
                className="bg-[#199224] mb-2 hover:bg-[#1ead2a] py-2 text-center px-6 rounded-lg"
              >
                Add
              </button>
            </div>

            <div className="flex flex-col items-center lg:flex-row lg:justify-between  mt-6 gap-3 w-full h-full">
              <button
                onClick={savePantryItems}
                disabled={loading}
                className="bg-[#B678F0] py-1 text-center w-full md:w-64  lg:w-44 flex items-center justify-center  rounded-md"
              >
                {loading ? (
                  <AiOutlineLoading3Quarters className="spin text-2xl" />
                ) : (
                  "Save"
                )}
              </button>

              <div className="mt-3 h-full">
                <button
                  onClick={skipToDashboard}
                  className="text-[#A3A3A3] hover:text-[#cacaca]"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden xl:block w-[0.08px] h-full bg-[#343333]"></div>
        <div className=" rounded-md bg-[#222121] h-[600px] max-h-[650px] p-8 w-full xl:w-[650px] xl:max-w-[650px] overflow-auto  ">
          {" "}
          <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
            {selectedItems.length > 0 &&
              selectedItems.map((item, index) => (
                <div
                  className="bg-[#2d2d2d] border border-[#444544] px-3 py-2 rounded-xl text-white flex items-center w-full justify-between"
                  key={index}
                >
                  <p className="pr-4">{item}</p>
                  <button
                    type="button"
                    onClick={() => removeItem(item)}
                    className="border border-[#7a7a7a] bg-[#535252] rounded-full p-1 hover:text-white hover:bg-[#34343d]"
                  >
                    <FaXmark className="text-gray-400 hover:text-white " />
                  </button>
                </div>
              ))}
          </div>
          {selectedItems.length <= 0 && (
            <div className="flex items-center justify-center h-full">
              <p>Your Pantry Items will be displayed here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PantryItems;
