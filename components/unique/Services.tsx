'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const Services = () => {
  const [language, setLanguage] = useState<string>("");
  const router = useRouter(); // Initialize useRouter
  
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
        // Update the language state when the language in localStorage changes
        setLanguage(event.newValue || "ar");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Run only once on mount

  console.log("languages: " + language);

  const services = [
    {
      title: language === "ar" ? "صيدليات" : "Pharmacies",
      paragraph: language === "ar" 
        ? "تقديم كافة المعلومات حول الصيدليات" 
        : "Providing all information about pharmacies",
      image: "/Images/Pharmacies.png",
    },
    {
      title: language === "ar" ? "مستشفيات" : "Hospitals",
      paragraph: language === "ar" 
        ? "تقديم كافة معلومات مستشفيات" 
        : "Providing all information about hospitals",
      image: "/Images/Hospitals.png",
    },
    {
      title: language === "ar" ? "معامل تحاليل" : "Analysis Labs",
      paragraph: language === "ar" 
        ? "تقديم كافة المعلومات حول معامل تحاليل وتصوير" 
        : "Providing all information about analysis and imaging labs",
      image: "/Images/biotech.png",
    },
  ];

  const handleClick = () => {
    console.log("Button clicked"); // Debugging line
    router.push('/guide');
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-20">
      <h2 className="text-center text-roshitaDarkBlue text-4xl font-bold">
        {language === "ar" ? "الدليل الطبي" : "Medical Guide"}
      </h2>
      <p className="text-gray-700 text-center mt-4 text-2xl lg:w-[50%] w-[90%] mx-auto">
        {language === "ar" 
          ? "توفر كافة المعلومات عن المستشفيات الليبية والتونسية لتسهيل عمليات الحجز والاستشارة" 
          : "Providing all information about Libyan and Tunisian hospitals to facilitate booking and consultation processes"}
      </p>
      <div className="flex justify-center lg:gap-12 gap-8 mt-8 lg:flex-row-reverse mb-8 flex-col-reverse">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-6 lg:w-[30%] w-[80%] lg:h-[250px] h-[250px] flex flex-col items-center text-center gap-6 justify-center mx-auto"
            style={{
              boxShadow: "0 8px 26.6px rgba(0, 0, 0, 0.09)",
              zIndex: 9999,
            }}
          >
            <div className="flex flex-col items-center justify-center flex-grow">
              <img
                src={service.image}
                alt={service.title}
                className="h-[30px] w-[30px] object-contain mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600 text-[16px]">{service.paragraph}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mb-4">
        <Button
          variant="register"
          className="h-[72px] w-[200px] rounded-2xl text-[18px] font-semibold cursor-pointer z-[999999]"
          onClick={handleClick}
        >
          {language === "ar" ? "اسكتشف الدليل" : "Explore the Guide"}
        </Button>
      </div>
    </div>
  );
};

export default Services;
