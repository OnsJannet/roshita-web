"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Language = "ar" | "en";

interface GuideFiltrationProps {
  onSearchChange: (searchTerm: string) => void;
  onCountryChange: (countryTerm: string) => void;
  onSpecialtyChange: (SpecialityTerm: string) => void;
}

const GuideFiltration: React.FC<GuideFiltrationProps> = ({
  onSearchChange,
  onCountryChange,
  onSpecialtyChange,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("ar");

  const [countries, setCountries] = useState<any[]>([]);
  const [specialities, setSpecialities] = useState<any[]>([]);

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

    // Fetch countries
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "http://test-roshita.net/api/countries-list/",
          {
            method: "GET",
            headers: {
              accept: "application/json",
              "X-CSRFToken":
                "rPJOwOXGNHEO9sA4D2NAaKGQ8T9PgxJZLAObet5sjLuW6iNMGERoFnRK5kv6IBTV",
            },
          }
        );
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    // Fetch specialties
    const fetchSpecialties = async () => {
      try {
        const response = await fetch(
          "http://test-roshita.net/api/specialty-list/",
          {
            method: "GET",
            headers: {
              accept: "application/json",
              "X-CSRFToken":
                "rPJOwOXGNHEO9sA4D2NAaKGQ8T9PgxJZLAObet5sjLuW6iNMGERoFnRK5kv6IBTV",
            },
          }
        );
        const data = await response.json();
        setSpecialities(data);
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };

    fetchCountries();
    fetchSpecialties();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleClick = (term: string) => {
    setSearch(term);
    setSelectedFilter(term); // Set the selected filter
    onSearchChange(term); // Call the parent callback
  };

  const handleCountryChange = (value: string | undefined) => {
    const newValue = value ?? "";
    setSelectedCountry(newValue);
    onCountryChange(newValue);
  };

  const handleSpecialtyChange = (value: string | undefined) => {
    const newValue = value ?? "";
    setSelectedSpecialty(newValue);
    onSpecialtyChange(newValue);
  };

  return (
    <div
      className="lg:-mt-[80px] xl:-mt-[40px] mt-[180px] rounded-2xl p-6 max-w-[1280px] mx-auto relative"
      style={{ zIndex: 9999 }}
    >
      <div
        className="!bg-white justify-center flex lg:flex-row-reverse flex-col rounded-lg p-4"
        style={{ boxShadow: "0 8px 26.6px rgba(0, 0, 0, 0.09)" }}
      >
        <div
          onClick={() => handleClick("doctorsSearch")}
          className={`lg:border-l-gray-200 border-b-gray-200 lg:border-b-transparent lg:border-l border-b p-4 flex justify-center items-center flex-row-reverse lg:w-[25%] w-full cursor-pointer ${
            selectedFilter === "doctorsSearch"
              ? "bg-roshitaDarkBlue text-white rounded-lg"
              : ""
          }`}
        >
          <img src="/Images/FilterDoc.png" alt="doc" className="h-8 w-8" />
          <p className="text-[24px] font-semibold">
            {language === "ar" ? "الأطباء" : "Doctors"}
          </p>
        </div>
        <div
          onClick={() => handleClick("hospitalsSearch")}
          className={`lg:border-l-gray-200 border-b-gray-200 lg:border-l lg:border-b-transparent border-b p-4 flex justify-center items-center flex-row-reverse lg:w-[25%] w-full cursor-pointer ${
            selectedFilter === "hospitalsSearch"
              ? "bg-roshitaDarkBlue text-white rounded-lg"
              : ""
          }`}
        >
          <img src="/Images/FilterHos.png" alt="doc" className="h-8 w-8" />
          <p className="text-[24px] font-semibold">
            {language === "ar" ? "مستشفيات" : "Hospitals"}
          </p>
        </div>
        <div
          onClick={() => handleClick("pharmaciesSearch")}
          className={`lg:border-l-gray-200 border-b-gray-200 lg:border-l lg:border-b-transparent border-b p-4 flex justify-center items-center flex-row-reverse lg:w-[25%] w-full cursor-pointer ${
            selectedFilter === "pharmaciesSearch"
              ? "bg-roshitaDarkBlue text-white rounded-lg"
              : ""
          }`}
        >
          <img src="/Images/FilterPha.png" alt="doc" className="h-8 w-8" />
          <p className="text-[24px] font-semibold">
            {language === "ar" ? "صيدلية" : "Pharmacy"}
          </p>
        </div>
        <div
          onClick={() => handleClick("labs")}
          className={`p-4 flex justify-center items-center flex-row-reverse lg:border-b-transparent lg:w-[25%] w-full cursor-pointer ${
            selectedFilter === "labs"
              ? "bg-roshitaDarkBlue text-white rounded-lg"
              : ""
          }`}
        >
          <img src="/Images/FilterLab.png" alt="doc" className="h-8 w-8" />
          <p className="text-[24px] font-semibold">
            {language === "ar" ? "مختبرات" : "Labs"}
          </p>
        </div>
      </div>
      <div className="bg-roshitaBlue justify-center flex flex-row-reverse rounded-lg p-4 gap-4">
        {/* Country Select */}
        <Select
          onValueChange={handleCountryChange}
          value={selectedCountry ?? undefined}
        >
          <SelectTrigger className="h-[52px] flex-row-reverse bg-white">
            <SelectValue
              placeholder={language === "ar" ? "البلد" : "Country"}
            />
          </SelectTrigger>
          <SelectContent className="z-[999999] bg-white">
            {countries.map((country) => (
              <SelectItem key={country.id} value={country.name}>
                {language === "ar" ? country.name : country.foreign_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Specialty Select */}
        <Select
          onValueChange={handleSpecialtyChange}
          value={selectedSpecialty ?? undefined}
        >
          <SelectTrigger className="h-[52px] flex-row-reverse bg-white">
            <SelectValue
              placeholder={language === "ar" ? "التخصص" : "Specialty"}
            />
          </SelectTrigger>
          <SelectContent className="z-[999999] bg-white">
            {specialities.map((specialty) => (
              <SelectItem key={specialty.id} value={specialty.name}>
                {language === "ar" ? specialty.name : specialty.foreign_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default GuideFiltration;
