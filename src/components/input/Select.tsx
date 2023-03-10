import React from "react";
import type { FC } from "react";
import { useCombineClassName } from "../../hooks/useCombineClassName";

type RankSelectProps = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  className?: string;
  options: Array<{
    label: string;
    value: any;
  }>;
};

const Select: FC<RankSelectProps> = ({ options, className, ...otherProps }) => {
  const combineClassName = useCombineClassName(
    "w-full rounded-md border p-2 border-2 border-blue-0 outline-0 active:border-blue-400 focus:border-blue-400",
    [className]
  );

  return (
    <select className={combineClassName} {...otherProps}>
      {options.map((op) => (
        <option key={op.value} value={op.value}>
          {op.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
