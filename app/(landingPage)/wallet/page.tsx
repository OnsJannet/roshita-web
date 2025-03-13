"use client";
import React, { useEffect, useState } from "react";
import { Bell, LogOut, MonitorCheck, Settings, UserRound } from "lucide-react";
import AppointementsCard from "@/components/unique/AppointementsCard"; // Adjust the import path as needed
import { useRouter } from "next/navigation";
import { fetchProfileDetails } from "@/lib/api";
import LoadingDoctors from "@/components/layout/LoadingDoctors";

type Language = "ar" | "en";

const translations = {
  en: {
    settings: "Settings",
    changePassword: "Change Password",
    appointments: "My Appointments",
    consultations: "My Consultations",
    notification: "Notifications",
    logout: "Log Out",
    next: "Next",
    previous: "Previous",
    noAppointments: "No appointments to display",
  },
  ar: {
    settings: "الإعدادات",
    changePassword: "تغير كلمة المرور",
    appointments: "مواعيدي",
    consultations: "استشارتي",
    logout: "تسجيل الخروج",
    notification: "إشعارات",
    next: "التالي",
    previous: "السابق",
    noAppointments: "لا توجد مواعيد لعرضها",
  },
};

interface EditProfileData {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    id: string;
  };
  gender: string; // "male", "female", etc.
  service_country: number; // assuming this is an ID for a country
  birthday: string; // ISO date string
  city: number; // assuming this is an ID for the city
  user_type: number; // assuming this is an ID for user type
  address: string;
}

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
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<EditProfileData>({
    user: {
      first_name: "",
      last_name: "",
      email: "",
      id: "",
    },
    gender: "",
    service_country: 2,
    birthday: "",
    city: 1,
    user_type: 0,
    address: "",
  });

  const patientId = "9";

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
    const loadProfileData = async () => {
      try {
        const data = await fetchProfileDetails();

        // Check the structure of the fetched data
        console.log("Fetched profile data:", data);

        // Update profileData with the fetched data
        setProfileData({
          user: {
            first_name: data.user?.first_name || "",
            last_name: data.user?.last_name || "",
            email: data.user?.email || "",
            id: data.user?.id || "",
          },
          gender: data.gender || "",
          service_country: data.service_country || 2, // Ensure default values are not 0
          birthday: data.birthday || "",
          city: data.city || 1, // Ensure default values are not 0
          user_type: data.user_type || 0,
          address: data.address || "",
        });
      } catch (error) {
        console.error("Error loading profile data", error);
      }
    };

    loadProfileData();
  }, []);

  const fetchNotifications = async (patientId: string) => {
    try {
      const token = localStorage.getItem("access");
      console.log("Access Token:", token); // Debugging

      if (!token) {
        throw new Error("No access token found. Please log in.");
      }

      const response = await fetch(
        `http://test-roshita.net/api/notifications/${patientId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch notifications: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications(profileData.user.id);
        setNotifications(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [patientId, profileData]);

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

  const handleConsultationsClick = () => {
    router.push("/consultations");
  };

  const handleError = (errorMessage: string) => {
    console.error("Error from child:", errorMessage);
    setErrorMessage(errorMessage);
    // Handle the error (e.g., show a notification or update the state)
  };

  console.log("filteredAppointments", filteredAppointments);

  // Render loading or error states after all hooks are called
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen mx-auto">
        <LoadingDoctors />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
                <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center overflow-hidden">
                  <UserRound className="w-1/2 h-1/2 text-roshitaBlue" />
                </div>
              </div>
            </div>
            <div>
              <div
                onClick={handleSettingsClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].settings}</p>
              </div>
              <div
                onClick={handleSettingsPasswordClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].changePassword}</p>
              </div>
              <div
                onClick={handleAppointmentsClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <MonitorCheck className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].appointments}</p>
              </div>
              <div
                onClick={handleConsultationsClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <MonitorCheck className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].consultations}</p>
              </div>
              <div
                onClick={handleAppointmentsClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].notification}</p>
              </div>
              <div
                onClick={handleLogout}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <LogOut className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].logout}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-10 text-end flex-col w-[80%] mx-auto">
            {/* New Card */}
            <div
              className="bg-white p-6 rounded-lg"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <div className="flex justify-start gap-2 items-center">
                <Bell className="mb-4 text-roshitaDarkBlue" />
                <h2
                  className={`text-xl font-bold text-gray-800 mb-4 ${
                    language === "ar" ? "text-start" : "text-end"
                  }`}
                >
                  {language === "ar"
                    ? "تم قبول حالتك في مستشفى الصحة من قبل د زياد"
                    : "Your case has been accepted at Al-Seha Hospital by Dr. Ziad"}
                </h2>
              </div>
              <button
                className={`text-white bg-roshitaDarkBlue border-none focus:outline-none py-2 px-4 rounded-md ${
                  language === "ar" ? "text-start" : "text-end"
                }`}
              >
                {language === "ar" ? "عرض" : "Show"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
