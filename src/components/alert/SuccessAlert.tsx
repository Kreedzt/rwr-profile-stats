import React, { useMemo } from "react";
import type { FC } from "react";
import Alert from "./Alert";
import { IAlertProps } from "./types";
import { useCombineClassName } from "../../hooks/useCombineClassName";

const SuccessAlert: FC<IAlertProps> = (props) => {
  const { className, ...otherProps } = props;

  const combineClassName = useCombineClassName(
    "bg-green-100 border-green-300",
    [className]
  );

  return <Alert className={combineClassName} {...otherProps} />;
};

export default SuccessAlert;
