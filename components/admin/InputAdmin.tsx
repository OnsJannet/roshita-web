import React from "react";

interface InputProps {
  icon: React.ReactNode;
  type?: string;
  placeholder?: string;
  value: string; // Define value as string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Specify event type
}

const InputAdmin: React.FC<InputProps> = ({
  icon,
  placeholder,
  type = "text",
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-row-reverse items-center w-full p-4 border border-gray-200 rounded-lg shadow-sm gap-1">
      <div className="text-blue-500 mr-2">{icon}</div>
      <input
        type={type}
        value={value} // Pass the value prop
        onChange={onChange} // Pass the onChange handler
        dir="rtl"
        className="outline-none bg-transparent w-full text-end placeholder:text-right"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputAdmin;
