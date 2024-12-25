"use client";
import { AppSidebar } from "@/components/app-sidebar";
import StatCard from "@/components/dashboard/StatCard";
import Breadcrumb from "@/components/layout/app-breadcrumb";
import { DataTable } from "@/components/ui/dataTable";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

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
  const [tableData, setTableData] = useState<Payment[]>([]); // Now using Payment[] type
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

  console.log("tableData", tableData);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch function
  const fetchData = async () => {
    try {
      // Retrieve the access token from localStorage
      const accessToken = localStorage.getItem("access");

      if (!accessToken) {
        throw new Error("Access token not found");
      }

      // Make the fetch request with the Authorization header
      const response = await fetch("/api/doctors/getDoctors?page=1&limit=10", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`, // Send the token in the Authorization header
        },
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const result: APIResponse = await response.json();

      console.log("result", result);

      // Map Doctor[] to Payment[]
      const paymentData: Payment[] = result.data.map((doctor) => ({
        img: doctor.staff.staff_avatar,
        id: doctor.id.toString(),
        دكاترة: `دكتور ${doctor.staff.first_name} ${doctor.staff.last_name}`,
        "تاريخ الانضمام": new Date(doctor.create_date), // Adjust this field as needed
        التقييم: doctor.rating || 0,
      }));

      setTableData(paymentData); // Set the transformed data
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Breadcrumb items

  const items = [
    { label: language === "ar" ? "الرئسية" : "Dashboard", href: "#" },
    {
      label: language === "ar" ? "الأطباء" : "Doctors",
      href: "/dashboard/doctors",
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
            <Breadcrumb items={items} translate={(key) => key} />{" "}
            {/* Pass a no-op translate function */}
            <SidebarTrigger className="rotate-180 " />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <StatCard />
          <div className="mx-auto w-full">
            {loading ? (
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            ) : (
              <DataTable data={tableData} />
            )}
          </div>
        </div>
      </SidebarInset>

      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
