import React from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface CustomInputProps {
  icon?: React.ReactNode; // Icon to show in front of the input
  type: "text" | "number"; // Accepts either "text" or "number"
  placeholder?: string; // Optional placeholder
  className?: string; // Optional custom classes for further styling
}

const CustomInput: React.FC<CustomInputProps> = ({
  icon,
  type,
  placeholder,
  className,
}) => {
  return (
    <div className="flex flex-row-reverse items-center space-x-2 border border-input rounded-md px-3 py-1 w-1/2">
      {/* Conditionally render the icon */}
      {icon && <div className="text-gray-500">{icon}</div>}

      {/* The actual input field */}
      <Input
        type={type}
        placeholder={placeholder}
        className={cn("flex-1", className)} // Allow the input to take remaining space
      />
    </div>
  );
};

export default CustomInput;
