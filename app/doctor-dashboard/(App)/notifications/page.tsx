"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumb from "@/components/layout/app-breadcrumb";
import NotificationCard from "@/components/shared/NotificationCard";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Notification } from "@/types/notification";
import { Bell } from "lucide-react";

type Language = "ar" | "en";

export default function Page() {
  const [language, setLanguage] = useState<Language>("ar");
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>(""); // Initialize as empty string

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage as Language);
    }
  
    // Get the full user data from localStorage
    const userDataString = localStorage.getItem('user');
    
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        console.log('User data:', userData);
        
        // Store the user ID
        if (userData.user_id) {
          setUserId(userData.user_id.toString());
        }
        
        // Store the medical organization ID if it exists
        if (userData.medical_organization?.id) {
          const medOrgId = userData.medical_organization.id;
          console.log('Medical Organization ID:', medOrgId);
          // You can store it in state or localStorage if needed
          localStorage.setItem('medicalOrganizationId', medOrgId.toString());
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    setLoading(false);
  }, []);

  const {
    notifications,
    isConnected,
    error,
    removeNotification,
    markAsRead,
  } = useNotificationSocket({
    userId,
    userType: "doctor",
  });

  console.log("notifications from not page", notifications);

  // Helper function to extract consultation ID from message
  const extractConsultationId = (message: string): number | null => {
    const match = message.match(/\(ID: (\d+)\)/);
    return match ? parseInt(match[1], 10) : null;
  };

  // Breadcrumb items
  const items = [
    { label: language === "ar" ? "الرئسية" : "Dashboard", href: "#" },
    {
      label: language === "ar" ? "الإشعارات" : "Notifications",
      href: "/dashboard/notifications",
    },
  ];

  return (
    <SidebarProvider>
      <SidebarInset>
        <header
          className={`flex ${
            language === "ar" ? "justify-end" : "justify-between"
          } h-16 shrink-0 items-center border-b px-4 gap-2`}
        >
          <div
            className={`flex ${
              language === "ar" ? "flex-row" : "flex-row-reverse"
            } gap-2 items-center`}
          >
            <Breadcrumb items={items} translate={(key) => key} />
            <SidebarTrigger className="rotate-180" />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="p-8 space-y-8">
            {error && (
              <div
                className={`text-red-500 bg-red-100 p-4 rounded ${
                  language === "ar" ? "text-end" : "text-start"
                }`}
              >
                {error}
              </div>
            )}
            <div
              className={`flex flex-col border rounded-lg bg-white shadow-sm max-w-[1280px] mx-auto ${
                language === "ar" ? "rtl" : "ltr"
              }`}
            >

              <div className="space-y-4 p-4">
                {/* WebSocket Connection Status */}


                {notifications.length === 0 ? (
                  <div className="rounded-lg bg-white p-6 text-center">
                    <p className="text-gray-500">
                      {language === "ar"
                        ? "لا توجد إشعارات جديدة"
                        : "No new notifications"}
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const consultationId = extractConsultationId(notification.message);
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
                                {notification.message === "New consultation assigned to you!" && notification.data?.patient_name && notification.data?.medical_organization
                                ? language === "ar"
                                ? `تم تعيين استشارة جديدة لك من المريض ${notification.data.patient_name} في ${notification.data.medical_organization}`
                                : `New consultation from patient ${notification.data.patient_name} has been assigned to you at ${notification.data.medical_organization}`
                                : notification.message}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(notification.timestamp || Date.now()).toLocaleString(
                                  language === 'ar' ? 'en-US' : 'en-US'
                                )}
                              </p>
                            </div>
                          </div>
                          {/*{consultationId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Navigate to consultation details
                                // router.push(`/consultations/${consultationId}`);
                              }}
                              className="text-sm text-roshitaDarkBlue hover:text-roshitaDarkBlue/80 font-medium"
                            >
                              {language === "ar" ? "عرض التفاصيل" : "View Details"}
                            </button>
                          )}*/}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}