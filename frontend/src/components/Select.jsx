import React, { useEffect } from "react";

function Select({ value, onChange, options, defaultOptionLabel = "Please select", getOptionLabel = (option) => option, getOptionValue = (option) => option, className = "" }) {
  useEffect(() => {
    if (options.length === 1 && value !== getOptionValue(options[0])) {
      onChange({ target: { value: getOptionValue(options[0]) } });
    }
  }, [options]);

  return (
    <select value={value} onChange={onChange} className={"peer rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-1 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" + " " + className}>
      {options.length !== 1 && <option value="none">{defaultOptionLabel}</option>}
      {options.map((option, index) => (
        <option key={index} value={getOptionValue(option)}>
          {getOptionLabel(option)}
        </option>
      ))}
    </select>
  );
}

export default Select;
