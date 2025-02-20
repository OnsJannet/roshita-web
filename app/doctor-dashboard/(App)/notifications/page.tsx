"use client";
import { AppSidebar } from "@/components/app-sidebar";
import StatCard from "@/components/dashboard/StatCard";
import Breadcrumb from "@/components/layout/app-breadcrumb";
import LoadingDoctors from "@/components/layout/LoadingDoctors";
import PaginationDemo from "@/components/shared/PaginationDemo";
import RequestCard from "@/components/shared/RequestCard";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns'; // Import format function from date-fns
import { Folder } from "lucide-react";
import NotificationCard from "@/components/shared/NotificationCard";

// Define the types for the data you're expecting from the API
interface DoctorStaff {
  first_name: string;
  last_name: string;
  staff_avatar: string;
  medical_organization: string;
  city: string;
  address: string;
}

interface Doctor {
  id: number;
  staff: DoctorStaff;
  specialty?: number;
  fixed_price?: string;
  rating?: number;
  is_consultant: boolean;
  create_date: Date;
}

interface APIResponse {
  success: boolean;
  data: Doctor[]; // The correct property is `data`, not `results`
  total: number;
  nextPage: string | null;
  previousPage: string | null;
}

// Define the Payment type
export type Payment = {
  img: string;
  id: string;
  دكاترة: string;
  "تاريخ الانضمام": Date;
  التقييم: number;
};

type Language = "ar" | "en";

export default function Page() {

  const [language, setLanguage] = useState<Language>("ar");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

 // WebSocket connection
 useEffect(() => {
    const socket = new WebSocket("ws://localhost:8001/ws/notifications/selected-suggest-hospital/1/");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "send_notification") {
        const notification = {
          id: data.data.id,
          patient: data.data.patient,
          doctor: data.data.doctor,
          service_type: data.data.service_type,
          note: data.data.note,
        };
        /* @ts-ignore */
        setNotifications((prev) => [notification, ...prev]);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  // Handle Accept
  const handleAccept = async (id: number) => {
    try {
      const response = await fetch(
        `https://www.test-roshita.net/api/hospital-accept-doctor-suggest/${id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Accepted" }),
        }
      );

      if (!response.ok) throw new Error("Failed to accept suggestion");

      // Remove the notification from the list
      /* @ts-ignore */
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error accepting suggestion:", error);
    }
  };

  // Handle Deny
  const handleDeny = async (id: number) => {
    try {
      const response = await fetch(
        `https://www.test-roshita.net/api/hospital-accept-doctor-suggest/${id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Rejected" }),
        }
      );

      if (!response.ok) throw new Error("Failed to reject suggestion");

      // Remove the notification from the list
      /* @ts-ignore */
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error rejecting suggestion:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
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
    }
  }, []);



  // Breadcrumb items
  const items = [
    { label: language === "ar" ? "الرئسية" : "Dashboard", href: "#" },
    {
      label: language === "ar" ? "الإشعارات" : "Notifications",
      href: "/dashboard/notifications",
    },
  ];

  return loading ? (
    <div className="flex items-center justify-center min-h-screen mx-auto">
      <LoadingDoctors />
    </div>
  ) : (
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
            <SidebarTrigger className="rotate-180 " />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        {language === "ar" ? "الإشعارات" : "Notifications"}
      </h2>
      {notifications.length === 0 ? (
        <p>{language === "ar" ? "لا توجد إشعارات جديدة" : "No new notifications"}</p>
      ) : (
        notifications.map((notification) => (
          <NotificationCard
          /* @ts-ignore */
            key={notification.id}
            /* @ts-ignore */
            notification={notification}
            language={language}
            onAccept={handleAccept}
            onDeny={handleDeny}
          />
        ))
      )}
    </div>
        </div>
      </SidebarInset>

      <AppSidebar side="right" />
    </SidebarProvider>
  );
}