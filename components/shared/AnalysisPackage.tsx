import React, { useState, useEffect } from "react";
import DeleteButton from "../layout/DeleteButton";

interface AnalysisPackageProps {
  title: string;
  subtitle: string;
  onEdit: () => void;
  onDelete: () => void;
}

type Language = "ar" | "en";

const AnalysisPackage: React.FC<AnalysisPackageProps> = ({
  title,
  subtitle,
  onEdit,
  onDelete,
}) => {
  const [language, setLanguage] = useState<Language>("ar");

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
      className={`flex flex-col lg:gap-0 gap-6 items-center justify-between border rounded-lg p-4 bg-white ${
        language === "ar" ? "rtl lg:flex-row-reverse " : " lg:flex-row"
      }`}
    >
      <div
        className={`flex gap-4 ${
          language === "ar" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 bg-[#71c9f9] rounded-full">
          <div className="w-8 h-8 bg-[url('/Images/labs.png')] bg-center bg-no-repeat bg-contain"></div>
        </div>

        {/* Text Section */}
        <div className="flex-1 mr-4">
          <div className="text-lg font-bold text-gray-800">{title}</div>
          <div
            className={`text-sm text-gray-500 ${
              language === "ar" ? "text-end" : "text-start"
            }`}
          >
            {subtitle}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          className="px-4 py-2 text-white bg-[#71c9f9] rounded-md hover:bg-[#71c9f9] transition"
          onClick={onEdit}
        >
          {language === "ar" ? "تعديل" : "Edit"}
        </button>
        <DeleteButton onConfirm={onDelete} />
      </div>
    </div>
  );
};

export default AnalysisPackage;
