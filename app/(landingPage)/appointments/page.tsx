"use client";
import React, { useEffect, useState } from "react";
import { LogOut, MonitorCheck, Settings, UserRound } from "lucide-react";
import AppointementsCard from "@/components/unique/AppointementsCard"; // Adjust the import path as needed
import { useRouter } from "next/navigation";

type Language = "ar" | "en";

const translations = {
  en: {
    settings: "Settings",
    changePassword: "Change Password",
    appointments: "My Appointments",
    logout: "Log Out",
    next: "Next",
    previous: "Previous",
    noAppointments: "No appointments to display",
  },
  ar: {
    settings: "الإعدادات",
    changePassword: "تغير كلمة المرور",
    appointments: "مواعيدي",
    logout: "تسجيل الخروج",
    next: "التالي",
    previous: "السابق",
    noAppointments: "لا توجد مواعيد لعرضها",
  },
};

/**
 * The main user page where users can manage their appointments, change settings,
 * and log out from their account. The page adapts to the selected language (Arabic or English).
 *
 * Key Features:
 * - Language support: The page dynamically switches between Arabic and English based on user preference.
 * - Appointment filtering: Users can view either upcoming or past appointments using filtering options.
 * - Navigation: The page includes clickable options for settings, password change, appointments, and logging out.
 * - Data handling: Appointments are fetched from `localStorage` and displayed based on the selected filter.
 * - Appointment Cards: Each appointment is displayed using the `AppointementsCard` component, which shows details
 *   like doctor name, specialty, price, and appointment date/time.
 * - User profile section: Displays the user's avatar and provides navigation links to settings and password change pages.
 * - Local storage integration: The user's language preference and appointment data are saved in `localStorage`, and changes
 *   are automatically reflected in the UI.
 * - The page is structured using a responsive layout to ensure a smooth user experience across devices.
 */

const Page = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<"previous" | "next">("next"); // New state for filtering
  const router = useRouter(); // Initialize useRouter
  const [language, setLanguage] = useState<Language>("ar");
  const [errorMessage, setErrorMessage] = useState("");

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

  useEffect(() => {
    // Fetch the appointments from localStorage
    const storedAppointments = localStorage.getItem("appointments");
    if (storedAppointments) {
      const parsedAppointments = JSON.parse(storedAppointments);
      setAppointments(parsedAppointments);
      filterAppointments(parsedAppointments, "next"); // Set default to show next appointments
    }
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("access");
      try {
        const response = await fetch(
          "https://test-roshita.net/api/user-appointment-reservations/",
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("appointement data", data);

          // Use the `results` array for appointments
          const results = data.results || [];
          setAppointments(results);
          filterAppointments(results, "next"); // Set default to show next appointments
        } else {
          console.error("Failed to fetch appointments:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  /*const filterAppointments = (appointments: any[], type: 'previous' | 'next') => {
    const today = new Date();

    if (type === 'next') {
      // Show appointments where day > today
      const nextAppointments = appointments.filter(appointment => new Date(appointment.day) > today);
      setFilteredAppointments(nextAppointments);
    } else {
      // Show appointments where day <= today
      const previousAppointments = appointments.filter(appointment => new Date(appointment.day) <= today);
      setFilteredAppointments(previousAppointments);
    }
  };*/

  const filterAppointments = (
    appointments: any[],
    type: "previous" | "next"
  ) => {
    const today = new Date();

    if (type === "next") {
      const nextAppointments = appointments.filter(
        (appointment) =>
          new Date(appointment.reservation.reservation_date) > today
      );
      setFilteredAppointments(nextAppointments);
    } else {
      const previousAppointments = appointments.filter(
        (appointment) =>
          new Date(appointment.reservation.reservation_date) <= today
      );
      setFilteredAppointments(previousAppointments);
    }
  };

  const handleFilterChange = (type: "previous" | "next") => {
    setFilterType(type);
    filterAppointments(appointments, type);
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  };

  const handleSettingsClick = () => {
    router.push("/profile");
  };

  const handleAppointmentsClick = () => {
    router.push("/appointments");
  };

  const handleSettingsPasswordClick = () => {
    router.push("/password-change");
  };

  const handleError = (errorMessage: string) => {
    console.error("Error from child:", errorMessage);
    setErrorMessage(errorMessage);
    // Handle the error (e.g., show a notification or update the state)
  };

  console.log("filteredAppointments", filteredAppointments);

  return (
    <div className="flex justify-center flex-col p-8 bg-[#fafafa]">
      <div>
        <div
          className={`flex ${
            language === "ar" ? "lg:flex-row-reverse" : "lg:flex-row"
          } flex-col justify-start gap-10 mx-auto`}
        >
          <div className="flex lg:w-[20%] w-[100%] justify-start gap-10 mx-auto p-4 bg-white rounded flex-col">
            <div className="mx-auto flex justify-center">
              <div className="relative lg:w-60 lg:h-60 xl:w-20 xl:h-20 h-40 w-40">
                <div className="w-full h-full rounded-full bg-[#f1f1f1] flex items-center justify-center overflow-hidden">
                  <UserRound className="w-1/2 h-1/2 text-roshitaBlue" />
                </div>
              </div>
            </div>
            <div>
              <div
                onClick={handleSettingsClick}
                className="flex p-2 bg-[#F1F1F1] text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].settings}</p>
              </div>
              <div
                onClick={handleSettingsPasswordClick}
                className="flex p-2 bg-[#F1F1F1] text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].changePassword}</p>
              </div>
              <div
                onClick={handleAppointmentsClick}
                className="flex p-2 bg-[#F1F1F1] text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <MonitorCheck className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].appointments}</p>
              </div>
              <div
                onClick={handleLogout}
                className="flex p-2 bg-[#F1F1F1] text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <LogOut className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].logout}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-10 text-end flex-col lg:w-[80%] w-full mx-auto">
            <div className="flex justify-center bg-white w-[80%] mx-auto p-8 rounded">
              <div
                className={`p-4 text-center border-l-gray-300 w-1/2 cursor-pointer ${
                  filterType === "next" ? "font-bold" : ""
                }`}
                onClick={() => handleFilterChange("next")}
              >
                {translations[language].next}
              </div>
              <div
                className={`p-4 text-center border-l-2 border-l-gray-300 w-1/2 cursor-pointer ${
                  filterType === "previous" ? "font-bold" : ""
                }`}
                onClick={() => handleFilterChange("previous")}
              >
                {translations[language].previous}
              </div>
            </div>
            {errorMessage && (
              <div
                className={`text-red-500 bg-red-100 p-4 rounded lg:w-[80%] w-full mx-auto ${
                  language === "ar" ? "text-end" : "text-start"
                }`}
              >
                {errorMessage}
              </div>
            )}
            <div className="flex flex-col gap-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <AppointementsCard
                    key={appointment.id} // Using `id` as a unique key
                    appointementId={appointment.id}
                    doctorID={appointment.doctor.id}
                    name={`${appointment.doctor.name} ${appointment.doctor.last_name}`} // Doctor's full name
                    specialty={appointment.doctor.specialty} // Doctor's specialty
                    price={appointment.price} // Price of the appointment
                    location="" // No location provided in the data
                    imageUrl="" // No image URL provided in the data
                    day={new Date(
                      appointment.reservation.reservation_date
                    ).toLocaleDateString(language)} // Format reservation date
                    time={new Date(
                      appointment.reservation.reservation_date
                    ).toLocaleTimeString(language, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} // Format reservation time
                    appointementStatus={
                      appointment.reservation.reservation_status
                    }
                    status={appointment.reservation_status || ""}
                    onError={handleError}
                  />
                ))
              ) : (
                <div className="text-center text-gray-500">
                  {translations[language].noAppointments}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
