import React from "react";

const TextInput = ({
  htmlFor,
  label,
  id,
  type,
  value,
  onChange,
  className = "",
  labelClassName = "",
  placeholder,
  max,
  min,
  disabled = false,
  bgColor = "",
  inputWidth = "",
}) => {
  return (
    <div
      className={`flex flex-col  gap-2 pb-4 ${
        inputWidth ? inputWidth : "w-full"
      }`}
    >
      <label
        htmlFor={htmlFor}
        className={`${labelClassName ? labelClassName : "text-sm"}`}
      >
        {label}
      </label>

      <input
        className={`${
          bgColor ? bgColor : "bg-[#171717]"
        } border  border-[#1d1d1d] rounded-lg px-3 py-2 ${className}`}
        id={id}
        min={min}
        max={max}
        disabled={disabled}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default TextInput;
