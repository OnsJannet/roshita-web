"use client";
import React, { useEffect, useState } from "react";

type Language = "ar" | "en"; // Define allowed languages
const CurrentYear = new Date().getFullYear();

const Footer = () => {
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

  return (
    <footer className="bg-[#F2F7FF] p-4">
      <div className="flex flex-col justify-center max-w-[1280px] mx-auto py-8">
        <img
          src="/logos/ShortLogo.png"
          alt="short logo"
          className="w-20 h-20 mx-auto"
        />
        <h1 className="mx-auto mt-6 lg:text-[18px] text-[16px] font-[600]">
          {language === "ar" ? "روشــــــــيتــــــا" : "Roshita"}
        </h1>
        <p className="font-[500] lg:text-[16px] text-[12px] mx-auto">
          {language === "ar" ? "صحــة أفضل" : "Better Health"}{" "}
          <span className="text-roshitaGreen">
            {language === "ar" ? "تواصـــــل أســـرع" : "Faster Communication"}
          </span>{" "}
        </p>
        <p className="mx-auto mt-6">
          {language === "ar"
            ? `${CurrentYear} الحقوق محفوظة لمنصة روشيتا©`
            : `© ${CurrentYear} All rights reserved by Roshita`}
        </p>
        <div className="mt-6 flex gap-4 justify-center mx-auto">
          <img
            src="/logos/applestore.png"
            alt="App Store"
            className="w-[200px] h-14 mx-auto"
          />
          <img
            src="/logos/googleplay.png"
            alt="Google Play"
            className="w-[200px] h-14 mx-auto"
          />
        </div>
        <div className="flex justify-center w-[20%] mx-auto mt-4 gap-4">
          <a
            href="https://www.facebook.com/profile.php?id=61569619920180"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/logos/facebooklogo.png"
              alt="Facebook"
              className="w-[15px] h-[25px] cursor-pointer"
            />
          </a>
          <a
            href="https://www.instagram.com/roshita_healthcare/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/logos/iglogo.png"
              alt="Instagram"
              className="w-6 h-6 cursor-pointer"
            />
          </a>
          {/*<a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
            <img
              src="/logos/whatsapplogo.png"
              alt="WhatsApp"
              className="w-6 h-6 cursor-pointer"
            />
          </a>*/}
          <a
            href="https://www.linkedin.com/company/roshitahealthcare/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/logos/linkedinlogo.png"
              alt="LinkedIn"
              className="w-6 h-6 cursor-pointer"
            />
          </a>
          {/*<a
            href="https://www.messenger.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/logos/messengerlogo.png"
              alt="Messenger"
              className="w-6 h-6 cursor-pointer"
            />
          </a>
          <a
            href="https://www.tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/logos/tiktoklogo.png"
              alt="TikTok"
              className="w-6 h-6 cursor-pointer"
            />
          </a>*/}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
