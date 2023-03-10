import React from "react";
import type { FC } from "react";
import { useCombineClassName } from "../../hooks/useCombineClassName";

export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  loading?: boolean;
};

const Button: FC<ButtonProps> = ({ className, loading, ...otherProps }) => {
  const combineClassName = useCombineClassName(
    "inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm",
    [className]
  );

  return (
    <button
      disabled={loading}
      type="button"
      className={combineClassName}
      {...otherProps}
    />
  );
};

export default Button;
