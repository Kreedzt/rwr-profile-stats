import React, { useMemo } from "react";
import type { FC } from "react";
import { IAlertProps } from "./types";
import { useCombineClassName } from "../../hooks/useCombineClassName";

const Alert: FC<IAlertProps> = ({ content, className }) => {
  const combineClassName = useCombineClassName(
    "border p-2 tracking-wider leading-normal m-1 rounded-sm",
    [className]
  );

  return <div className={combineClassName}>{content}</div>;
};

export default Alert;
