"use client";
import React, { useEffect, useState } from "react";
import GuideFiltration from "./GuideFiltration";

type Language = "ar" | "en";

interface GuideTitleSectionProps {
  onSearchChange: (searchTerm: string) => void;
  onCountryChange: (countryTerm: string) => void;
  onSpecialtyChange: (SpecialityTerm: string) => void;
}

const GuideTitleSection: React.FC<GuideTitleSectionProps> = ({
  onSearchChange,
  onCountryChange,
  onSpecialtyChange,
}) => {
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    onSearchChange(newSearch); // Call the parent callback
  };

  const handleCountryChange = (newCountry: string) => {
    setSelectedCountry(newCountry);
    onCountryChange(newCountry);
  };

  const handleSpecialtyChange = (newCountry: string) => {
    setSelectedSpecialty(newCountry);
    onSpecialtyChange(newCountry);
  };

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
    <div>
      <div className="relative w-full h-[80vh] lg:flex-row flex-col bg-cover bg-center bg-[url('/Images/medicalBanner.png')]">
        <div
          className="absolute inset-0 opacity-60 z-10"
          style={{
            background:
              "linear-gradient(107.52deg, #71C9F9 34.8%, rgba(0, 63, 155, 0.62) 129.62%, rgba(0, 63, 155, 0.15) 129.82%, rgba(0, 63, 155, 0) 138.69%)",
          }}
        ></div>
        <div className="max-w-[1280px] relative flex lg:flex-row flex-col-reverse lg:justify-end justify-center items-center lg:py-20 py-10 lg:gap-0 gap-2 lg:w-[50%] w-full mx-auto z-20">
          <div className="lg:w-1/2 w-full">
            <h1 className="text-[60px] text-white text-center lg:text-end">
              {language === "ar" ? "الـــــدلــــيل" : "Guide"}
            </h1>
            <h1 className="text-[60px] text-white text-center lg:text-end font-bold">
              {language === "ar" ? "روشـــيتــــــا" : "Rocheta"}
            </h1>
            <p className="text-2xl text-white lg:text-end text-center">
              {language === "ar"
                ? "لتقديم الاستشارات الطبية واستفسار كافة المعلومات"
                : "Providing medical consultations and all information inquiries"}
            </p>
            <div className="flex justify-between flex-row-reverse lg:gap-10 w-[80%] mx-auto mt-8">
              <div>
                <h2 className="text-white text-[60px] text-semibold text-end">
                  263
                </h2>
                <h2 className="text-white text-[24px] text-semibold text-end">
                  {language === "ar" ? "الأطباء" : "Doctors"}
                </h2>
              </div>
              <div>
                <h2 className="text-white text-[60px] text-semibold text-end">
                  891
                </h2>
                <h2 className="text-white text-[24px] text-semibold text-end">
                  {language === "ar" ? "مستشفيات" : "Hospitals"}
                </h2>
              </div>
              <div>
                <h2 className="text-white text-[60px] text-semibold text-end">
                  10+
                </h2>
                <h2 className="text-white text-[24px] text-semibold text-end">
                  {language === "ar" ? "مختبرات" : "Labs"}
                </h2>
              </div>
            </div>
          </div>
          <div className="h-full w-1/2"></div>
        </div>
      </div>

      <div className="z-30 lg:mt-0 -mt-[180px]">
        <GuideFiltration
          onSearchChange={handleSearchChange}
          onCountryChange={handleCountryChange}
          onSpecialtyChange={handleSpecialtyChange}
        />
      </div>
    </div>
  );
};

export default GuideTitleSection;
