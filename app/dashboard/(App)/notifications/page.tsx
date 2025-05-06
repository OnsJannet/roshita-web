"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumb from "@/components/layout/app-breadcrumb";
import NotificationCard from "@/components/shared/NotificationCard";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Notification } from "@/types/notification";

type Language = "ar" | "en";

export default function Page() {
  const [language, setLanguage] = useState<Language>("ar");
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>(""); // This should be set from your auth context

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

  // Handle Accept
  const handleAccept = async (id: number) => {
    try {
      const response = await fetch(
        `https://test-roshita.net/api/notifications/${id}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        removeNotification(id);
      } else {
        console.error("Failed to accept notification");
      }
    } catch (error) {
      console.error("Error accepting notification:", error);
    }
  };

  // Handle Deny
  const handleDeny = async (id: number) => {
    try {
      const response = await fetch(
        `https://test-roshita.net/api/notifications/${id}/deny`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        removeNotification(id);
      } else {
        console.error("Failed to deny notification");
      }
    } catch (error) {
      console.error("Error denying notification:", error);
    }
  };

  // Handle Mark as Read
  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await fetch(
        `https://test-roshita.net/api/notifications/${id}/read`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        markAsRead(id);
      } else {
        console.error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
              <Breadcrumb
                items={[
                  {
                    label: language === "ar" ? "لوحة التحكم" : "Dashboard",
                    href: "/dashboard",
                  },
                  {
                    label: language === "ar" ? "الإشعارات" : "Notifications",
                    href: "/dashboard/notifications",
                  },
                ]}
              />
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {language === "ar" ? "الإشعارات" : "Notifications"}
              </h1>
            </div>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="rounded-lg bg-white p-6 text-center shadow dark:bg-gray-800">
                  <p className="text-gray-500 dark:text-gray-400">
                    {language === "ar"
                      ? "لا توجد إشعارات جديدة"
                      : "No new notifications"}
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    language={language}
                    onAccept={handleAccept}
                    onDeny={handleDeny}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}