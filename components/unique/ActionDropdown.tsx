import React, { useEffect, useState } from "react";

type Language = "ar" | "en";

const ActionDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
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

  const handleAddTest = () => {
    window.location.href = "/dashboard/labs/add-test";
  };

  const handleAddGroup = () => {
    window.location.href = "/dashboard/labs/add-group";
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
            language === "ar" ? "right-10" : "left-10"
          } mt-[-20px] w-[200px]`}
        >
          <div
            onClick={handleAddTest}
            className={`py-2 cursor-pointer hover:bg-gray-200 hover:text-black rounded-md ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {language === "ar" ? "إضافة تحليل جديد" : "Add New Test"}
          </div>
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
