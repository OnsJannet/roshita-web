import {
  Banknote,
  Building,
  ChevronDown,
  Filter,
  Globe,
  HeartPulse,
} from "lucide-react";
import React, { useState, useEffect } from "react";

interface MedicalOrganization {
  id: number;
  name: string;
  foreign_name: string;
  phone: string;
  email: string;
  city: {
    id: number;
    country: {
      id: number;
      name: string;
      foreign_name: string;
    };
    name: string;
    foreign_name: string;
  };
  address: string;
  Latitude: number;
  Longitude: number;
}

interface Doctor {
  doctor_id: number;
  name: string;
  specialization: string;
  hospital: string;
  city: string;
  address: string | null;
  image: string;
  price: string;
  rating: number | null;
  appointment_dates: string[];
  medical_organizations: MedicalOrganization[];
}

interface FilterDoctorProps {
  doctors: Doctor[];
  selectedPrices: string[];
  setSelectedPrices: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCountries: string[];
  setSelectedCountries: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSpecialties: string[];
  setSelectedSpecialties: React.Dispatch<React.SetStateAction<string[]>>;
  selectedHospitals: string[];
  setSelectedHospitals: React.Dispatch<React.SetStateAction<string[]>>;
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
  selectedHospitals,
  setSelectedHospitals,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);
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

  // Get unique prices, handling null/undefined and formatting
  const prices = Array.from(
    new Set(
      doctors
        .map((doctor) => doctor.price)
        .filter((price) => price !== null && price !== undefined && price !== "")
        .map(price => price.replace(/\.000$/, '')) // Remove trailing .000 for display
    )
  ).sort((a, b) => parseFloat(a) - parseFloat(b));

  // Get unique countries from all medical organizations
  const countries = Array.from(
    new Set(
      doctors.flatMap(doctor => 
        doctor.medical_organizations?.map(org =>
          language === "ar" 
            ? org.city?.country?.name 
            : org.city?.country?.foreign_name
        ) || []
      ).filter(Boolean)
    )
  ).sort();

  // Get unique specialties
  const specialties = Array.from(
    new Set(
      doctors.map((doctor) => doctor.specialization).filter(Boolean)
    )
  ).sort();

  // Get unique hospitals from all medical organizations
  const hospitals = Array.from(
    new Set(
      doctors.flatMap(doctor =>
        doctor.medical_organizations?.map(org =>
          language === "ar" ? org.name : org.foreign_name
        ) || []
      ).filter(Boolean)
    )
  ).sort();

  const handlePriceChange = (price: string) => {
    const fullPrice = `${price}.000`; // Match the format in the data
    setSelectedPrices(prev =>
      prev.includes(fullPrice)
        ? prev.filter(p => p !== fullPrice)
        : [...prev, fullPrice]
    );
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleHospitalChange = (hospital: string) => {
    setSelectedHospitals(prev =>
      prev.includes(hospital)
        ? prev.filter(h => h !== hospital)
        : [...prev, hospital]
    );
  };

  return (
    <div className="bg-white rounded-2xl">
      <div
        className="bg-[#71C9F9] p-8 flex flex-col rounded-2xl cursor-pointer"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <div
          className={`flex justify-between items-center ${
            language === "en" ? "flex-row-reverse" : ""
          }`}
        >
          <div className="flex gap-1">
            <Filter className="text-white" />
            <h2 className="text-white">
              {language === "en" ? "Filter" : "الفلتـرة"}
            </h2>
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
                className={`text-roshitaDarkBlue ${
                  isPriceOpen ? "rotate-180" : ""
                }`}
              />
              <div className="flex justify-end items-center gap-1">
                <h3 className="font-bold mb-2">
                  {language === "en" ? "Price" : "السعــر"}
                </h3>
                <Banknote className="text-roshitaDarkBlue mb-2" />
              </div>
            </div>
            {isPriceOpen && (
              <div className="flex flex-col-reverse gap-2">
                {prices.map((price) => (
                  <div
                    key={price}
                    className="flex gap-2 items-center justify-end"
                  >
                    <div className="flex flex-row-reverse gap-1">
                      <label className="text-gray-400">{price}</label>
                      <p>{language === "ar" ? "د.ت" : "DT"}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes(`${price}.000`)}
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
                className={`text-roshitaDarkBlue ${
                  isCountryOpen ? "rotate-180" : ""
                }`}
              />
              <div className="flex justify-end items-center gap-1">
                <h3 className="font-bold mb-2">
                  {language === "en" ? "Country" : "البلد"}
                </h3>
                <Globe className="text-roshitaDarkBlue mb-2" />
              </div>
            </div>

            {isCountryOpen && (
              <div className="flex flex-col-reverse gap-2">
                {countries.map((country) => (
                  <div
                    key={country}
                    className="flex gap-1 items-center justify-end"
                  >
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
                className={`text-roshitaDarkBlue ${
                  isSpecialtyOpen ? "rotate-180" : ""
                }`}
              />
              <div className="flex justify-end items-center gap-1">
                <h3 className="font-bold mb-2">
                  {language === "en" ? "Specialty" : "التخصص"}
                </h3>
                <HeartPulse className="text-roshitaDarkBlue mb-2" />
              </div>
            </div>

            {isSpecialtyOpen && (
              <div className="flex flex-col-reverse gap-2">
                {specialties.map((specialty) => (
                  <div
                    key={specialty}
                    className="flex gap-1 items-center justify-end"
                  >
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

          {/* Hospital Filter Accordion */}
          <div className="mt-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsHospitalOpen(!isHospitalOpen)}
            >
              <ChevronDown
                className={`text-roshitaDarkBlue ${
                  isHospitalOpen ? "rotate-180" : ""
                }`}
              />
              <div className="flex justify-end items-center gap-1">
                <h3 className="font-bold mb-2">
                  {language === "en" ? "Hospital" : "المستشفى"}
                </h3>
                <Building className="text-roshitaDarkBlue mb-2" />
              </div>
            </div>

            {isHospitalOpen && (
              <div className="flex flex-col-reverse gap-2">
                {hospitals.map((hospital) => (
                  <div
                    key={hospital}
                    className="flex gap-1 items-center justify-end"
                  >
                    <label className="text-gray-400">{hospital}</label>
                    <input
                      type="checkbox"
                      checked={selectedHospitals.includes(hospital)}
                      onChange={() => handleHospitalChange(hospital)}
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