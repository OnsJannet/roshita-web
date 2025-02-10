"use client";
import React, { useEffect, useState } from "react";
import { Bell, LogOut, MonitorCheck, Settings, UserRound } from "lucide-react";
import AppointementsCard from "@/components/unique/AppointementsCard"; // Adjust the import path as needed
import { useRouter } from "next/navigation";
import { fetchProfileDetails } from "@/lib/api";
import LoadingDoctors from "@/components/layout/LoadingDoctors";
import ConsultationDropdown from "@/components/shared/ConsultationDropdown";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/shared/fileUploader";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [type, setType] = useState("with");
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [responses, setResponses] = useState<string[]>([]);
  const [profileData, setProfileData] = useState<EditProfileData>({
    user: {
      first_name: "",
      last_name: "",
      email: "",
    },
    gender: "",
    service_country: 2,
    birthday: "",
    city: 1,
    user_type: 0,
    address: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
    // You can now handle the files immediately, e.g., upload them to an API
    console.log("Files uploaded:", files);
  };

  const files = [
    { name: "Diagnosis", url: "/Images/drahmed.png" },
    { name: "Treatment", url: "/Images/drahmed.png" },
    { name: "Therapy Images", url: "/Images/drahmed.png" },
  ];

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

  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponseMessage(e.target.value);
  };

  const handleSendResponse = () => {
    if (responseMessage.trim() !== "") {
      setResponses([...responses, responseMessage]);
      setResponseMessage(""); // Clear the textarea after sending
    }
  };

  return (
    <div className="flex justify-center flex-col p-8 bg-[#fafafa]">
      <div>
        <div
          className={`flex ${
            language === "ar" ? "lg:flex-row-reverse" : "lg:flex-row"
          } flex-col justify-start gap-10 mx-auto`}
        >
          <div className="flex lg:w-[20%] w-[100%] justify-start gap-10 mx-auto p-4 bg-white rounded flex-col h-full">
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
          <div className="lg:w-[80%] bg-white p-4 rounded-md h-full">
            <div
              className="w-full h-40 sm:h-80 md:h-20 lg:h-[80px] xl:h-[280px] bg-cover bg-center bg-no-repeat rounded-lg"
              style={{
                backgroundImage: "url('/Images/fotor-ai-consultations.png')",
                backgroundPosition: "center 30%", // Centers the image
                backgroundRepeat: "no-repeat", // Prevents repeating
                backgroundSize: "cover", // Ensures the image fits within the container
              }}
            >
              {/* Content inside the div */}
              <div className="flex lg:flex-col items-center justify-center h-full bg-[#1a8cca] bg-opacity-50 rounded-lg lg:p-10 py-20 px-8 lg:gap-4">
                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-center ">
                  {language === "ar"
                    ? "مرحباً بك في استشارات المجانية لروشيتا"
                    : "Welcome to Rosheta's Free Consultations"}
                </h1>
              </div>
            </div>

            <div
              style={{ direction: language === "ar" ? "rtl" : "ltr" }}
              className="pt-10"
            >
              {step === 1 ? (
                <div className="flex gap-4 flex-col">
                  <div
                    className="bg-gray-50 w-full p-4 rounded-md flex h-20 items-center justify-between cursor-pointer"
                    onClick={() => {
                      setType("with");
                      setStep(2);
                    }}
                  >
                    <div className="flex gap-4">
                      <img
                        src="/Images/consultation-2.png"
                        className="w-10 h-10"
                      />
                      <div>
                        {language === "en" ? (
                          <>
                            <p>Medical Consultation</p>
                            <p className="text-gray-500">
                              Free consultation without any conditions
                            </p>
                          </>
                        ) : (
                          <>
                            <p>إستشارة طبية</p>
                            <p className="text-gray-500">
                              استشارة مجانية لاتتطلب شروط{" "}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <div
                        className={`rounded-full ${
                          type === "with" ? "bg-[#1a8cca]" : "bg-white"
                        } h-2 w-2`}
                      ></div>
                    </div>
                  </div>
                  <div
                    className="bg-gray-50 w-full p-4 rounded-md flex h-20 items-center justify-between cursor-pointer"
                    onClick={() => {
                      setType("without");
                      setStep(2);
                    }}
                  >
                    <div className="flex gap-4">
                      <img
                        src="/Images/consultation-1.png"
                        className="w-10 h-10"
                      />
                      <div>
                        {language === "en" ? (
                          <>
                            <p>Second Opinion Consultation</p>
                            <p className="text-gray-500">
                              A consultation tailored for individuals with prior
                              diagnoses
                            </p>
                          </>
                        ) : (
                          <>
                            <p>إستشارة (خود راي تاني)</p>
                            <p className="text-gray-500">
                              استشارة مخصصة للأفراد الذين لديهم تشخيص سابق
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <div
                        className={`rounded-full ${
                          type === "without" ? "bg-[#1a8cca]" : "bg-white"
                        } h-2 w-2`}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {type === "with" ? (
                    <div
                      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
                    >
                      <p className={`font-bold p-2 text-xl`}>
                        {language === "ar"
                          ? "شروط الخـــدمة"
                          : "Terms of Service"}
                      </p>
                      <ul className="list-disc px-5 py-2 marker:text-[#1584c6] text-lg">
                        {language === "ar" ? (
                          <>
                            <li className="text-gray-500">
                              أن يكون لديه تحاليل طبية مسبقا.
                            </li>
                            <li className="text-gray-500">
                              أن يكون لديه تقارير طبية مسبقا.
                            </li>
                            <li className="text-gray-500">
                              أن يكون لديه تشخيص طبي مسبقا.
                            </li>
                          </>
                        ) : (
                          <>
                            <li className="text-gray-500">
                              Must have previous medical tests.
                            </li>
                            <li className="text-gray-500">
                              Must have previous medical reports.
                            </li>
                            <li className="text-gray-500">
                              Must have a previous medical diagnosis.
                            </li>
                          </>
                        )}
                      </ul>
                      <p className={`font-bold p-2 text-xl`}>
                        {language === "ar"
                          ? "عبئ في خانة الاستشارات ماتريد ونزل ملفات الخاصة بك......"
                          : "Fill in the consultation box what you want and upload your files....."}
                      </p>

                      <div className="p-4">
                        <textarea
                          value={responseMessage}
                          onChange={handleResponseChange}
                          placeholder={
                            language === "ar"
                              ? "اكتب ردك..."
                              : "Write your response..."
                          }
                          className="w-full p-2 border border-gray-300 rounded-md h-80"
                          style={{
                            direction: language === "ar" ? "rtl" : "ltr",
                          }}
                        />

                        <FileUploader
                          onFilesChange={handleFilesChange}
                          language={language}
                        />
                        <div className="flex justify-center w-full gap-2">
                          <button
                            onClick={handleSendResponse}
                            className="mt-2 bg-[#1588C8] text-white py-2 px-4 rounded-md w-1/4 "
                          >
                            {language === "ar" ? "إرسال" : "Send"}
                          </button>
                          <button
                            className="mt-2 bg-white text-[#1588C8] border border-[#1588C8] py-2 px-4 rounded-md w-1/4 "
                            onClick={() => setStep(1)}
                          >
                           {language === "ar" ? "سابق" : "Previous"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
                    >
                    <div
                      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
                    >

<p className={`font-bold p-2 text-xl`}>
                        {language === "ar"
                          ? "عبئ في خانة الاستشارات ماتريد ونزل ملفات الخاصة بك......"
                          : "Fill in the consultation box what you want and upload your files....."}
                      </p>

                      <div className="p-4">
                        <textarea
                          value={responseMessage}
                          onChange={handleResponseChange}
                          placeholder={
                            language === "ar"
                              ? "اكتب ردك..."
                              : "Write your response..."
                          }
                          className="w-full p-2 border border-gray-300 rounded-md h-80"
                          style={{
                            direction: language === "ar" ? "rtl" : "ltr",
                          }}
                        />

                        <FileUploader
                          onFilesChange={handleFilesChange}
                          language={language}
                        />
                        <div className="flex justify-center w-full gap-2">
                          <button
                            onClick={handleSendResponse}
                            className="mt-2 bg-[#1588C8] text-white py-2 px-4 rounded-md w-1/4 "
                          >
                            {language === "ar" ? "إرسال" : "Send"}
                          </button>
                          <button
                            className="mt-2 bg-white text-[#1588C8] border border-[#1588C8] py-2 px-4 rounded-md w-1/4 "
                            onClick={() => setStep(1)}
                          >
                           {language === "ar" ? "سابق" : "Previous"}
                          </button>
                        </div>
                      </div>
                    </div>
                    </div>
                  )}
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
