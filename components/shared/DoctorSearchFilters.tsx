"use client";
import { Heart, MapPin, ChevronDown, Search } from "lucide-react";
import React, { useState, useEffect } from "react";

const DoctorSearchForm = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [language, setLanguage] = useState("ar"); // Default to Arabic

  const [specialties, setSpecialties] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get language from localStorage
    const storedLanguage = localStorage.getItem("language") || "ar";
    setLanguage(storedLanguage);
  }, []);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await fetch(
          "https://test-roshita.net/api/specialty-list/"
        );
        const data = await response.json();
        setSpecialties(data);
      } catch (err) {
        console.error("Error fetching specialties:", err);
      }
    };
    fetchSpecialties();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://test-roshita.net/api/countries-list/"
        );
        const data = await response.json();
        setCountries(data);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchAllCities = async () => {
      try {
        const response = await fetch(
          "https://test-roshita.net/api/cities-list/"
        );
        const data = await response.json();
        setAllCities(data);
      } catch (err) {
        console.error("Error fetching all cities:", err);
      }
    };
    fetchAllCities();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry) {
        setCities(allCities);
        return;
      }
      try {
        const response = await fetch(
          `https://test-roshita.net/api/cities-list/?country=${selectedCountry}`
        );
        const data = await response.json();
        setCities(data);
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };
    fetchCities();
  }, [selectedCountry, allCities]);

  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const response = await fetch(
          "https://test-roshita.net/api/user-doctors/"
        );
        const data = await response.json();
        let doctorsData = [];

        if (data.results?.data?.doctors) {
          doctorsData = data.results.data.doctors;
        } else if (data.doctors) {
          doctorsData = data.doctors;
        }

        setAllDoctors(doctorsData);
      } catch (err) {
        console.error("Error fetching all doctors:", err);
      }
    };
    fetchAllDoctors();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        if (selectedSpecialty)
          queryParams.append("specialty", selectedSpecialty);
        if (selectedCountry) queryParams.append("country", selectedCountry);
        if (selectedCity) queryParams.append("city", selectedCity);

        const response = await fetch(
          `https://test-roshita.net/api/user-doctors/?${queryParams.toString()}`
        );
        if (!response.ok) throw new Error("Failed to fetch doctors");

        const data = await response.json();
        let doctorsData = [];

        if (data.results?.data?.doctors) {
          doctorsData = data.results.data.doctors;
        } else if (data.doctors) {
          doctorsData = data.doctors;
        }

        setDoctors(doctorsData);
      } catch (err) {
        //@ts-ignore
        setError(err.message);
        setDoctors(allDoctors);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedSpecialty || selectedCountry || selectedCity) {
      fetchDoctors();
    } else {
      setDoctors(allDoctors);
    }
  }, [selectedSpecialty, selectedCountry, selectedCity, allDoctors]);



const handleSearch = () => {
  const country = selectedCountry ? encodeURIComponent(selectedCountry) : "all";
  const city = selectedCity ? encodeURIComponent(selectedCity) : "all";
  const specialty = selectedSpecialty ? encodeURIComponent(selectedSpecialty) : "all";
  const doctor = selectedDoctor ? encodeURIComponent(selectedDoctor) : "all";

  window.location.href = `/doctor-appointement/${country}/${city}/${specialty}/all/${doctor}`;
};



  const fieldStyle = "flex flex-col gap-2 w-[200px]";

  const translations = {
    ar: {
      doctor: "دكتور",
      selectDoctor: "اختر دكتور",
      city: "المدينة",
      selectCity: "اختر المدينة",
      country: "البلد",
      selectCountry: "اختر البلد",
      specialty: "التخصص",
      selectSpecialty: "اختر التخصص",
      search: "بحث",
      searching: "جاري البحث...",
      error: "خطأ",
    },
    en: {
      doctor: "Doctor",
      selectDoctor: "Select Doctor",
      city: "City",
      selectCity: "Select City",
      country: "Country",
      selectCountry: "Select Country",
      specialty: "Specialty",
      selectSpecialty: "Select Specialty",
      search: "Search",
      searching: "Searching...",
      error: "Error",
    },
  };

  //@ts-ignore
  const t = translations[language];
  //@ts-ignore
  const getCountryFlag = (countryName) => {
    if (!countryName) return "/images/lb-flag.png"; // default flag
    //@ts-ignore
    const country = countries.find((c) => c.name === countryName);
    if (!country) return "/images/lb-flag.png";
    //@ts-ignore
    return country.flag || "/images/lb-flag.png";
  };

  return (
    <div
      className="flex items-center justify-center min-h-[201.95px] rounded-2xl p-6 max-w-[1280px] mx-auto bg-white relative"
      style={{ boxShadow: "0 8px 26.6px rgba(0, 0, 0, 0.09)", zIndex: 9999 }}
    >
      {error && (
        <div className="text-red-500">
          {t.error}: {error}
        </div>
      )}

      <div className="flex flex-wrap flex-row-reverse justify-between gap-4 w-full">
        {/* Specialty */}
        <div className={fieldStyle}>
          <h1
            className={`text-xl font-bold ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {t.specialty}
          </h1>
          <div className="relative">
            <select
              className={`border rounded-lg p-3 pl-10 pr-8 w-full appearance-none ${
                language === "ar" ? "text-right" : "text-left"
              }`}
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">{t.selectSpecialty}</option>
              {specialties.map((specialty) => (
                //@ts-ignore
                <option key={specialty.id} value={specialty.name}>
                  {/*@ts-ignore*/}
                  {specialty.name}
                </option>
              ))}
            </select>
            <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#1588C8]" />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Country */}
        <div className={fieldStyle}>
          <h2
            className={`text-lg font-semibold ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {t.country}
          </h2>
          <div className="relative">
            <select
              className={`border rounded-lg p-3 pl-10 pr-8 w-full appearance-none ${
                language === "ar" ? "text-right" : "text-left"
              }`}
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">{t.selectCountry}</option>
              {countries.map((country) => (
                //@ts-ignore
                <option key={country.id} value={country.name}>
                  {/* @ts-ignore*/}
                  {country.name}
                </option>
              ))}
            </select>
            <img
              src={getCountryFlag(selectedCountry)}
              alt="Country"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 object-contain"
            />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* City */}
        <div className={fieldStyle}>
          <h3
            className={`text-lg font-semibold ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {t.city}
          </h3>
          <div className="relative">
            <select
              className={`border rounded-lg p-3 pl-10 pr-8 w-full appearance-none ${
                language === "ar" ? "text-right" : "text-left"
              }`}
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">{t.selectCity}</option>
              {cities.map((city) => (
                //@ts-ignore
                <option key={city.id} value={city.name}>
                  {/*@ts-ignore*/}
                  {city.name}
                </option>
              ))}
            </select>
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#1588C8]" />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Doctor */}
        <div className={fieldStyle}>
          <h3
            className={`text-lg font-semibold ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {t.doctor}
          </h3>
          <div className="relative">
            <select
              className={`border rounded-lg p-3 pl-10 pr-8 w-full appearance-none ${
                language === "ar" ? "text-right" : "text-left"
              }`}
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              <option value="">{t.selectDoctor}</option>
              {doctors.map((doctor) => (
                //@ts-ignore
                <option key={doctor.id} value={doctor.id}>
                  {/*@ts-ignore*/}
                  {doctor.name}
                </option>
              ))}
            </select>
            <img
              src="/images/stethoscope.png"
              alt="Doctor"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
            />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end w-[200px]">
          <button
            className="bg-blue-600 text-white py-3 w-full rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            onClick={handleSearch}
            disabled={isLoading}
          >
            <Search className="h-4 w-4" />
            {isLoading ? t.searching : t.search}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorSearchForm;