import { useMemo } from "react";

export const useCombineClassName = (
  baseClassName: string,
  depsClassNameList: Array<string | undefined>
) => {
  return useMemo<string>(() => {
    let resClassName = baseClassName;

    depsClassNameList.forEach((clsName) => {
      if (clsName) {
        resClassName += ` ${clsName}`;
      }
    });

    return resClassName;
  }, depsClassNameList);
};
