import React, { useMemo } from "react";
import type { FC } from "react";

type SearchInputProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const SearchInput: FC<SearchInputProps> = ({ className, ...otherProps }) => {
  const combineClassName = useMemo(() => {
    return (
      "w-full rounded-md border p-2 border-2 border-blue-0 outline-0 active:border-blue-400 focus:border-blue-400" +
        " " +
        className ?? ""
    );
  }, [className]);

  return <input className={combineClassName} {...otherProps} />;
};

export default SearchInput;
