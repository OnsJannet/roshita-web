"use client";
import { AppSidebar } from "@/components/app-sidebar";
import StatCard from "@/components/dashboard/StatCard";

import Breadcrumb from "@/components/layout/app-breadcrumb"; // Assuming your Breadcrumb component is here
import EditButton from "@/components/layout/editButton";
import AnalysisPackage from "@/components/shared/AnalysisPackage";
import { AreaChartDash } from "@/components/shared/AreaChartDash";
import InformationCard from "@/components/shared/InformationCardProps";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import CustomInput from "@/components/unique/CustomeInput";
import CustomeInput from "@/components/unique/CustomeInput";
import DoctorCard from "@/components/unique/DoctorCardDash";
import LabCard from "@/components/unique/LabCardDash";
import UploadButton from "@/components/unique/UploadButton";
import { DoctorData } from "@/constant";
import { CircleDollarSign, CirclePlus, Plus } from "lucide-react";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const { id } = params;

  console.log("doctorId", id);

  // Breadcrumb items with Arabic text
  const items = [
    { label: "الرئسية", href: "#" },
    { label: "الأطباء", href: "/dashboard/doctors" },
    { label: `${id}`, href: "/dashboard/doctors/1" },
  ];

  const doctor = DoctorData.find((doctor) => doctor.id === id);

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
        <header className="flex justify-between h-16 shrink-0 items-center border-b px-4 gap-2">
          <Breadcrumb items={items} translate={(key) => key} />{" "}
          {/* Pass a no-op translate function */}
          <SidebarTrigger className="rotate-180 " />
        </header>
        {/* Main Content Section */}
        <div className=" p-4 flex  flex-col justify-center">
        <div className="max-w-[1280px] w-full flex justify-start  mx-auto">
            <div className=" mb-4 max-w-[1280px] ">
            <EditButton href={`/dashboard/doctors/edit/${doctor?.id}`} />

            </div>
          </div>
          <div className="p-8 space-y-8">
            <DoctorCard
              name={doctor?.دكاترة ?? "غير محدد"}
              specialty={doctor?.التخصص ?? "غير محدد"}
              hospital={doctor?.المستشفى ?? "غير محدد"}
              location={doctor?.الموقع ?? "غير محدد"}
              phone={doctor?.الهاتف ?? "غير محدد"}
              imageSrc={doctor?.img ?? "/Images/default-doctor.jpg"}
            />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>

      {/* Sidebar Section */}
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
