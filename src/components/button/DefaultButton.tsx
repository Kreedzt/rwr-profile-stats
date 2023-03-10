import React from "react";
import type { FC } from "react";
import { useCombineClassName } from "../../hooks/useCombineClassName";
import Button, { ButtonProps } from "./Button";

type DefaultButtonProps = ButtonProps;

const DefaultButton: FC<DefaultButtonProps> = (props) => {
  const { className, ...otherProps } = props;
  const combineClassName = useCombineClassName(
    "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-200",
    [className]
  );

  return <Button className={combineClassName} {...otherProps} />;
};

export default DefaultButton;
