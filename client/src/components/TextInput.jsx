import React from "react";

const TextInput = ({
  htmlFor,
  label,
  id,
  type,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className="flex flex-col  gap-2 pb-4">
      <label htmlFor={htmlFor} className="lg:text-lg ">
        {label}
      </label>

      <input
        className={`bg-[#171717] border w-full border-[#343333] rounded-lg px-3 py-2 + ${className}`}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default TextInput;