import React, { useState, useEffect } from "react";
import { Button } from "../ui/button"; // Assuming you have a button component
import { Banknote, Building, MapPin, Star, StarHalf } from "lucide-react";

interface DoctorCardProps {
  id: number;
  name: string;
  specialty: string;
  rating: number | null;
  reviewsCount: number;
  price: string;
  location: string;
  imageUrl: string;
  hospital: string | null;
}

type Language = "ar" | "en";

const DoctorCard: React.FC<DoctorCardProps> = ({
  name,
  specialty,
  rating,
  reviewsCount,
  price,
  location,
  imageUrl,
  id,
  hospital,
}) => {
  const handleButtonClick = () => {
    console.log("click button");
    window.location.href = `/doctor-details/${id}`;
  };

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
  }, []);

  const translations = {
    en: {
      bookNow: "Book Now",
      price: "Price: ",
      location: "Location: ",
      hospital: "hospital: ",
    },
    ar: {
      bookNow: "احجز الآن",
      price: "سعر الكشف: ",
      location: "الموقع: ",
      hospital: "مستشفى: ",
    },
  };

  return (
    <div
      className={`cursor-pointer flex flex-col  p-4 bg-white shadow-lg rounded-xl max-w-4xl mx-auto ${
        language === "en" ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      {/* Left Section: Rating and Button */}
      <div
        className={`${
          language === "en" ? "flex-row-reverse" : ""
        } flex lg:flex-col flex-row justify-between p-4`}
      >
        <div className="flex items-center mb-2">
          {/*<span className="text-gray-500 text-sm ml-2">({reviewsCount})</span>*/}
          {/* Star Rating */}
          <div className="flex text-yellow-500">
            {Array.from({ length: 5 }, (_, i) => {
              const safeRating = rating ?? 0; // Default to 0 if rating is null
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
        <Button
          className="mt-2 h-10 w-32 bg-roshitaDarkBlue text-white rounded-lg"
          onClick={handleButtonClick}
        >
          {translations[language].bookNow}
        </Button>
      </div>

      {/* Right Section: Doctor Info */}
      <div
        className={`${
          language === "en" ? "flex-row-reverse" : ""
        } flex flex-1 justify-end gap-4 items-center p-4`}
      >
        {/* Doctor's Details */}
        <div className="flex flex-col items-end">
          <h1
            className={`text-2xl font-bold text-gray-800 mb-1 w-full ${
              language === "en" ? "text-start" : "text-end"
            }`}
          >
            {name}
          </h1>

          <p
            className={`text-sm text-gray-500 mb-2 w-full ${
              language === "en" ? "text-start" : "text-end"
            }`}
          >
            {specialty}
          </p>

          {hospital && (
            <div
              className={`flex items-end text-sm text-gray-600 mb-1 mt-2 gap-2  ${
                language === "en"
                  ? "flex-row-reverse justify-end w-full"
                  : "justify-start flex-row"
              }`}
            >
              <span>
                {translations[language].hospital}
                {hospital}
              </span>
              <Building className="text-roshitaDarkBlue" />
            </div>
          )}

          <div
            className={`flex items-end text-sm text-gray-600 mb-1 mt-2 gap-2  ${
              language === "en"
                ? "flex-row-reverse justify-end w-full"
                : "justify-start flex-row"
            }`}
          >
            <span>
              {translations[language].price}
              {price}
            </span>
            <Banknote className="text-roshitaDarkBlue" />
          </div>

          <div
            className={`flex items-center text-sm text-gray-600 mb-1 mt-2 gap-2 w-full ${
              language === "en"
                ? "flex-row-reverse justify-end"
                : "justify-end flex-row"
            }`}
          >
            <p className="text-sm text-gray-500">
              {translations[language].location}
              {location}
            </p>
            <MapPin className="text-roshitaDarkBlue" />
          </div>
        </div>

        {/* Doctor's Image */}
        <div className="ml-4 h-40 w-40 rounded-full bg-roshitaBlue flex justify-center items-center overflow-hidden">
          <img
            src={
              imageUrl && imageUrl !== null
                ? imageUrl
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

export default DoctorCard;
