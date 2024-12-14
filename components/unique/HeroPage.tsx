"use client"
import { useEffect, useState } from "react";
import Filters from "../shared/Filters";
import { Button } from "../ui/button";
import Cta from "./Cta";

const HeroPage = () => {
  const [language, setLanguage] = useState<string>("");

  useEffect(() => {
    if (!language) {
      const storedLanguage = sessionStorage.getItem("language");
      console.log("Stored Language:", storedLanguage);
      if (storedLanguage) {
        setLanguage(storedLanguage);
      } else {
        setLanguage("ar"); // Default language if none is set
      }
    }
  }, [language]);

  console.log("languages: " + language)

  return (
    <div>
      <div
        className={`w-full flex h-[80vh] ${
          language === "en" ? "lg:flex-row-reverse" : "lg:flex-row"
        } flex-col`}
      >
        <div
          className={`lg:w-1/2 w-full p-20 text-center flex flex-col justify-center ${
            language === "en" ? "text-left" : "text-end"
          }`}
        >
          <div className="mx-auto">
            <h1
              className={`text-[60px] ${
                language === "en" ? "text-roshitaBlue" : "text-roshitaBlue"
              }`}
            >
              {language === "en" ? "Medical Care" : "رعاية طبية"}
            </h1>
            <h1 className="text-[35px]">
              {language === "en" ? "Between Tunisia and Libya" : "بين تونس وليبيا"}
            </h1>
            <p className="text-[18px] mt-4 text-[#909090]">
              {language === "en"
                ? "Providing medical consultations and answering all inquiries"
                : "لتقديم الاستشارات الطبية واستفسار كافة المعلومات"}
            </p>
            <Button
              variant="register"
              className="mt-10 rounded-2xl h-[52px] w-[140px]"
            >
              {language === "en" ? "Download App" : "حمل التطبيق"}
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2 w-full h-full bg-roshitaBlue flex items-center justify-center">
          <img
            className="h-full w-auto"
            alt="hero page"
            src="/Images/HeroImage.png"
          />
        </div>
      </div>
      <div className="!z-[9999]">
        <Filters />
      </div>
    </div>
  );
};

export default HeroPage;
