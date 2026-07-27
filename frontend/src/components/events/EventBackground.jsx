import React from "react";

export const EventBackground = ({ styleType = "gradient", children, className = "" }) => {
  return (
    <div className={`relative bg-[#09090B] ${className}`}>
      {children}
    </div>
  );
};

export default EventBackground;
