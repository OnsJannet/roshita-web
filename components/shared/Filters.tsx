"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { HeartPulse, MapPin, Search } from "lucide-react";

const Filters = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    null
  );
  const [language, setLanguage] = useState<string>("");
  const [countries, setCountries] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);

  useEffect(() => {
    // Synchronize the language state with the localStorage value
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    } else {
      setLanguage("ar"); // Default language is 'ar' (Arabic)
    }

    // Listen for changes in localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "language") {
        // Update the language state when the language in localStorage changes
        setLanguage(event.newValue || "ar");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Fetch the specialties data from the API
    const fetchSpecialties = async () => {
      try {
        const response = await fetch(
          "https://test-roshita.net/api/specialty-list/",
          {
            method: "GET",
            headers: {
              accept: "application/json",
            },
          }
        );
        const data = await response.json();
        setSpecialties(data);
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };

    // Fetch the countries data from the API
    const fetchCountries = async () => {
      const csrfToken = process.env.NEXT_PUBLIC_CSRF_TOKEN;
      console.log("csrfToken", csrfToken);

      try {
        const response = await fetch(
          "https://test-roshita.net/api/countries-list/",
          {
            method: "GET",
            headers: {
              accept: "application/json",
            },
          }
        );
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchSpecialties();
    fetchCountries();
  }, []);

  const handleCountryChange = (value: string | undefined) => {
    setSelectedCountry(value ?? null);
  };

  const handleSpecialtyChange = (value: string | undefined) => {
    setSelectedSpecialty(value ?? null);
  };

  const handleSearch = () => {
    if (selectedCountry && selectedSpecialty) {
      window.location.href = `/doctor-appointement/${encodeURIComponent(
        selectedCountry
      )}/${encodeURIComponent(selectedSpecialty)}/all`;
    }
  };

  return (
    <div
      className="lg:-mt-[80px] xl:-mt-[40px] mt-[180px] rounded-2xl p-6 max-w-[1280px] mx-auto !bg-white relative"
      style={{ boxShadow: "0 8px 26.6px rgba(0, 0, 0, 0.09)", zIndex: 9999 }}
    >
      <p className="text-end mb-4 font-medium">
        {language === "ar"
          ? "حجـــز موعد طبي ، تقديم استشارات"
          : "Book a medical appointment or seek consultations"}
      </p>
      <div className="flex justify-between gap-4">
        <Button
          variant="register"
          className="rounded-xl h-[52px] w-[440px] gap-1 font-bold text-[18px]"
          onClick={handleSearch}
        >
          {language === "ar" ? "بحث" : "Search"}
          <Search className="h-4 w-4" />
        </Button>

        {/* Country Select */}
        <Select
          onValueChange={handleCountryChange}
          value={selectedCountry ?? undefined}
        >
          <SelectTrigger className="h-[52px] flex-row-reverse">
            <div className="flex flex-row-reverse gap-2 items-center">
              <MapPin className="h-[20px] w-[20px] text-roshitaDarkBlue" />
              <SelectValue
                placeholder={language === "ar" ? "البلد" : "Country"}
              />
            </div>
          </SelectTrigger>
          <SelectContent className="z-[999999]">
            <SelectItem key="all" value="all">
              {language === "ar" ? "الكل" : "All"}
            </SelectItem>
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
          <SelectTrigger className="h-[52px] flex-row-reverse">
            <div className="flex flex-row-reverse gap-2 items-center">
              <HeartPulse className="h-[20px] w-[20px] text-roshitaDarkBlue" />
              <SelectValue
                placeholder={language === "ar" ? "التخصص" : "Specialty"}
              />
            </div>
          </SelectTrigger>
          <SelectContent className="z-[999999]">
            <SelectItem key="all" value="all">
              {language === "ar" ? "الكل" : "All"}
            </SelectItem>
            {specialties.map((specialty) => (
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

export default Filters;
