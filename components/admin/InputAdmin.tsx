import React from "react";

interface InputProps {
  icon: React.ReactNode;
  type?: string;
  placeholder?: string;
}

const InputAdmin: React.FC<InputProps> = ({
  icon,
  placeholder,
  type = "text",
}) => {
  return (
    <div className="flex flex-row-reverse items-center w-full p-4 border border-gray-200 rounded-lg shadow-sm gap-1">
      <div className="text-blue-500 mr-2">{icon}</div>
      <input
        type={type}
        dir="rtl"
        className="outline-none bg-transparent w-full text-end  placeholder:text-right"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputAdmin;
