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
}) => {
  return (
    <div className="flex flex-col  gap-2 pb-4">
      <label htmlFor={htmlFor} className={`text-sm ${labelClassName}`}>
        {label}
      </label>

      <input
        className={`bg-[#171717] border  border-[#1d1d1d] rounded-lg px-3 py-2 ${className}`}
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
