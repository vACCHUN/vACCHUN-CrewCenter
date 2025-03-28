import React, { forwardRef } from "react";

const Input = forwardRef(function TimeInput({ type = "text", placeholder, defaultValue = "", min, max, onChange, nextRef, className = "" }, ref) {
  const handleInput = (e) => {
    e.target.value = e.target.value.slice(0, 2);
    if (e.target.value.length === 2 && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  const extraProps = {};
  if (min !== undefined) extraProps.min = min;
  if (max !== undefined) extraProps.max = max;

  return <input ref={ref} defaultValue={defaultValue} type={type} placeholder={placeholder} onInput={handleInput} onChange={onChange} className={`border border-solid border-awesomecolor p-[2px] px-2 ${className}`} {...extraProps} />;
});

export default Input;
