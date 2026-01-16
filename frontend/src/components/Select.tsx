import { useEffect } from "react";

type SelectParams<T> = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: T[];
  defaultOptionLabel?: string;
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => string;
  className?: string;
  testid?: string;
};

function Select<T>({
  value,
  onChange,
  options,
  defaultOptionLabel = "Please select",
  getOptionLabel = (option: T): string => String(option),
  getOptionValue = (option: T): string => String(option),
  className = "",
  testid = "",
}: SelectParams<T>) {
  useEffect(() => {
    if (options.length === 1 && value !== getOptionValue(options[0])) {
      //@ts-ignore
      onChange({ target: { value: getOptionValue(options[0]) } });
    }
  }, [options]);

  return (
    <select
      data-testid={testid}
      value={value}
      onChange={onChange}
      className={
        "peer rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-1 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" +
        " " +
        className
      }
    >
      {options.length !== 1 && (
        <option value="none">{defaultOptionLabel}</option>
      )}
      {options.map((option, index) => (
        <option key={index} value={getOptionValue(option)}>
          {getOptionLabel(option)}
        </option>
      ))}
    </select>
  );
}

export default Select;
