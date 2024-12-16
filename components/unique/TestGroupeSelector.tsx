import React, { useEffect, useState } from "react";

type Language = "ar" | "en";

const TestGroupSelector = ({
  groups,
  tests,
  setSelectedGroup,
}: {
  groups: { معرف_المجموعة: string; اسم_المجموعة: string; الفحوصات_المشمولة: string[] }[];
  tests: { معرف_الفحص: string; اسم_الفحص: string }[];
  setSelectedGroup: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [selectedGroup, internalSetSelectedGroup] = useState("");
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

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const groupName = e.target.value;
    internalSetSelectedGroup(groupName);
    setSelectedGroup(groupName); // Passing to parent
  };

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"}>
      <select
        value={selectedGroup}
        onChange={handleGroupChange}
        className="bg-[#F6F6F6] !h-[80px] p-4 rounded-[23px] w-full text-right px-10"
      >
        <option value="">
          {language === "ar" ? "باقة" : "Package"}
        </option>
        {groups.map((group, index) => (
          <option key={index} value={group.اسم_المجموعة}>
            {language === "ar" ? group.اسم_المجموعة : group.اسم_المجموعة} {/* Adjust translation for group name if necessary */}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TestGroupSelector;
