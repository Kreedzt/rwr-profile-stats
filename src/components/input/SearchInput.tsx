import React from "react";
import type { FC } from "react";
import { useCombineClassName } from "../../hooks/useCombineClassName";

type SearchInputProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const SearchInput: FC<SearchInputProps> = ({ className, ...otherProps }) => {
  const combineClassName = useCombineClassName(
    "w-full rounded-md border p-2 border-2 border-blue-0 outline-0 active:border-blue-400 focus:border-blue-400",
    [className ?? ""]
  );

  return <input className={combineClassName} {...otherProps} />;
};

export default SearchInput;
