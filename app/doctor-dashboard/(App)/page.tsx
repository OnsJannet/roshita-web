"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { DoctorAreaChart } from "@/components/charts/DoctorAreaChart";
import { DoctorBarChat } from "@/components/charts/DoctorBarChat";
import { DoctorPieChart } from "@/components/charts/DoctorPieChart";
import Planner from "@/components/dashboard/Planner";
import PlannerDoctor from "@/components/dashboard/PlannerDoctor";
import Breadcrumb from "@/components/layout/app-breadcrumb"; // Assuming your Breadcrumb component is here
import { AreaChartDash } from "@/components/shared/AreaChartDash";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AddDoctorCard from "@/components/unique/AddDoctorCard";
import { BarChartDash } from "@/components/unique/BarChartDash";
import { PieChartDash } from "@/components/unique/PieChartDash";
import { useEffect, useState } from "react";

type Language = "ar" | "en";

export default function Page() {
  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        const storedLanguage = localStorage.getItem("language");
        if (storedLanguage) {
          setLanguage(storedLanguage as Language);
        } else {
          setLanguage("ar");
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
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

  // Breadcrumb items with Arabic text
  const items = [
    { label: language === "ar" ? "الرئسية" : "Dashboard", href: "#" },
  ];

  return (
    <SidebarProvider>
      <SidebarInset>
        {/* Header Section */}
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
            <Breadcrumb items={items} translate={(key) => key} />{" "}
            {/* Pass a no-op translate function */}
            <SidebarTrigger className="rotate-180 " />
          </div>
        </header>

        {/* Main Content Section */}
        <div className=" p-4 flex  flex-col justify-center">
          <div className="grid lg:grid-cols-3 gap-4 w-full mb-2">
            <div className="h-[400px]">
              <DoctorBarChat />
            </div>
            <div className="h-[400px]">
              <DoctorPieChart />
            </div>
            <div className="h-[400px]">
              <DoctorAreaChart />
            </div>
          </div>
          <div className=" p-4 flex  flex-col justify-center">
            <div className="mb-4">
              <PlannerDoctor language={language} />
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Sidebar Section */}
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
