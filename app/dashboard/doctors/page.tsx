import { AppSidebar } from "@/components/app-sidebar";
import StatCard from "@/components/dashboard/StatCard";

import Breadcrumb from "@/components/layout/app-breadcrumb"; // Assuming your Breadcrumb component is here
import { DataTable } from "@/components/ui/dataTable";
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
          <StatCard />
          <div className="mx-auto w-full">
            <DataTable />
          </div>

          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>

      {/* Sidebar Section */}
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
