import { Banknote, ChevronDown, Filter, Globe, HeartPulse, Star } from "lucide-react";
import React, { useState, useEffect } from "react";

// Define the types for Doctor and Props
interface Doctor {
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  price: string;
  location: string;
  imageUrl: string;
}

interface FilterDoctorProps {
  doctors: Doctor[];
  selectedPrices: string[];
  setSelectedPrices: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCountries: string[];
  setSelectedCountries: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSpecialties: string[];
  setSelectedSpecialties: React.Dispatch<React.SetStateAction<string[]>>;
}

type Language = "ar" | "en";

const FilterDoctor: React.FC<FilterDoctorProps> = ({
  doctors,
  selectedPrices,
  setSelectedPrices,
  selectedCountries,
  setSelectedCountries,
  selectedSpecialties,
  setSelectedSpecialties,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
    // Sync the language state with the localStorage value
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage as Language); // Cast stored value to 'Language'
    } else {
      setLanguage("ar"); // Default to 'ar' (Arabic) if no language is set
    }

    // Listen for changes in localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "language") {
        setLanguage((event.newValue as Language) || "ar"); // Cast newValue to 'Language'
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const prices = Array.from(new Set(doctors.map((doctor) => doctor.price || "")));
  const countries = Array.from(new Set(doctors.map((doctor) => doctor.location || "")));
  const specialties = Array.from(new Set(doctors.map((doctor) => doctor.specialty || "")));

  const handlePriceChange = (price: string) => {
    if (price === undefined) return;
    if (selectedPrices.includes(price)) {
      setSelectedPrices(selectedPrices.filter((p) => p !== price));
    } else {
      setSelectedPrices([...selectedPrices, price]);
    }
  };

  const handleCountryChange = (country: string) => {
    if (country === undefined) return;
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter((c) => c !== country));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const handleSpecialtyChange = (specialty: string) => {
    if (specialty === undefined) return;
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(selectedSpecialties.filter((s) => s !== specialty));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };

  return (
    <div className="bg-white rounded-2xl">
      <div
        className="bg-[#71C9F9] p-8 flex flex-col rounded-2xl cursor-pointer"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <div className={`flex justify-between items-center ${language === "en" ? "flex-row-reverse" : ""}`}>
          <div className="flex gap-1">
            <Filter className="text-white" />
            <h2 className="text-white">{language === "en" ? "Filter" : "الفلتـرة"}</h2>
          </div>
          <ChevronDown
            className={`text-white ${isFilterOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Filter Content */}
      {isFilterOpen && (
        <div className="p-4">
          {/* Price Filter Accordion */}
          <div>
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsPriceOpen(!isPriceOpen)}
            >
              <ChevronDown
                className={`text-roshitaDarkBlue ${isPriceOpen ? "rotate-180" : ""}`}
              />
              <div className="flex justify-end items-center gap-1">
                <h3 className="font-bold mb-2">{language === "en" ? "Price" : "السعــر"}</h3>
                <Banknote className="text-roshitaDarkBlue" />
              </div>
            </div>
            {isPriceOpen && (
              <div className="flex flex-col-reverse gap-2">
                {prices.map((price) => (
                  <div key={price} className="flex gap-2 items-center justify-end">
                    <div className="flex flex-row-reverse gap-1">
                      <label className="text-gray-400">
                        {price.replace("د.ل", "").trim()}
                      </label>
                      <p> د.ل </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes(price)}
                      onChange={() => handlePriceChange(price)}
                      className="rounded-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Country Filter Accordion */}
          <div className="mt-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsCountryOpen(!isCountryOpen)}
            >
              <ChevronDown
                className={`text-roshitaDarkBlue ${isCountryOpen ? "rotate-180" : ""}`}
              />
              <div className="flex justify-end items-center gap-1">
                <h3 className="font-bold mb-2">{language === "en" ? "Country" : "البلد"}</h3>
                <Globe className="text-roshitaDarkBlue" />
              </div>
            </div>

            {isCountryOpen && (
              <div className="flex flex-col-reverse gap-2">
                {countries.map((country) => (
                  <div key={country} className="flex gap-1 items-center justify-end">
                    <label className="text-gray-400">{country}</label>
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(country)}
                      onChange={() => handleCountryChange(country)}
                      className="rounded-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Specialty Filter Accordion */}
          <div className="mt-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsSpecialtyOpen(!isSpecialtyOpen)}
            >
              <ChevronDown
                className={`text-roshitaDarkBlue ${isSpecialtyOpen ? "rotate-180" : ""}`}
              />
              <div className="flex justify-end items-center gap-1">
                <h3 className="font-bold mb-2">{language === "en" ? "Specialty" : "التخصص"}</h3>
                <HeartPulse className="text-roshitaDarkBlue" />
              </div>
            </div>

            {isSpecialtyOpen && (
              <div className="flex flex-col-reverse gap-2">
                {specialties.map((specialty) => (
                  <div key={specialty} className="flex gap-1 items-center justify-end">
                    <label className="text-gray-400">{specialty}</label>
                    <input
                      type="checkbox"
                      checked={selectedSpecialties.includes(specialty)}
                      onChange={() => handleSpecialtyChange(specialty)}
                      className="rounded-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDoctor;
