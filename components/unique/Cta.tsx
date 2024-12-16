'use client'
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

const Cta = () => {
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

  return (
    <div className="max-w-[1200px] mx-auto mt-20 bg-roshitaBlue mb-20 rounded-2xl h-60 flex">
      <div className="lg:!w-[40%] w-[100%] h-full">
        <img
          src="/Images/call-to-ation.png"
          alt=""
          className="lg:h-[105%] h-full w-[600px] object-cover rounded-2xl lg:-mt-[7px]"
        />
      </div>
      <div
        style={{
          width: "100%",
          height: "auto",
          backgroundImage: "url('/Images/BackgroundShape.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="p-8"
      >
        <h2 className="text-[#C31162] text-2xl font-bold text-end">
          {language === "ar" ? "قريبــــا" : "Coming Soon"}
        </h2>
        <h2 className="lg:text-4xl text-lg font-bold text-end text-white mt-1">
          {language === "ar" ? "هل لديك سؤال طبي؟" : "Do you have a medical question?"}
        </h2>
        <h2 className="lg:text-4xl text-lg font-medium text-end text-white mt-1">
          {language === "ar"
            ? "أرسل رسالة الي طبيب متخصص"
            : "Send a message to a specialist doctor"}
        </h2>
        <div className="flex flex-row-reverse mt-4">
          <Button className="bg-white p-4 text-black hover:text-white">
            {language === "ar" ? "أطلب استشارة" : "Request a Consultation"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cta;
