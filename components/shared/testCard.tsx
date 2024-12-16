import { useEffect, useState } from "react";
import DeleteButton from "../layout/DeleteButton";

interface CardProps {
  name: string;
  price: string;
  onDelete: () => void;
}

type Language = "ar" | "en";

const TestCard: React.FC<CardProps> = ({ name, price, onDelete }) => {
  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage as Language);
    } else {
      setLanguage("ar");
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "language") {
        setLanguage((event.newValue as Language) || "ar");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div
      className={`flex flex-col lg:gap-0 gap-6 items-center justify-between border rounded-lg p-4 bg-white ${
        language === "ar" ? "rtl lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      <div
        className={`flex ${
          language === "ar" ? "flex-row-reverse" : "flex-row"
        } w-[60%]`}
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 bg-[#71c9f9] rounded-full">
          <div className="w-8 h-8 bg-[url('/Images/labs.png')] bg-center bg-no-repeat bg-contain"></div>
        </div>

        <div className="flex-1 mr-4 flex items-center justify-between flex-row">
          {/* Text Section */}

          <div className={`flex ${language === "ar" ? "mr-4" : "ml-4"} `}>
            <div className="text-lg font-bold text-gray-800">{name}</div>
          </div>

          <div className="mr-4">
            <div className="text-lg font-bold text-gray-800">{price}</div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <DeleteButton onConfirm={onDelete} />
      </div>
    </div>
  );
};

export default TestCard;
