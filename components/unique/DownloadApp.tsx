"use client";
import React, { useEffect, useState } from "react";

type Language = "ar" | "en"; // Define allowed languages

const DownloadApp: React.FC = () => {
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

  // Translations for the component
  const translations: Record<
    Language,
    { title: string; description: string; downloadButton: string }
  > = {
    ar: {
      title: "حمّل تطبيق <span class='text-roshitaBlue'>روشيتا</span>",
      description:
        "حجز وارسال استشارات طبية مع توفر أكبر شبكة بين دكاترة ليبيا وتونس",
      downloadButton: "تحميـــــل",
    },
    en: {
      title: "Download the <span class='text-roshitaBlue'>Rosheta</span> App",
      description:
        "Book and send medical consultations with the largest network between Libya and Tunisia.",
      downloadButton: "Download",
    },
  };

  return (
    <div className="p-6 max-w-[1200px] lg:h-[320px] h-auto mx-auto flex lg:flex-row flex-col rounded-md justify-between items-center lg:p-20">
      {/* Phone Image Section */}
      <div className="flex justify-center lg:justify-start mb-6 lg:mb-0 w-[30%]">
        <img
          src="/Images/Phone.png"
          alt="phone application"
          className="lg:w-[80%] w-40 max-w-[600px] lg:max-w-[300px] mt-[14px]"
        />
      </div>

      {/* Text and Button Section */}
      <div className="flex-1 lg:text-left w-[50%]">
        <h2
          className="text-black text-2xl lg:text-[40px] font-bold mb-8 lg:text-end text-center"
          dangerouslySetInnerHTML={{ __html: translations[language].title }}
        />
        <p className="text-black text-base font-[500] lg:text-2xl mb-6 lg:text-end text-center ">
          {translations[language].description}
        </p>
        <div
          className="flex justify-center lg:justify-end space-x-2 my-4 rounded-md"
          style={{ backgroundSize: "100% 100%" }}
        >
          <img
            src="/logos/applestore.png"
            alt="App Store"
            className="h-14 w-auto cursor-pointer"
          />
          <img
            src="/logos/googleplay.png"
            alt="Google Play"
            className="h-14 w-auto cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;