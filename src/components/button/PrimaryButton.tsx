import React, { useMemo } from "react";
import type { FC } from "react";
import { useCombineClassName } from "../../hooks/useCombineClassName";

type PrimaryButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const PrimaryButton: FC<PrimaryButtonProps> = (props) => {
  const { className, ...otherProps } = props;
  const combineClassName = useCombineClassName(
    "inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-blue-200 ",
    [className]
  );

  return <button type="button" className={combineClassName} {...otherProps} />;
};

export default PrimaryButton;
