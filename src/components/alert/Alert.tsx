import React, { useMemo } from "react";
import type { FC } from "react";
import { IAlertProps } from "./types";

const Alert: FC<IAlertProps> = ({ content, className }) => {
  const combineClassName = useMemo(() => {
    return (
      "border p-2 tracking-wider leading-normal m-1 rounded-sm " + className ?? ""
    );
  }, [className]);

  return <div className={combineClassName}>{content}</div>;
};

export default Alert;
