import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Banknote, Calendar, MapPin } from "lucide-react";
import { AcceptAppointment } from "../shared/accpetAppoitment"; // Ensure the path is correct for this import
import { paiement } from "@/constant";

type DoctorCardAppointmentProps = {
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  price: string;
  location: string;
  imageUrl: string;
  id: number;
  day: string;
  time: string;
  medical_organizations: { id: number; name: string };
};



type Language = "ar" | "en";

const DoctorCardAppointment: React.FC<DoctorCardAppointmentProps> = ({
  name,
  specialty,
  price,
  location,
  imageUrl,
  day,
  time,
  medical_organizations
}) => {
  const [step, setStep] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [language, setLanguage] = useState<Language>("ar");

  const handleClick = (id: number) => {
    setSelectedId(id);
  };

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

  return (
    <div className="shadow-lg py-10 mt-2 max-w-[1280px] rounded-2xl">
      {step === 1 && (
        <>
          <h2 className="text-center font-semibold lg:text-4xl text-2xl">
            {language === "en" ? "Booking Confirmation" : "تأكيد الحجز"}
          </h2>
          {/* Right Section: Doctor Info */}
          <div
            className={`flex flex-1 ${
              language === "en" ? "justify-end flex-row-reverse" : "justify-end"
            } gap-4 lg:px-40 lg:py-10 p-4`}
          >
            {/* Doctor's Details */}
            <div
              className={`flex flex-col ${
                language === "en" ? "items-start " : "items-end"
              }`}
            >
              <h1 className="lg:text-2xl text-xl font-bold text-gray-800 mb-1">
                {name}
              </h1>
              <p className="text-sm text-gray-500 mb-2 text-end">{specialty}</p>
              <div
                className={`flex items-center text-sm text-gray-600 mb-1 mt-2 gap-2 ${
                  language === "en" ? "flex-row-reverse" : ""
                }`}
              >
                <span>
                  {language === "en" ? "Price: " : "سعر الكشف: "} {price}
                </span>
                <Banknote className="text-roshitaDarkBlue" />
              </div>

              <div
                className={`flex items-center text-sm text-gray-600 mb-1 mt-2 gap-2 ${
                  language === "en" ? "flex-row-reverse" : ""
                }`}
              >
                <p className="text-sm text-gray-500">
                  {language === "en" ? "Location: " : ""}
                  {location}
                </p>
                <MapPin className="text-roshitaDarkBlue" />
              </div>

              <h1
                className={`lg:text-2xl text-xl font-bold text-gray-800 mb-1 mt-4 flex gap-2 items-center ${
                  language === "en" ? "flex-row-reverse" : ""
                }`}
              >
                {language === "en" ? "Day" : "اليوم"}{" "}
                <Calendar className="text-roshitaDarkBlue w-6 h-6" />
              </h1>

              <p>
                {time} {day}
              </p>

              {/* Navigate to Step 2 Button */}
              <Button onClick={() => setStep(2)} className="mt-4">
                {language === "en"
                  ? "Proceed to Payment"
                  : "الانتقال إلى الدفع"}
              </Button>
            </div>

            {/* Doctor's Image */}
            <div className="ml-4 h-[120px] w-[120px] rounded-full bg-roshitaBlue flex justify-center items-center overflow-hidden">
              <img
                src={imageUrl}
                alt={name}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="lg:p-20 p-4">
          <h2 className="text-center font-semibold lg:text-4xl text-2x">
            {language === "en" ? "Payment Methods" : "طــــرق الدفـــع"}
          </h2>
          {/* Payment Section */}
          <div
            className={`flex flex-col p-4 ${
              language === "en" ? "text-start" : "text-end"
            }`}
          >
            {/* Payment Details */}
            <div className={`text-${language === "en" ? "start" : "end"} mb-4`}>
              <p className="text-gray-600 mb-2 pb-2 text-center">
                {language === "en"
                  ? "Select the payment method available to you"
                  : "أختار الطريقــة المعاملة التي موجودة لديــــــك"}
              </p>
              <p
                className={`text-gray-600 mb-2 pb-2 text-2xl font-semibold ${
                  language === "en" ? "text-start" : "text-end"
                }`}
              >
                {language === "en" ? "Choose your card" : "أختـــار البطــاقة"}
              </p>
              <div>
                <div className="flex flex-wrap gap-4">
                  {paiement.map((option) => (
                    <div
                      key={option.id}
                      className={`flex ${
                        language === "en" ? "flex-row" : "flex-row-reverse"
                      } justify-start gap-2 items-center p-4 rounded-lg cursor-pointer transition-colors w-full ${
                        selectedId === option.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                      onClick={() => handleClick(option.id)}
                    >
                      <img
                        src={option.image}
                        alt={language === "en" ? option.name_en : option.name} // Use name_en for English
                        className="w-16 h-16 mb-2 object-contain"
                      />
                      <span className="text-lg font-semibold">
                        {language === "en" ? option.name_en : option.name}{" "}
                        {/* Use name_en if language is en */}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Accept Appointment Button */}
            <AcceptAppointment
              name={name}
              specialty={specialty}
              rating={0}
              reviewsCount={0}
              price={price}
              location={location}
              imageUrl={imageUrl}
              id={1}
              day={day}
              time={time}
              medical_organizations={medical_organizations}
              paymentMethod={selectedId ? paiement.find((option) => option.id === selectedId) : null}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorCardAppointment;
