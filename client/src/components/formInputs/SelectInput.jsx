import React from "react";

const SelectInput = ({
  id,
  label,
  name,
  options,
  value,
  onChange,
  disabled = false,
  htmlFor,
  className = "",
}) => {
  return (
    <div className="flex flex-col  gap-2 pb-4">
      <label htmlFor={htmlFor} className="lg:text-sm ">
        {label}
      </label>
      <select
        id={id}
        disabled={disabled}
        name={name}
        value={value}
        onChange={onChange}
        className={`bg-[#171717] border cursor-pointer border-[#343333] rounded-lg px-3 py-2 pr-8 appearance-none ${className}`} // Added 'pr-8' and 'appearance-none'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundPosition: "right 1rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1rem",
        }}
      >
        {options.map((option, index) => (
          <option className="" key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
