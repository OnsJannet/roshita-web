import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

type Language = "ar" | "en";

const FilterTests = ({
  tests,
  setSearch,
}: {
  tests: { اسم_الفحص: string }[];
  setSearch: React.Dispatch<React.SetStateAction<string>>;
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex flex-row-reverse justify-start gap-2 items-center bg-[#F6F6F6] p-4 rounded-[23px]">
      <Search className="text-[#00B3E9]" />
      <input
        type="text"
        className="w-[90%] h-[50px] bg-transparent border-0 border-[#D1D1D1] focus:border-transparent placeholder:text-end focus:outline-none placeholder:text-[#D1D1D1] placeholder:focus:text-transparent rounded-[23px]"
        placeholder={language === "ar" ? "البحث عن تحليل" : "Search for Analysis"}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default FilterTests;
