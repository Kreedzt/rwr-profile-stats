import React from "react";
import type { FC } from "react";

type UpdateTimeProps = {
  content: string;
};

const UpdateTime: FC<UpdateTimeProps> = ({ content }) => {
  return <p className="text-green-500 font-semibold">{content}</p>;
};

export default UpdateTime;
