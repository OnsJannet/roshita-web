"use client";
import React, { useEffect, useState } from 'react';
import DoctorCarousel from './DoctorCarousel';

const BestDoctors = () => {
  const [language, setLanguage] = useState<string>("");

  useEffect(() => {
    // Sync the language state with the localStorage value
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    } else {
      setLanguage("ar"); // Default to 'ar' (Arabic) if no language is set
    }

    // Listen for changes in localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "language") {
        setLanguage(event.newValue || "ar");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Run only once on mount

  return (
    <div className="max-w-[1280px] mx-auto">
      <h2 className="text-center text-roshitaDarkBlue text-4xl font-bold mb-20">
        {language === "en" ? "Top Rated Doctors" : "أفضل الأطباء تقييما"}
      </h2>
      <DoctorCarousel />
    </div>
  );
};

export default BestDoctors;
