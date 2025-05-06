"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Bell, LogOut, MonitorCheck, Settings, UserRound } from "lucide-react";
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
  };
}

const Page = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<"previous" | "next">("next");
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("ar");
  const [errorMessage, setErrorMessage] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
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

  /*const fetchNotifications = useCallback(async (): Promise<Notification[]> => {
    try {
      const token = localStorage.getItem("access");
      const patientId = localStorage.getItem("patientId");
      if (!token || !patientId) {
        throw new Error("No access token or patient ID found. Please log in.");
      }

      const response = await fetch(
        `https://test-roshita.net/api/patient-notifications/${patientId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.map((notification: any) => ({
        ...notification,
        created_at: new Date(notification.created_at).toLocaleString(),
      })).sort((a: Notification, b: Notification) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }, []);*/

  const setupWebSocket = useCallback((patientId: string) => {
    if (!patientId) return () => {};

    const RECONNECT_DELAY = 3000; // 3 seconds
    const MAX_RETRIES = 5;
    let retryCount = 0;
    let sockets: WebSocket[] = [];

    const createSocket = (url: string): WebSocket => {
      const socket = new WebSocket(url);

      socket.onopen = () => {
        console.log(`WebSocket connected: ${url}`);
        retryCount = 0; // Reset retry count on successful connection
      };

      socket.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'send_notification') {
            setNotifications(prev => {
              const newNotification: Notification = {
                id: Date.now(),
                type: determineNotificationType(data.data),
                message: data.data.message || getDefaultMessage(data.data),
                status: 'unread',
                created_at: new Date().toISOString(),
                data: {
                  consultation_id: data.data.consultation_request_id,
                  doctor_id: data.data.doctor_id,
                  hospital_id: data.data.organization?.id,
                  patient: data.data.patient,
                  doctor: data.data.doctor,
                  appointment_date: data.data.appointment_date,
                  organization: data.data.organization,
                  consultation_request_id: data.data.consultation_request_id
                }
              };
              return [newNotification, ...prev];
            });
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socket.onclose = (event) => {
        console.log(`WebSocket closed: ${url}`, event.code, event.reason);
        
        // Attempt to reconnect if the connection was not closed intentionally
        if (event.code !== 1000 && retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(`Attempting to reconnect (${retryCount}/${MAX_RETRIES})...`);
          setTimeout(() => {
            const newSocket = createSocket(url);
            sockets = sockets.map(s => s === socket ? newSocket : s);
          }, RECONNECT_DELAY * retryCount);
        }
      };

      return socket;
    };

    // Create WebSocket connections
    sockets = [
      `wss://test-roshita.net:8080/ws/notifications/patient-doctor-suggest/${patientId}/`,
      //`wss://test-roshita.net:8080/ws/notifications/doctor-consultation-response-accepted/${patientId}/`,
      `wss://test-roshita.net:8080/ws/notifications/patient-doctor-response/${patientId}/`
    ].map(url => createSocket(url));

    // Cleanup function
    return () => {
      sockets.forEach(socket => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.close(1000, 'Component unmounting');
        }
      });
    };
  }, [determineNotificationType, getDefaultMessage]);

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

  useEffect(() => {
    setLoading(false); // Set loading to false immediately since we're using WebSocket
    const patientId = localStorage.getItem("patientId");
    if (patientId) {
      return setupWebSocket(patientId);
    }
  }, [setupWebSocket]);

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

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, status: 'read' } : notif
      )
    );
    // Here you would also call your API to mark the notification as read
  };

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
              notifications.map((notification) => (
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
                          {notification.message}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {notification.created_at}
                        </p>
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;