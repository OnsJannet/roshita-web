"use client";
import { AppSidebar } from "@/components/app-sidebar";
import StatCard from "@/components/dashboard/StatCard";

import Breadcrumb from "@/components/layout/app-breadcrumb"; // Assuming your Breadcrumb component is here
import EditButton from "@/components/layout/editButton";
import AnalysisPackage from "@/components/shared/AnalysisPackage";
import { AreaChartDash } from "@/components/shared/AreaChartDash";
import InformationCard from "@/components/shared/InformationCardProps";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/dataTable";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AddDoctorCard from "@/components/unique/AddDoctorCard";
import { BarChartDash } from "@/components/unique/BarChartDash";
import CustomInput from "@/components/unique/CustomeInput";
import CustomeInput from "@/components/unique/CustomeInput";
import DoctorCard from "@/components/unique/DoctorCardDash";
import LabCard from "@/components/unique/LabCardDash";
import { PieChartDash } from "@/components/unique/PieChartDash";
import UploadButton from "@/components/unique/UploadButton";
import { CircleDollarSign, CirclePlus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

type Language = "ar" | "en";

export default function Page() {
  const [language, setLanguage] = useState<Language>("ar");

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

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  // Breadcrumb items with Arabic text
  const items = [
    { label: language === "ar" ? "الرئسية" : "Dashboard", href: "#" },
  ];

  const handleUpload = (file: File) => {
    console.log("Uploaded file:", file);
    // Handle the uploaded file (e.g., send it to a server or preview it)
  };

  const handleEdit = () => {
    console.log("Edit clicked");
  };

  const handleDelete = () => {
    console.log("Delete clicked");
  };

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
          <div className="mb-4">
            <AreaChartDash />
          </div>
          <div className="flex lg:flex-row flex-col justify-between gap-2 w-full">
            <div className="lg:w-[40%] w-full">
              <BarChartDash />
            </div>
            <div className="lg:w-[40%] w-full">
              <PieChartDash />
            </div>
            <div className="lg:w-[40%] w-full">
              <AddDoctorCard />
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Sidebar Section */}
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}