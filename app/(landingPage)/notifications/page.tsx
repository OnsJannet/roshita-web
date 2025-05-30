"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Bell, LogOut, MonitorCheck, Settings, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchProfileDetails } from "@/lib/api";
import LoadingDoctors from "@/components/layout/LoadingDoctors";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";

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
    noNotifications: "No notifications",
    viewDetails: "View Details",
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
    noNotifications: "لا توجد إشعارات",
    viewDetails: "عرض التفاصيل",
  },
};

interface EditProfileData {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    id: string;
  };
  gender: string;
  service_country: number;
  birthday: string;
  city: number;
  user_type: number;
  address: string;
}

interface Notification {
  id: number;
  type: 'consultation_request' | 'doctor_suggestion' | 'hospital_response' | 'consultation_response';
  message: string;
  status: 'read' | 'unread';
  created_at: string;
  data?: {
    consultation_id?: number;
    doctor_id?: number;
    hospital_id?: number;
    patient?: string;
    doctor?: string;
    appointment_date?: string;
    organization?: {
      id: number;
      name: string;
    };
    consultation_request_id?: number;
    translations?: {
      en?: {
        message: string;
        doctor?: string;
        medical_organizations?: string;
      };
      ar?: {
        message: string;
        doctor?: string;
        medical_organizations?: string;
      };
    };
  };
}

const Page = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<"previous" | "next">("next");
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("ar");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showLoading, setShowLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>(""); 
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

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage as Language);
    }

    const storedUserId = localStorage.getItem('userId');
    console.log('Stored userId:', storedUserId);
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const {
    notifications,
    isConnected,
    error,
    removeNotification,
    markAsRead,
  } = useNotificationSocket({
    userId,
    userType: "patient",
  });

  useEffect(() => {
    if (notifications !== undefined) {
      const timer = setTimeout(() => {
        setLoading(false);
        setShowLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  console.log("notifications from not page", notifications);

  const determineNotificationType = useCallback((data: any): Notification['type'] => {
    if (data.consultation_request_id && data.status === 'Accepted') {
      return 'consultation_request';
    }
    if (data.doctor && data.message?.includes('suggestion')) {
      return 'doctor_suggestion';
    }
    if (data.status === 'Reviewed') {
      return 'consultation_response';
    }
    if (data.organization) {
      return 'hospital_response';
    }
    return 'consultation_request';
  }, []);

  const getDefaultMessage = useCallback((data: any): string => {
    if (data.doctor && data.organization) {
      return `New update from Dr. ${data.doctor.split(' ')[1]} at ${data.organization.name}`;
    }
    if (data.doctor) {
      return `New message from Dr. ${data.doctor.split(' ')[1]}`;
    }
    if (data.organization) {
      return `New update from ${data.organization.name}`;
    }
    return 'You have a new notification';
  }, []);

  // Helper functions to get translated content
  const getTranslatedMessage = (notification: Notification): string => {
    if (notification.data?.translations && (language === "en" || language === "ar")) {
      return notification.data.translations[language]?.message || notification.message;
    }
    return notification.message;
  };

  const getTranslatedDoctor = (notification: Notification): string | undefined => {
    if (notification.data?.translations && (language === "en" || language === "ar")) {
      return notification.data.translations[language]?.doctor || notification.data?.doctor;
    }
    return notification.data?.doctor;
  };

  const getTranslatedMedicalOrg = (notification: Notification): string | undefined => {
    if (notification.data?.translations && (language === "en" || language === "ar")) {
      return notification.data.translations[language]?.medical_organizations || 
             notification.data?.organization?.name;
    }
    return notification.data?.organization?.name;
  };

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
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const storedAppointments = localStorage.getItem("appointments");
    if (storedAppointments) {
      const parsedAppointments = JSON.parse(storedAppointments);
      setAppointments(parsedAppointments);
      filterAppointments(parsedAppointments, "next");
    }
  }, []);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await fetchProfileDetails();
        setProfileData({
          user: {
            first_name: data.user?.first_name || "",
            last_name: data.user?.last_name || "",
            email: data.user?.email || "",
            id: data.user?.id || "",
          },
          gender: data.gender || "",
          service_country: data.service_country || 2,
          birthday: data.birthday || "",
          city: data.city || 1,
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
    const filtered = type === "next"
      ? appointments.filter(appt => new Date(appt.reservation.reservation_date) > today)
      : appointments.filter(appt => new Date(appt.reservation.reservation_date) <= today);
    setFilteredAppointments(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  };

  const handleSettingsClick = () => router.push("/profile");
  const handleAppointmentsClick = () => router.push("/appointments");
  const handleSettingsPasswordClick = () => router.push("/password-change");
  const handleConsultationsClick = () => router.push("/consultations");
  const handleError = (errorMessage: string) => setErrorMessage(errorMessage);

  if (showLoading) {
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
                onClick={() => {}}
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
          <div className="flex gap-4 text-end flex-col w-[80%] mx-auto">
            {notifications.length === 0 ? (
              <div className="bg-white p-6 rounded-lg text-center">
                <p className="text-gray-500">
                  {translations[language].noNotifications}
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                //@ts-ignore
                const translatedMessage = getTranslatedMessage(notification);
                                //@ts-ignore
                const translatedDoctor = getTranslatedDoctor(notification);
                                //@ts-ignore
                const translatedMedicalOrg = getTranslatedMedicalOrg(notification);

                return (
                  <div
                    key={notification.id}
                    className={`bg-white p-6 rounded-lg border-l-4 ${
                      notification.status === 'unread' 
                        ? 'border-roshitaDarkBlue' 
                        : 'border-gray-200'
                    }`}
                    dir={language === "ar" ? "rtl" : "ltr"}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-2 ${
                          notification.status === 'unread' 
                            ? 'bg-roshitaDarkBlue/10' 
                            : 'bg-gray-100'
                        }`}>
                          <Bell className={`h-5 w-5 ${
                            notification.status === 'unread' 
                              ? 'text-roshitaDarkBlue' 
                              : 'text-gray-500'
                          }`} />
                        </div>
                        <div>
                          <h3 className={`font-semibold ${
                            notification.status === 'unread' 
                              ? 'text-gray-900' 
                              : 'text-gray-600'
                          }`}>
                            {translatedMessage === "Consultation request accepted!" 
                              ? (notification.data?.status !== "Reviewed"
                                ? language === "ar"
                                  ? "تم اختيار استشارتك من قبل مستشفى وتم إرسالها إلى طبيب للمراجعة"
                                  : "Your consultation got picked up by a hospital. It's sent to a doctor to review."
                                : language === "ar"
                                  ? `تم قبول طلب الاستشارة! الدكتور ${translatedDoctor} من ${translatedMedicalOrg}`
                                  : `Consultation request accepted! Dr. ${translatedDoctor} from ${translatedMedicalOrg}`)
                              : translatedMessage === "New suggestion created!" && notification.data?.organization
                                ? language === "ar"
                                  ? `اقترح طبيبك طبيباً جديداً لك من ${translatedMedicalOrg}`
                                  : `Your doctor suggested a new doctor for you from ${translatedMedicalOrg}`
                                : translatedMessage}
                          </h3>
                        </div>
                      </div>
                      {notification.data?.consultation_id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/consultations/${notification.data?.consultation_id}`);
                          }}
                          className="text-sm text-roshitaDarkBlue hover:text-roshitaDarkBlue/80 font-medium"
                        >
                          {translations[language].viewDetails}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;