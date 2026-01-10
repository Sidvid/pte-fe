import { div } from "motion/react-client";
import React from "react";
interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
  layout?: "horizontal" | "vertical";
}
const Label = ({
  htmlFor,
  children,
  required = false,
  className = "",
  size = "md",
  layout = "vertical",
}: LabelProps) => {
  const sizeClasses = {
    sm: "text-xs", // Extra small text
    md: "text-sm", // Standard label size (default)
    lg: "text-base", // Normal body text size
    xl: "text-lg", // Large
    xxl: "text-xl", // Extra Large
  };

  return (
    <div>
      <label
        htmlFor={htmlFor}
        className={`block font-medium text-gray-700 mb-1  ${
          sizeClasses[size as keyof typeof sizeClasses]
        } ${className}`}
      >
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    </div>
  );
};

export default Label;
