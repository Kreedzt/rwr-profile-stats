import React from "react";
import type { FC } from "react";
import { useCombineClassName } from "../../hooks/useCombineClassName";
import Button, { ButtonProps } from "./Button";

type PrimaryButtonProps = ButtonProps;

const DangerButton: FC<PrimaryButtonProps> = (props) => {
  const { className, ...otherProps } = props;

  const combineClassName = useCombineClassName(
    "bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-200",
    [className]
  );

  return <Button className={combineClassName} {...otherProps} />;
};

export default DangerButton;
