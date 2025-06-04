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
  const [language, setLanguage] = useState<Language>("ar");
  const [loading, setLoading] = useState<boolean>(true);
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
    const storedUserId = localStorage.getItem('userId');
    if (storedLanguage) {
      setLanguage(storedLanguage as Language);
    }
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
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const formatNotificationDateTime = (notification: any, lang: Language) => {
    const notificationDate = notification.notification_date 
      ? new Date(notification.notification_date)
      : new Date(notification.timestamp || Date.now());
    
    const dateFormatter = new Intl.DateTimeFormat(lang === 'ar' ? 'en-US' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    const timeFormatter = new Intl.DateTimeFormat(lang === 'ar' ? 'en-US' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return {
      formattedDate: dateFormatter.format(notificationDate),
      formattedTime: timeFormatter.format(notificationDate),
      day: notification.notification_day || dateFormatter.formatToParts(notificationDate)
        .find(part => part.type === 'weekday')?.value || ''
    };
  };

  const router = useRouter();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen mx-auto">
        <LoadingDoctors />
      </div>
    );
  }

  return (
    <div className="flex justify-center flex-col p-8 bg-[#fafafa]">
      <div>
        <div
          className={`flex ${language === "ar" ? "lg:flex-row-reverse" : "lg:flex-row"} flex-col justify-start gap-10 mx-auto`}
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
                const translatedMessage = notification.translations?.[language]?.message || notification.message;
                const translatedData = notification.translations?.[language] || {};
                const { formattedDate, formattedTime, day } = formatNotificationDateTime(notification, language);

                return (
                  <div
                    key={notification.id}
                    className={`bg-white p-6 rounded-lg border-l-4 ${notification.status === 'unread' ? 'border-roshitaDarkBlue' : 'border-gray-200'}`}
                    dir={language === "ar" ? "rtl" : "ltr"}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-3 w-full">
                        <div className={`rounded-full p-2 mt-1 border-roshitaDarkBlue`}>
                          <Bell className={`h-5 w-5 text-roshitaDarkBlue`} />
                        </div>
                        <div className="w-full">
                          <h3 className={`font-semibold ${language === "ar" ?  "text-right" : "text-left"} text-black`}>
                            {translatedMessage === "Consultation request accepted!" 
                              ? (notification.data?.status !== "Reviewed"
                                ? language === "ar"
                                  ? "تم اختيار استشارتك من قبل مستشفى وتم إرسالها إلى طبيب للمراجعة"
                                  : "Your consultation got picked up by a hospital. It's sent to a doctor to review."
                                : language === "ar"
                                /*@ts-ignore*/
                                  ? `تم قبول طلب الاستشارة! الدكتور ${translatedData.doctor} من ${translatedData.medical_organizations}`
                                  /*@ts-ignore*/
                                  : `Consultation request accepted! Dr. ${translatedData.doctor} from ${translatedData.medical_organizations}`)
                              : translatedMessage === "New suggestion created!" && notification.data?.organization
                                ? language === "ar"
                                /*@ts-ignore*/
                                  ? `اقترح طبيبك طبيباً جديداً لك من ${translatedData.medical_organizations}`
                                  /*@ts-ignore*/
                                  : `Your doctor suggested a new doctor for you from ${translatedData.medical_organizations}`
                                : translatedMessage}
                          </h3>
                          
                          <div className={`mt-2 space-y-1 text-sm ${language === "ar" ?  "text-right" : "text-left"}` }>
                            {/*@ts-ignore*/}
                            {translatedData.consultation_response_id && (
                              <p className="text-gray-600">
                                <span className="font-medium">{language === 'ar' ? 'رقم الاستشارة: ' : 'Consultation No: '}</span>
                                {/*@ts-ignore*/}
                                {translatedData.consultation_response_id}
                              </p>
                            )}
                            {/*@ts-ignore*/}
                            {translatedData.patient && (
                              <p className="text-gray-600">
                                <span className="font-medium">{language === 'ar' ? 'المريض: ' : 'Patient: '}</span>
                                {/*@ts-ignore*/}
                                {translatedData.patient}
                              </p>
                            )}
                            {/*@ts-ignore*/}
                            {translatedData.doctor && (
                              <p className="text-gray-600">
                                <span className="font-medium">{language === 'ar' ? 'الطبيب: ' : 'Doctor: '}</span>
                                {/*@ts-ignore*/}
                                {translatedData.doctor}
                              </p>
                            )}
                            {/*@ts-ignore*/}
                            {translatedData.service_type && (
                              <p className="text-gray-600">
                                <span className="font-medium">{language === 'ar' ? 'نوع الخدمة: ' : 'Service Type: '}</span>
                                {/*@ts-ignore*/}
                                {translatedData.service_type}
                              </p>
                            )}
                            {/*@ts-ignore*/}
                            {translatedData.medical_organizations && (
                              <p className="text-gray-600">
                                <span className="font-medium">{language === 'ar' ? 'المنظمة الطبية: ' : 'Medical Organization: '}</span>
                                {/*@ts-ignore*/}
                                {translatedData.medical_organizations}
                              </p>
                            )}
                            {/*@ts-ignore*/}
                            {translatedData.estimated_cost && (
                              <p className="text-gray-600">
                                <span className="font-medium">{language === 'ar' ? 'التكلفة المقدرة: ' : 'Estimated Cost: '}</span>
                                {/*@ts-ignore*/}
                                {translatedData.estimated_cost[0]} SAR
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <span>{formattedDate}</span>
                            <span>•</span>
                            <span>{formattedTime}</span>
                          </div>
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