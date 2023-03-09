import React from "react";
import type { FC } from "react";

type ProgressBarProps = {
  value: number; // 0 ~ 1
};

const ProgressBar: FC<ProgressBarProps> = ({ value }) => {
  return (
    <div className="h-2 w-full bg-gray-300 rounded-md w-full">
      <div
        className="h-2 bg-green-500 rounded-md max-w-full"
        style={{
          width: value + "%",
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
