import React, { useState, useEffect } from "react";
import { Button } from "../ui/button"; // Assuming you have a button component
import { Banknote, LocateIcon, MapPin, Star, StarHalf } from "lucide-react";

interface DoctorCardInsideProps {
  doctor_id: number;
  id: number;
  name: string;
  specialty: string;
  city: string;
  address: string | null;
  imageUrl: string;
  price: number | null;
  rating: number | null;
  appointment_dates: string[]; // Array of date strings
  medical_organizations: MedicalOrganization[]; // Array of medical organizations
  reviewsCount: number; // Number of reviews
  location: string | null;
}

interface MedicalOrganization {
  id: number;
  name: string;
  foreign_name: string;
  phone: string;
  email: string;
  city: City;
  address: string;
  Latitude: number;
  Longitude: number;
}

interface City {
  id: number;
  country: Country;
  name: string;
  foreign_name: string;
}

interface Country {
  id: number;
  name: string;
  foreign_name: string;
}

type Language = "ar" | "en";

const DoctorCardInside: React.FC<DoctorCardInsideProps> = ({
  name,
  specialty,
  rating,
  reviewsCount,
  price,
  location,
  imageUrl,
  id,
}) => {
  const [language, setLanguage] = useState<Language>("ar");
  console.log("id", id);

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

  // Translations object
  const translations = {
    en: {
      priceLabel: "Price",
      locationLabel: "Location",
    },
    ar: {
      priceLabel: "سعر الكشف",
      locationLabel: "الموقع",
    },
  };

  return (
    <div
      className={`flex flex-col justify-between md:flex-${
        language === "en" ? "row-reverse" : "row"
      } p-4 bg-white rounded-xl mx-auto lg:p-10`}
    >
      {/* Left Section: Rating and Button */}
      <div className="flex lg:flex-col flex-row justify-between p-4">
        <div className="flex items-center mb-2">
          {/*<span className="text-gray-500 text-sm ml-2">({reviewsCount})</span>*/}
          {/* Star Rating */}
          <div className="flex text-yellow-500">
            {Array.from({ length: 5 }, (_, i) => {
              // Ensure that rating is not null by defaulting to 0
              const safeRating = rating ?? 0; // Default to 0 if rating is null

              // Check if it's a full star or a half star
              if (i + 1 <= safeRating) {
                return <Star key={i} className="h-5 w-5 fill-yellow-500" />;
              } else if (i + 0.5 <= safeRating) {
                return <StarHalf key={i} className="h-5 w-5 fill-yellow-500" />;
              } else {
                return <Star key={i} className="h-5 w-5 text-gray-300" />;
              }
            })}
          </div>
        </div>
      </div>

      {/* Right Section: Doctor Info */}
      <div
        className={`flex  ${
          language === "en" ? "justify-start  flex-row-reverse" : "justify-end"
        } gap-4 items-center p-4`}
      >
        {/* Doctor's Details */}
        <div className="flex flex-col items-end">
          <h1
            className={`text-2xl  ${
              language === "en" ? "text-start w-full" : "ext-end"
            } font-bold text-gray-800 mb-1 `}
          >
            {name}
          </h1>

          <p
            className={`text-sm text-gray-500 mb-2 ${
              language === "ar" ? "text-end" : ""
            } w-full`}
          >
            {specialty}
          </p>

          <div
            className={` flex items-center text-sm text-gray-600 mb-1 mt-2 gap-2  ${
              language === "en"
                ? "flex-row-reverse justify-end w-full"
                : "justify-start"
            }`}
          >
            <span>
              {translations[language].priceLabel}:{" "}
              {price && price !== 0
                ? price
                : language === "en"
                ? "No price available"
                : "لا يوجد سعر"}
            </span>

            <Banknote className="text-roshitaDarkBlue" />
          </div>

          <div
            className={`flex items-center text-sm text-gray-600 mb-1 mt-2 gap-2 ${
              language === "en" ? "flex-row-reverse w-full" : ""
            }`}
          >
            <p className="text-sm text-gray-500">
              {translations[language].locationLabel}: {location}
            </p>
            <MapPin className="text-roshitaDarkBlue" />
          </div>
        </div>

        {/* Doctor's Image */}
        <div className="ml-4 h-40 w-40 rounded-full bg-roshitaBlue flex justify-center items-center overflow-hidden">
          <img
            src={
              imageUrl &&
              imageUrl !== null &&
              !imageUrl.startsWith("/media/media/")
                ? `https://test-roshita.net/${imageUrl}`
                : "/Images/default-doctor.jpeg"
            }
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorCardInside;
