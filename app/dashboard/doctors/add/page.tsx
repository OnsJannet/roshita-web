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


export default function Page() {

  // Breadcrumb items with Arabic text
  const items = [
    { label: "الرئسية", href: "/dashboard" },
    { label: "الأطباء", href: "/dashboard/doctors" },
    { label: "إضافة", href: "#" },
  ];



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
              name=""
              type="add"
              fields={[
                { label: "رقم الهاتف", value: `` },
                { label: "مكان", value: `` },
                { label: "سعر الحجز", value: `` },
              ]}
              picture=""
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
