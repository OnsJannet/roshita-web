"use client";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import DoctorCardInside from "@/components/unique/DoctorCardInside";
import { doctors } from "@/constant";
import { Clock } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type Language = "ar" | "en";

// Define the structure of translations
interface Translations {
  availableTimes: string;
  workingHours: string;
  book: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  timeFormat: string;
}

const DoctorDetailsPage = () => {
  const params = useParams();
  const id = parseInt(
    Array.isArray(params?.id) ? params.id[0] : params?.id ?? "",
    10
  );

  const [language, setLanguage] = useState<Language>("ar");

  const translations: Record<Language, Translations> = {
    ar: {
      availableTimes: "أوقات المتاحة",
      workingHours: "أوقات العمل",
      book: "أحجــز",
      monday: "الاثنين",
      tuesday: "الثلاثاء",
      wednesday: "الأربعاء",
      thursday: "الخميس",
      friday: "الجمعة",
      saturday: "السبت",
      timeFormat: "09:00 - 18:00",
    },
    en: {
      availableTimes: "Available Times",
      workingHours: "Working Hours",
      book: "Book",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      timeFormat: "09:00 - 18:00",
    },
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
  }, []); // Run only once on mount

  // Find the doctor by ID
  const doctor = doctors.find((doc) => doc.doctor_id === id);

  if (!doctor) {
    return <div>Doctor not found</div>;
  }

  // Function to get day of the week in Arabic
  const getDayOfWeekInLanguage = (dateString: string) => {
    const daysOfWeek =
      language === "ar"
        ? [
            "الأحد",
            "الإثنين",
            "الثلاثاء",
            "الأربعاء",
            "الخميس",
            "الجمعة",
            "السبت",
          ]
        : [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];

    const date = new Date(dateString);
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
  };

  // Function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Function to format the time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Function to handle appointment booking
  const handleBooking = (dateString: string, timeString: string) => {
    const appointmentDay = dateString;
    const appointmentTime = timeString;

    // Save appointment day and time to localStorage
    localStorage.setItem("appointmentDay", appointmentDay);
    localStorage.setItem("appointmentTime", appointmentTime);

    // Navigate to the appointment page
    window.location.href = `/appointment/${doctor.doctor_id}`;
  };

  // Define the days array as an array of keys from Translations
  const weekdays: Array<keyof Translations> = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  return (
    <div className="container mx-auto p-4 max-w-[1280px]">
      {/* Doctor Details */}
      <DoctorCardInside
        key={doctor.doctor_id}
        id={doctor.doctor_id}
        name={doctor.name}
        specialty={doctor.specialty}
        rating={doctor.rating}
        reviewsCount={doctor.reviewsCount}
        price={doctor.price}
        location={doctor.location}
        imageUrl={doctor.imageUrl}
      />

      {/* Appointments Carousel */}
      <div className="max-w-[1280px] flex lg:flex-row-reverse gap-10 flex-col">
        <div className="bg-white border-2 border-gray-200 rounded-lg lg:w-1/2 w-[90%] mx-auto mt-10 mb-10 text-end p-8">
          <h2
            className={`text-xl font-semibold mb-4 text-roshitaBlue ${
              language === "en" ? "text-start" : ""
            }`}
          >
            {translations[language].availableTimes}
          </h2>
          <Carousel>
            <CarouselPrevious className="bg-gray-300" />
            <CarouselNext className="bg-gray-300" />
            <CarouselContent>
              {doctor.appointment_dates.map((date, index) => (
                <CarouselItem
                  key={index}
                  className="p-4 rounded-md md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card className="rounded">
                      <CardTitle className="p-4 bg-roshitaBlue rounded text-white text-center">
                        {getDayOfWeekInLanguage(date)}
                      </CardTitle>
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <span className="text-2xl font-semibold">
                          {formatDate(date)}
                        </span>
                        <span className="text-xl font-medium">
                          {formatTime(date)}
                        </span>
                      </CardContent>
                      <CardFooter
                        onClick={() =>
                          handleBooking(formatDate(date), formatTime(date))
                        }
                        className="p-4 bg-roshitaBlue rounded text-white !text-center font-bold flex justify-center"
                      >
                        {translations[language].book}
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Working Hours */}
        <div className="bg-white border-2 border-gray-200 rounded-lg lg:w-1/2 w-[90%] mx-auto mt-10 mb-10 text-end p-8">
          <h2
            className={`text-xl font-semibold mb-4 text-roshitaBlue ${
              language === "en" ? "text-start" : ""
            }`}
          >
            {translations[language].availableTimes}
          </h2>

          <div className="space-y-2">
            {weekdays.map((day, index) => (
              <div
                key={index}
                className={`flex justify-between lg:${
                  language === "en" ? "flex-row" : "flex-row-reverse"
                } border-b border-dotted border-gray-300 pb-2`}
              >
                <div className="text-gray-700 font-semibold text-2xl">
                  {translations[language][day]} {/* Accessing day key */}
                </div>
                <div className="text-gray-700 flex gap-2 flex-row-reverse items-center">
                  <Clock className="h-4 w-4 text-roshitaBlue" />
                  {translations[language].timeFormat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsPage;
