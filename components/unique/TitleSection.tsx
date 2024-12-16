"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";

type Language = "ar" | "en";

// Translation Object
const translations = {
  ar: {
    title: "أحجــز دكتور",
    subtitle: "لتقديم الاستشارات الطبية واستفسار كافة المعلومات",
    buttonText: "حمل التطبيق",
  },
  en: {
    title: "Book a Doctor",
    subtitle: "For medical consultations and to inquire about all information",
    buttonText: "Download the App",
  },
};

const TitleSection = () => {
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
  }, []); // Run only once on mount

  const t = translations[language]; // Get the translation for the current language

  return (
    <div>
      <div className="relative w-full h-[60vh] lg:flex-row flex-col bg-cover bg-center bg-[url('/Images/headerWoman.png')]">
        <div className="absolute inset-0 bg-blue-500 opacity-40 z-10"></div>
        <div
          className={`max-w-[1280px] relative flex lg:${
            language === "en" ? "flex-row-reverse" : "flex-row"
          } flex-col-reverse lg:justify-between justify-center items-center lg:py-40 py-10 lg:gap-0 gap-2 lg:w-[50%] w-full mx-auto z-20`}
        >
          <div>
            <Button
              variant="register"
              className="mt-10 rounded-2xl h-[52px] w-[140px]"
            >
              {t.buttonText}
            </Button>
          </div>
          <div className="">
            <h1 className="text-[60px] text-white text-center lg:text-end font-bold">
              {t.title}
            </h1>
            <p className="text-white lg:text-end">{t.subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleSection;
