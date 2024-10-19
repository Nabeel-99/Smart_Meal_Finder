import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ingredientsData from "../../../../server/utils/ingredientsHelper.json";
import { FaXmark } from "react-icons/fa6";
import pantryItems from "../../../../server/utils/pantry.json";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const PantryPage = () => {
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [isEditingPantry, setIsEditingPantry] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showUpdateError, setShowUpdateError] = useState(false);

  const showEditPantry = () => setIsEditingPantry(!isEditingPantry);
  const fetchPantryItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/users/get-user-pantry",
        { withCredentials: true }
      );
      console.log(response.data);
      setSelectedItems(response.data.userPantry.items);
    } catch (error) {
      console.log(error);
    }
  };
  const updatePantry = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.patch(
        "http://localhost:8000/api/users/update-pantry",
        {
          items: selectedItems,
        },
        { withCredentials: true }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const selectAllPantry = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedItems([...new Set([...selectedItems, ...pantryItems.pantry])]);
    } else {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((item) => !pantryItems.pantry.includes(item))
      );
    }
  };
  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setSelectedItems((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((item) => item !== value)
        : [...prevSelected, value]
    );
  };

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
  const allSelected = pantryItems.pantry.every((item) =>
    selectedItems.includes(item)
  );

  useEffect(() => {
    fetchPantryItems();
  }, []);
  return (
    <div className="flex flex-col  w-full h-full  px-8 ">
      <div className="pt-32 md:pt-28   w-full   ">
        <button onClick={showEditPantry} className="text-blue-400 text-sm">
          {isEditingPantry ? "Cancel" : "Edit Pantry"}
        </button>
      </div>
      <div className="flex flex-col gap-8 pt-8 md:pt-8  lg:gap-0 lg:flex-row w-full   h-full  ">
        {isEditingPantry && (
          <div className="flex flex-col items-center w-full  pb-24   gap-2">
            <div className="flex flex-col mt-4 items-start  xl:justify-start gap-4 w-full">
              <div className="flex items-center   gap-2">
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
                    width: {
                      xs: "90%",
                      sm: "80%",
                      md: "70%",
                      lg: "60%",
                    },
                    maxWidth: "400px",
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
              <div className="flex items-center justify-center lg:justify-start mt-6 gap-3 w-full h-full">
                <button
                  onClick={updatePantry}
                  disabled={loading}
                  className="bg-[#B678F0] py-1 text-center w-44 flex items-center justify-center  rounded-md"
                >
                  {loading ? (
                    <AiOutlineLoading3Quarters className="spin text-2xl" />
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          className={` rounded-md bg-[#222121] max-h-[650px] p-8 w-full  overflow-auto  `}
        >
          {" "}
          <div
            className={`grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2 ${
              !isEditingPantry ? "lg:grid-cols-3 xl:grid-cols-4" : ""
            }`}
          >
            {selectedItems.length > 0 &&
              selectedItems.map((item, index) => (
                <div
                  className="bg-[#2d2d2d] border border-[#444544] px-3 py-2 rounded-xl text-white flex items-center w-full justify-between"
                  key={index}
                >
                  <p className="pr-4 ">{item}</p>
                  {isEditingPantry && (
                    <button
                      type="button"
                      onClick={() => removeItem(item)}
                      className="border border-[#7a7a7a] bg-[#535252] rounded-full p-1 hover:text-white hover:bg-[#34343d]"
                    >
                      <FaXmark className="text-gray-400 hover:text-white " />
                    </button>
                  )}
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

export default PantryPage;
