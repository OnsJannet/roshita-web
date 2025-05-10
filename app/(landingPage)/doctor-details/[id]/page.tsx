"use client";
import LoadingDoctors from "@/components/layout/LoadingDoctors";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import DoctorCardInside from "@/components/unique/DoctorCardInside";
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

type AppointmentDate = {
  scheduled_date: string;
  start_time: string;
  end_time: string;
};

interface Doctor {
  doctor_id: number;
  name: string;
  specialty: string;
  city: string;
  address: string | null;
  image: string;
  price: number | null;
  rating: number | null;
  appointment_dates: AppointmentDate[];
  medical_organizations: MedicalOrganization[]; // Array of medical organizations
  reviewsCount: number;
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

/**
 * DoctorDetailsPage component:
 *
 * This page displays detailed information about a specific doctor. It includes:
 * - Fetching the doctor's details from an API using the doctor's ID passed in the URL.
 * - Displaying the doctor's information, such as name, specialty, rating, reviews, price, location, and image.
 * - Showing a carousel of available appointment times, where each time slot can be clicked to book an appointment.
 * - Displaying the doctor's working hours for each day of the week.
 * - The page dynamically handles language preferences (Arabic or English) and adjusts the UI based on the selected language.
 * - The language preference is stored and retrieved from localStorage, allowing the app to persist the user's language choice.
 * - The page includes functions to format dates, times, and display the day of the week in the selected language.
 * - A function is included to handle booking an appointment, which saves the appointment day and time to localStorage and redirects the user to an appointment page.
 */

const DoctorDetailsPage = () => {
  const params = useParams();
  const id = parseInt(
    Array.isArray(params?.id) ? params.id[0] : params?.id ?? "",
    10
  );

  const [language, setLanguage] = useState<Language>("ar");
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  // Fetch doctors from the API
  const fetchDoctors = async () => {
    try {
      setIsLoading(true); // Start loading
      const response = await fetch(
        `https://test-roshita.net/api/user-doctors/${id}/`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "X-CSRFToken":
              "rquDldN5xzfxmgsqkc9SyFHxXhrzOvrkLbz03SVR3D5Fj6F8nOdG3iSrUINQgzBg", // Include CSRF token if needed
          },
          redirect: "follow", // Automatically follow redirects
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("response result result", result.data.doctors[0]);

        setDoctor(result.data.doctors[0]);
      } else {
        console.error("Failed to fetch doctors", await response.json());
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchDoctors();

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
  }, [id]);

  useEffect(() => {
    // Fetch doctor data on mount
    fetchDoctors();

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
  }, [id]); // Re-run if 'id' changes

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen text-center ${
          language === "ar" ? "text-right" : "text-left"
        }`}
      >
        {/*<p className="text-lg font-semibold">
          {language === "ar"
            ? "جاري تحميل تفاصيل الطبيب"
            : "Loading doctor details..."}
        </p>*/}
        <LoadingDoctors />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen text-center ${
          language === "ar" ? "text-right" : "text-left"
        }`}
      >
        <p className="text-lg font-semibold">
          {language === "ar"
            ? "لا يمكن العثور على تفاصيل الطبيب"
            : "Doctor details not found"}
        </p>
      </div>
    );
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
  const formatDate = (scheduledDate: string) => {
    const date = new Date(scheduledDate); // Scheduled date is already in YYYY-MM-DD
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Function to format the time
  const formatTime = (scheduledDate: string, startTime: string) => {
    // Combine scheduled date and start time to form a valid ISO 8601 string
    const dateTime = new Date(`${scheduledDate}T${startTime}`);
    return dateTime.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Function to handle appointment booking
  const handleBooking = (
    dateString: string,
    timeString: string,
    endDate: string
  ) => {
    const appointmentDay = dateString;
    const appointmentTime = timeString;
    const appointmentEndTime = endDate;

    // Save appointment day and time to localStorage
    localStorage.setItem("appointmentDay", appointmentDay);
    localStorage.setItem("appointmentTime", appointmentTime);
    localStorage.setItem("appointmentEndTime", appointmentEndTime);

    // Navigate to the appointment page
    window.location.href = `/appointment/${doctor.doctor_id}`;
  };

  // Function to filter out past dates
  const filterFutureDates = (appointments: AppointmentDate[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate date comparison
    
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.scheduled_date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate >= today;
    });
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
        doctor_id={doctor.doctor_id}
        id={doctor.doctor_id}
        name={doctor.name}
        specialty={doctor.specialty}
        rating={doctor.rating}
        reviewsCount={doctor.reviewsCount}
        //@ts-ignore
        price={`${doctor.price} ${language === 'ar' ? 'د.ل' : 'DL'}`}
        location={doctor.city}
        city={doctor.city}
        imageUrl={doctor.image}
        address={doctor.address ?? ""}
        appointment_dates={doctor.appointment_dates.map(
          (appointment) =>
            `${appointment.scheduled_date} (${appointment.start_time} - ${appointment.end_time})`
        )}
        medical_organizations={doctor.medical_organizations || []}
      />

      {/* Appointments Carousel */}
      <div className="max-w-[1280px] flex lg:flex-row-reverse gap-10 flex-col">
        <div className="bg-white border-2 border-gray-200 rounded-lg lg:w-full w-[90%] mx-auto mt-10 mb-10 text-end p-8">
          <h2
            className={`text-xl font-semibold mb-4 text-roshitaBlue ${
              language === "en" ? "text-start" : ""
            }`}
          >
            {translations[language].availableTimes}
          </h2>
          {doctor.appointment_dates.length !== 0 ? (
            <Carousel>
              <CarouselPrevious className="bg-gray-300" />
              <CarouselNext className="bg-gray-300" />
              <CarouselContent className="flex justify-center">
                {filterFutureDates(doctor.appointment_dates).map((appointment, index) => (
                  <CarouselItem
                    key={index}
                    className="p-4 rounded-md md:basis-1/2 lg:basis-1/6"
                  >
                    <div className="p-1">
                      <Card className="rounded">
                        <CardTitle className="p-4 bg-roshitaBlue rounded text-white text-center">
                          {getDayOfWeekInLanguage(appointment.scheduled_date)}
                        </CardTitle>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <span className="text-2xl font-semibold">
                            {formatDate(appointment.scheduled_date)}
                          </span>
                          <span className="text-xl font-medium">
                            {formatTime(
                              appointment.scheduled_date,
                              appointment.start_time
                            )}
                          </span>
                        </CardContent>
                        <CardFooter
                          onClick={() =>
                            handleBooking(
                              formatDate(appointment.scheduled_date),
                              formatTime(
                                appointment.scheduled_date,
                                appointment.start_time
                              ),
                              formatTime(
                                appointment.scheduled_date,
                                appointment.end_time
                              )
                            )
                          }
                          className="p-4 bg-roshitaBlue rounded cursor-pointer text-white text-center font-bold flex justify-center"
                        >
                          {translations[language].book}
                        </CardFooter>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <div className="text-center font-semibold text-xl text-gray-500 my-[100px]">
              {language === "en"
                ? "No appointments to show"
                : "لا توجد مواعيد لعرضها"}
            </div>
          )}
        </div>

        {/* Working Hours */}
        {/*<div className="bg-white border-2 border-gray-200 rounded-lg lg:w-1/2 w-[90%] mx-auto mt-10 mb-10 text-end p-8">
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
                  {translations[language][day]}
                </div>
                <div className="text-gray-700 flex gap-2 flex-row-reverse items-center">
                  <Clock className="h-4 w-4 text-roshitaBlue" />
                  {translations[language].timeFormat}
                </div>
              </div>
            ))}
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default DoctorDetailsPage;
