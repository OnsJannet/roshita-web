"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumb from "@/components/layout/app-breadcrumb";
import InformationCard from "@/components/shared/InformationCardProps";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DoctorData } from "@/constant";
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams();
    const { id } = params;
  // Breadcrumb items with Arabic text
  const items = [
    { label: "الرئسية", href: "/dashboard" },
    { label: "الأطباء", href: "/dashboard/doctors" },
    { label: "تعديل", href: "#" },
  ];

  const doctor = DoctorData.find((doctor) => doctor.id === id);

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
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="p-8 space-y-8">
            <InformationCard
              title="بيانات الشخصية"
              name={doctor?.دكاترة ?? "غير محدد"}
              fields={[
                { label: "رقم الهاتف", value: `${doctor?.الهاتف ?? "غير محدد"}` },
                { label: "مكان", value: `${doctor?.الموقع ?? "غير محدد"}` },
                { label: "سعر الحجز", value: `${doctor?.السعر ?? "غير محدد"}` },
              ]}
              picture={doctor?.img ?? "/Images/default-doctor.jpg"}
              photoUploadHandler={(file) =>
                console.log("Personal photo uploaded:", file)
              }
            />
              <Button
                variant="register"
                className=" rounded-2xl h-[52px] w-[140px]"
              >
                حفظ
              </Button>
          </div>
        </div>
      </SidebarInset>

      {/* Sidebar Section */}
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
