"use client";
import React, { useEffect, useState, useRef } from "react";

type Language = "ar" | "en";

interface GuideFiltrationProps {
  onSearchChange: (searchTerm: string) => void;
  onCountryChange: (countryTerm: string) => void;
  onSpecialtyChange: (specialtyTerm: string) => void;
  onCityChange: (cityTerm: string) => void;
}

const GuideFiltration2: React.FC<GuideFiltrationProps> = ({
  onSearchChange,
  onCountryChange,
  onSpecialtyChange,
  onCityChange,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"doctorsSearch" | "hospitalsSearch" | "labs" | "pharmaciesSearch">("doctorsSearch");
  const [language, setLanguage] = useState<Language>("ar");
  const [dropdownOpen, setDropdownOpen] = useState<"country" | "specialty" | "city" | null>(null);

  const [countries, setCountries] = useState<any[]>([]);
  const [specialities, setSpecialities] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

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

    const fetchData = async () => {
      try {
        const [countriesRes, specialtiesRes, citiesRes] = await Promise.all([
          fetch("https://test-roshita.net/api/countries-list/"),
          fetch("https://test-roshita.net/api/specialty-list/"),
          fetch("https://test-roshita.net/api/cities-list/")
        ]);

        const [countriesData, specialtiesData, citiesData] = await Promise.all([
          countriesRes.json(),
          specialtiesRes.json(),
          citiesRes.json()
        ]);

        setCountries(countriesData);
        setSpecialities(specialtiesData);
        setCities(citiesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    onCountryChange(value);
    setDropdownOpen(null);
  };

  const handleSpecialtyChange = (value: string) => {
    setSelectedSpecialty(value);
    onSpecialtyChange(value);
    setDropdownOpen(null);
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    onCityChange(value);
    setDropdownOpen(null);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onSearchChange(value);
  };

  const handleClick = (term: "doctorsSearch" | "hospitalsSearch" | "labs" | "pharmaciesSearch") => {
    if (term === "pharmaciesSearch") return; // Disable pharmacies search
    
    setSelectedFilter(term);
    setSearch("");
    setSelectedCountry(null);
    setSelectedSpecialty(null);
    setSelectedCity(null);
    onSearchChange(term);
    onCountryChange("");
    onSpecialtyChange("");
    onCityChange("");
  };

  const toggleDropdown = (type: "country" | "specialty" | "city") => {
    setDropdownOpen(dropdownOpen === type ? null : type);
  };

  const CustomDropdown = ({
    type,
    items,
    selectedValue,
    placeholder,
    onChange,
  }: {
    type: "country" | "specialty" | "city";
    items: any[];
    selectedValue: string | null;
    placeholder: string;
    onChange: (value: string) => void;
  }) => {
    return (
      <div className="relative w-full" ref={dropdownRef}>
        <button
          onClick={() => toggleDropdown(type)}
          className={`h-[52px] flex-row-reverse bg-white rounded-full w-full px-4 flex items-center justify-between border border-gray-300 ${
            dropdownOpen === type ? "ring-2 ring-roshitaDarkBlue" : ""
          }`}
          dir="rtl"
        >
          <span className={`${selectedValue ? "text-gray-900" : "text-gray-500"} truncate`}>
            {selectedValue || placeholder}
          </span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${
              dropdownOpen === type ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        
        {dropdownOpen === type && (
          <div className="absolute z-[999999] mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-auto border border-gray-200">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => onChange(item.name)}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-right ${
                  selectedValue === item.name ? "bg-roshitaBlue text-white" : ""
                }`}
                dir="rtl"
              >
                {language === "ar" ? item.name : item.foreign_name || item.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const filterTabs = [
        { id: "hospitalsSearch", labelAr: "مستشفيات", labelEn: "Hospitals", icon: "Hos", disabled: false },
    { id: "doctorsSearch", labelAr: "الأطباء", labelEn: "Doctors", icon: "Doc", disabled: false },
    { id: "pharmaciesSearch", labelAr: "صيدلية", labelEn: "Pharmacy", icon: "Pha", disabled: true },
    { id: "labs", labelAr: "مختبرات", labelEn: "Labs", icon: "Lab", disabled: false }
  ];

  return (
    <div className="lg:-mt-[80px] xl:-mt-[40px] mt-[180px] rounded-2xl p-6 max-w-[1280px] mx-auto relative" style={{ zIndex: 9999 }}>
      <div className="!bg-white justify-center flex lg:flex-row-reverse flex-col rounded-[30px] h-[90px]" style={{ boxShadow: "0 8px 26.6px rgba(0, 0, 0, 0.09)" }}>
        {filterTabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => !tab.disabled && handleClick(tab.id as any)}
            className={`lg:border-l-gray-200 border-b-gray-200 lg:border-l lg:border-b-transparent border-b p-4 flex justify-center items-center flex-row-reverse lg:w-[25%] w-full ${
              tab.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            } ${
              selectedFilter === tab.id ? "bg-roshitaDarkBlue text-white" : ""
            } ${
              tab.id === "hospitalsSearch" && selectedFilter === "hospitalsSearch" ? "rounded-r-[30px]" : ""
            }`}
          >
            <img src={`/Images/Filter${tab.icon}.png`} alt={tab.id} className="h-8 w-8" />
            <p className="text-[24px] font-semibold">
              {language === "ar" ? tab.labelAr : tab.labelEn}
            </p>
          </div>
        ))}
      </div>

      {/* Filters Inputs */}
      <div className="bg-roshitaBlue justify-between flex flex-row-reverse rounded-lg p-4 gap-4 w-[95%] mx-auto">
        {selectedFilter === "doctorsSearch" ? (
          <>
            <div className="w-1/3">
              <CustomDropdown
                type="specialty"
                items={specialities}
                selectedValue={selectedSpecialty}
                placeholder={language === "ar" ? "التخصص" : "Specialty"}
                onChange={handleSpecialtyChange}
              />
            </div>
            <div className="w-1/3">
              <CustomDropdown
                type="city"
                items={cities}
                selectedValue={selectedCity}
                placeholder={language === "ar" ? "المدينة" : "City"}
                onChange={handleCityChange}
              />
            </div>
          </>
        ) : (
          <>
            <div className="w-1/3">
              <CustomDropdown
                type="country"
                items={countries}
                selectedValue={selectedCountry}
                placeholder={language === "ar" ? "البلد" : "Country"}
                onChange={handleCountryChange}
              />
            </div>
            <div className="w-1/3">
              <CustomDropdown
                type="city"
                items={cities}
                selectedValue={selectedCity}
                placeholder={language === "ar" ? "المدينة" : "City"}
                onChange={handleCityChange}
              />
            </div>
          </>
        )}
        
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder={
              language === "ar" ? 
                selectedFilter === "doctorsSearch" ? "ابحث عن دكتور" :
                selectedFilter === "hospitalsSearch" ? "ابحث عن مستشفى" : 
                selectedFilter === "pharmaciesSearch" ? "ابحث عن صيدلية" : "ابحث عن مختبر"
              : 
                selectedFilter === "doctorsSearch" ? "Search Doctor" :
                selectedFilter === "hospitalsSearch" ? "Search Hospital" : 
                selectedFilter === "pharmaciesSearch" ? "Search Pharmacy" : "Search Lab"
            }
            value={search}
            onChange={handleSearchInputChange}
            className="h-[52px] rounded-full pr-10 pl-4 w-full text-right placeholder-gray-500"
            dir="rtl"
          />
          <svg
            className="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GuideFiltration2;