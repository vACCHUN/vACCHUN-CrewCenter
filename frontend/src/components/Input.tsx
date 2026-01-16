import React, { forwardRef } from "react";

type InputProps = {
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  min?: number;
  max?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextRef?: React.RefObject<HTMLInputElement>;
  className?: string;
  testid?: string;
};

type ExtraProps = {
  min?: number;
  max?: number;
};

const Input = forwardRef<HTMLInputElement, InputProps>(function TimeInput(
  {
    type = "text",
    placeholder,
    defaultValue = "",
    min,
    max,
    onChange,
    nextRef,
    className = "",
    testid = "",
  }: InputProps,
  ref,
) {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.slice(0, 2);
    if (e.target.value.length === 2 && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  const extraProps: ExtraProps = {};
  if (min !== undefined) extraProps.min = min;
  if (max !== undefined) extraProps.max = max;

  return (
    <input
      data-testid={testid}
      ref={ref}
      defaultValue={defaultValue}
      type={type}
      placeholder={placeholder}
      onInput={handleInput}
      onChange={onChange}
      className={`border border-solid border-awesomecolor p-[2px] px-2 ${className}`}
      {...extraProps}
    />
  );
});

export default Input;
