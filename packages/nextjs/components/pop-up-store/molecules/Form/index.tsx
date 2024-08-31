import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { IntegerVariant, isValidInteger } from "~~/components/scaffold-eth";

export const TextInput = ({
  type,
  name,
  value,
  placeholder,
  onChange,
  isDarkMode,
}: {
  type: React.HTMLInputTypeAttribute;
  name: string;
  value: string | number;
  placeholder: string;
  onChange: (newValue: string, newName: string) => void;
  isDarkMode: boolean;
}) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value, e.target.name);
    },
    [onChange],
  );

  return (
    <div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        className={`w-full ${
          isDarkMode ? "border border-white " : "border border-black"
        } rounded-none py-3 px-4  bg-base-200  text-md focus:outline-none  transition-all duration-500`}
        autoComplete="off"
      />
    </div>
  );
};

export const TextSelect = ({
  type,
  name,
  value,
  placeholder,
  onChange,
  isDarkMode,
  tokens,
}: {
  type: React.HTMLInputTypeAttribute;
  name: string;
  value: string | number;
  placeholder: string;
  onChange: (newValue: string, newName: string) => void;
  isDarkMode: boolean;
  tokens:
    | readonly {
        tokenName: string;
        tokenAddress: string;
      }[]
    | undefined;
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value, e.target.name);
    },
    [onChange],
  );

  const options = tokens?.slice();

  options?.push({ tokenName: "Ethereum", tokenAddress: "" });

  return (
    <div>
      <select
        //type={type}
        name={name}
        //placeholder={placeholder}
        onChange={handleChange}
        value={value}
        className={`w-full ${
          isDarkMode ? "border border-white " : "border border-black"
        } rounded-none py-3 px-4 bg-base-200  text-md focus:outline-none  transition-all duration-500`}
        autoComplete="off"
      >
        <option value="">Select token to pay with</option>
        {options && options.map(({ tokenName }) => <option value={tokenName}>{tokenName}</option>)}
      </select>
    </div>
  );
};
