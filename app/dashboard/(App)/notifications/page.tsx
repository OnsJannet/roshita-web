"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumb from "@/components/layout/app-breadcrumb";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import LoadingDoctors from "@/components/layout/LoadingDoctors";

type Language = "ar" | "en";

export default function Page() {
  const [language, setLanguage] = useState<Language>("ar");
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    const storedUserId = localStorage.getItem('medicalOrganizationId');
    
    if (storedLanguage) {
      setLanguage(storedLanguage as Language);
    }
    if (storedUserId) {
      setUserId(storedUserId);
    }
    
    setLoading(false);
  }, []);

  const {
    notifications,
    error,
    markAsRead,
    isLoading: socketLoading
  } = useNotificationSocket({
    userId,
    userType: "hospital",
  });

  const items = [
    { label: language === "ar" ? "الرئسية" : "Dashboard", href: "#" },
    {
      label: language === "ar" ? "الإشعارات" : "Notifications",
      href: "/dashboard/notifications",
    },
  ];

  if (loading || socketLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen mx-auto">
        <LoadingDoctors />
      </div>
    );
  }

  const formatNotificationDateTime = (notification: any, lang: Language) => {
    // Try to get date from notification_date first, then fall back to timestamp
    const notificationDate = notification.notification_date 
      ? new Date(notification.notification_date)
      : new Date(notification.timestamp || Date.now());
    
    // Format date
    const dateFormatter = new Intl.DateTimeFormat(lang === 'ar' ? 'en-US' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    // Format time (12-hour format with AM/PM)
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
              className={`flex flex-col border rounded-lg bg-white max-w-[1280px] mx-auto ${
                language === "ar" ? "rtl" : "ltr"
              }`}
            >
              <div className="space-y-4 p-4">
                {notifications.length === 0 ? (
                  <div className="rounded-lg bg-white p-6 text-center">
                    <p className="text-gray-500">
                      {language === "ar"
                        ? "لا توجد إشعارات جديدة"
                        : "No new notifications"}
                    </p>
                  </div>
                ) : (
                  notifications.map((notification, index) => {
                    const translatedMessage = notification.translations?.[language]?.message || notification.message;
                    const translatedData = notification.translations?.[language] || {};
                    const { formattedDate, formattedTime, day } = formatNotificationDateTime(notification, language);

                    return (
                      <div
                        key={index}
                        className={`bg-white p-6 rounded-lg border-l-4  border-roshitaDarkBlue`}
                        dir={language === "ar" ? "rtl" : "ltr"}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-start gap-3 w-full">
                            <div className={`rounded-full p-2 mt-1 border-roshitaDarkBlue `}>
                              <Bell className={`h-5 w-5 text-roshitaDarkBlue`} />
                            </div>
                            <div className="w-full">
                              <h3 className={`font-semibold text-black`}>
                                {translatedMessage}
                              </h3>
                              
                              <div className="mt-2 space-y-1 text-sm">
                                                                 {/*@ts-ignore */}
                              {translatedData.consultation_response_id && (
                                <p className="text-gray-600">
                                  <span className="font-medium">{language === 'ar' ? 'رقم الاستشارة: ' : 'Consultation No: '}</span>
                                  {/*@ts-ignore */}
                                  {translatedData.consultation_response_id}
                                </p>
                              )}
                                {/*@ts-ignore */}
                                {translatedData.patient && (
                                  <p className="text-gray-600">
                                    <span className="font-medium">{language === 'ar' ? 'المريض: ' : 'Patient: '}</span>
                                   {/*@ts-ignore */}
                                    {translatedData.patient}
                                  </p>
                                )}
                                {/*@ts-ignore */}
                                {translatedData.doctor && (
                                  <p className="text-gray-600">
                                    <span className="font-medium">{language === 'ar' ? 'الطبيب: ' : 'Doctor: '}</span>
                                    {/*@ts-ignore */}
                                    {translatedData.doctor}
                                  </p>
                                )}
                                {/*@ts-ignore */}
                                {translatedData.service_type && (
                                  <p className="text-gray-600">
                                    <span className="font-medium">{language === 'ar' ? 'نوع الخدمة: ' : 'Service Type: '}</span>
                                    {/*@ts-ignore */}
                                    {translatedData.service_type}
                                  </p>
                                )}
                                {/*@ts-ignore */}
                                {translatedData.medical_organizations && (
                                  <p className="text-gray-600">
                                    <span className="font-medium">{language === 'ar' ? 'المنظمة الطبية: ' : 'Medical Organization: '}</span>
                                    {/*@ts-ignore */}
                                    {translatedData.medical_organizations}
                                  </p>
                                )}
                                {/*@ts-ignore */}
                                {translatedData.estimated_cost && (
                                  <p className="text-gray-600">
                                    <span className="font-medium">{language === 'ar' ? 'التكلفة المقدرة: ' : 'Estimated Cost: '}</span>
                                    {/*@ts-ignore */}
                                    {translatedData.estimated_cost[0]} 
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