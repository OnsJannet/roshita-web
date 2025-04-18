import React, { useEffect, useState } from "react";

type Language = "ar" | "en";

interface ActionDropdownProps {
  type: string;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({ type }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [language, setLanguage] = useState<Language>("ar");

  const lab = type === "lab"
  const rays = type === "rays"

  console.log("type", type)
  console.log("rays", rays)

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

  const handleAddTest = () => {
    {lab ? window.location.href = "/dashboard/labs/add-test" : window.location.href = "/dashboard/x-rays/add-test"}
  };

  const handleAddGroup = () => {
    {lab ? window.location.href = "/dashboard/labs/add-group" : window.location.href = "/dashboard/x-rays/add-group"}
  };

  return (
    <div className="relative">
      <button
        className={`bg-[#00B3E9] !h-[80px] p-4 rounded-[23px] ${
          language === "ar" ? "text-right" : "text-left"
        } text-white`}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {language === "ar" ? "إضافة تحليل" : "Add Test"}
      </button>
      {showDropdown && (
        <div
          className={`bg-[#F6F6F6] rounded-[23px] p-4 absolute top-[100%] ${
            language === "ar" ? "right-6" : "left-6"
          } mt-[-20px] w-[160px]`}
        >
          {/*<div
            onClick={handleAddTest}
            className={`py-2 cursor-pointer hover:bg-gray-200 hover:text-black rounded-md ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {language === "ar" ? "إضافة تحليل جديد" : "Add New Test"}
          </div>*/}
          <div
            onClick={handleAddGroup}
            className={`py-2 cursor-pointer hover:bg-gray-200 hover:text-black rounded-md ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {language === "ar" ? "إضافة باقة" : "Add Group"}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;
