import React, { FC } from "react";
import { VERSION } from "../../constants";

const MainFooter: FC = () => {
  return (
    <div className="relative bg-blue-light isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 py-2.5 px-6 sm:px-3.5 sm:before:flex-1">
      <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-4">
        <p className="text-sm leading-6 text-gray-900 m-0">
          <strong className="font-semibold">v:{VERSION}</strong>
          <svg
            viewBox="0 0 2 2"
            className="mx-2 inline h-0.5 w-0.5 fill-current"
            aria-hidden="true"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          RWR 信息查询系统
        </p>
      </div>
    </div>
  );
};

export default MainFooter;
