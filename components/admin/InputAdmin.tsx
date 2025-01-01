import React, { useState, useEffect } from "react";

interface InputProps {
  icon: React.ReactNode;
  type?: string;
  placeholder?: string;
  value?: string; // Define value as string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Specify event type
}

type Language = "ar" | "en";

const InputAdmin: React.FC<InputProps> = ({
  icon,
  placeholder,
  type = "text",
  value,
  onChange,
}) => {
  const [language, setLanguage] = useState<Language>("ar"); // Default language is "ar"

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage as Language);
    } else {
      setLanguage("ar");
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "language") {
        setLanguage((event.newValue as Language) || "ar");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div
      className={`flex ${
        language === "ar" ? "flex-row-reverse" : "flex-row"
      } items-center w-full p-4 border border-gray-200 rounded-lg shadow-sm gap-1`}
    >
      <div className="text-blue-500 mr-2">{icon}</div>
      <input
        type={type}
        value={value} // Pass the value prop
        onChange={onChange} // Pass the onChange handler
        dir={language === "ar" ? "rtl" : "ltr"} // Change direction based on language
        className={`outline-none bg-transparent w-full ${language === "ar" ? "text-end placeholder:text-right" : "text-left placeholder:text-left"}`}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputAdmin;
