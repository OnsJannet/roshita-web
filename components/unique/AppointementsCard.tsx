import { Banknote, Calendar, Clock, Trash } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";

type DoctorCardProps = {
  name: string;
  specialty: string;
  price: string;
  location: string;
  imageUrl: string;
  day: string;
  time: string;
  status: string;
};

type Language = "ar" | "en";

const AppointementsCard: React.FC<DoctorCardProps> = ({
  name,
  specialty,
  price,
  location,
  imageUrl,
  day,
  time,
  status: initialStatus, // renamed to avoid conflict with local state
}) => {
  const [status, setStatus] = useState(initialStatus); // Local state for status
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

  // Function to handle the cancellation
  const handleCancel = () => {
    // Retrieve appointments from localStorage
    const appointments = JSON.parse(
      localStorage.getItem("appointments") || "[]"
    );

    // Find the appointment and update its status to 'canceled'
    const updatedAppointments = appointments.map((appointment: any) => {
      if (appointment.doctorName === name && appointment.day === day) {
        return { ...appointment, status: "canceled" };
      }
      return appointment;
    });

    // Save the updated appointments back to localStorage
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));

    // Update local state to trigger re-render
    setStatus("canceled");

    // Confirmation alert
    alert(language === "ar" ? "تم إلغاء الموعد" : "Appointment canceled");
  };

  return (
    <div
      className={`flex ${
        language === "ar" ? "lg:flex-row-reverse" : "lg:flex-row"
      } flex-col p-4 bg-white shadow-lg rounded-xl w-full max-w-[80%] lg:max-w-[80%] mx-auto`}
    >
      {/* Right Section: Doctor Info */}
      <div
        className={`flex flex-1 ${
          language === "ar"
            ? "justify-between lg:flex-row"
            : "justify-between lg:flex-row-reverse"
        } gap-4 items-center p-4  flex-col-reverse`}
      >
        {/* Doctor's Details */}
        <div
          className={`flex flex-col ${
            language === "ar" ? "items-end" : "items-start"
          }`}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{name}</h1>
          <p className="text-sm text-gray-500 mb-2 text-end">{specialty}</p>
          <div className="bg-gray-100 lg:p-4 p-2 flex lg:flex-row flex-col w-full justify-between lg:gap-20 gap-4 rounded">
            <div
              className={`flex items-center text-sm text-gray-600 mb-1 mt-2 ${
                language === "ar" ? "flex-row-reverse" : ""
              } gap-2`}
            >
              <Clock className="text-roshitaDarkBlue" />
              <span>
                {language === "ar" ? `الوقت: ${time}` : `Time: ${time}`}
              </span>
            </div>
            <div
              className={`flex items-center text-sm text-gray-600 mb-1 mt-2 ${
                language === "ar" ? "flex-row-reverse" : ""
              } gap-2`}
            >
              <Calendar className="text-roshitaDarkBlue" />
              <span>{language === "ar" ? `اليوم: ${day}` : `Day: ${day}`}</span>
            </div>
            <div
              className={`flex items-center text-sm text-gray-600 mb-1 mt-2 ${
                language === "ar" ? "flex-row" : "flex-row-reverse"
              } gap-2`}
            >
              <span>
                {language === "ar" ? `سعر الكشف: ${price}` : `Price: ${price}`}
              </span>
              <Banknote className="text-roshitaDarkBlue" />
            </div>
          </div>

          {/* Cancel Button or Canceled Message */}
          <div
            className={`w-full flex ${
              language === "ar"
                ? "lg:justify-start justify-start"
                : "lg:justify-end justify-end"
            } mt-4`}
          >
            {status === "canceled" ? (
              <span className="text-red-500 text-lg">
                {language === "ar" ? "تم الإلغاء" : "Canceled"}
              </span>
            ) : (
              <Button
                className="bg-transparent border-transparent text-black text-lg shadow-none hover:bg-gray-50"
                onClick={handleCancel}
              >
                {language === "ar" ? "حذف" : "Cancel"}{" "}
                <Trash className="text-red-500 w-6 h-6 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Doctor's Image */}
        <div className="ml-4 h-40 w-40 rounded-full bg-roshitaBlue flex justify-center items-center overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default AppointementsCard;
