import React from "react";
import type { FC } from "react";

type PropertyItemProps = {
  label: React.ReactNode;
  value: React.ReactNode;
};

const PropertyItem: FC<PropertyItemProps> = ({ label, value }) => {
  return (
    <div className="flex justify-around gap-x-2">
      <span className="flex-1 text-right text-lg font-semibold">{label}:</span>
      <span className="flex-1 text-left text-lg">{value}</span>
    </div>
  );
};

export default PropertyItem;
