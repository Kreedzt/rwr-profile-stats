import React, { useMemo } from "react";
import type { FC } from "react";
import { IAlertProps } from "./types";
import Alert from "./Alert";
import { useCombineClassName } from "../../hooks/useCombineClassName";

const WarnAlert: FC<IAlertProps> = (props) => {
  const { className, ...otherProps } = props;

  const combineClassName = useCombineClassName(
    "bg-yellow-100 border-yellow-300",
    [className]
  );

  return <Alert className={combineClassName} {...otherProps} />;
};

export default WarnAlert;
