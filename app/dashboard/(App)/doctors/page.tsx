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


/**
 * This is the main page component that displays a dashboard of doctors.
 * 
 * - It includes a sidebar, breadcrumbs for navigation, and a table showing doctor details such as name, rating, and join date.
 * - The page fetches data from an API and maps it into a `Payment[]` format to be displayed in the table.
 * - The table data is paginated, with 5 doctors per page, and it uses the `currentPage` state to track and update the displayed page.
 * - It supports two languages (`ar` for Arabic and `en` for English), and language preferences are stored in `localStorage` and can be dynamically updated.
 * - The component uses `useEffect` to manage side effects such as fetching data when the page or language changes.
 * - The `fetchData` function makes a GET request to `/api/doctors/getDoctors` with a Bearer token for authentication. The fetched data is then transformed and stored in the `tableData` state.
 * - A `StatCard` component is used to show summary statistics, and the `DataTable` component is used to display the list of doctors.
 * - The `Breadcrumb` component dynamically adjusts its labels based on the selected language.
 * - `SidebarProvider` and `SidebarInset` components are used to manage the sidebar layout, and the `AppSidebar` component is included on the right side of the page.
 * 
 * The component ensures a seamless user experience with a responsive layout and language adaptability.
 */


export default function Page() {
  const [tableData, setTableData] = useState<Payment[]>([]); // Now using Payment[] type
  const [language, setLanguage] = useState<Language>("ar");
  const [lengthData, setLengthData] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    console.log(`Current page: ${page}`);
    setCurrentPage(page);
    // Additional logic for handling page changes, if necessary
  };

  console.log("current page parenttt: " + currentPage)

  console.log("tableData", tableData)
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
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

  console.log("tableData", tableData);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch function
  const fetchData = async () => {
    try {
      // Check if window is defined (i.e., running on the client side)
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const accessToken = localStorage.getItem("access");
  
        if (!accessToken) {
          throw new Error("Access token not found");
        }
  
        // Make the fetch request with the Authorization header
        const response = await fetch(`/api/doctors/getDoctors?page=${currentPage}&limit=5`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`, // Send the token in the Authorization header
          },
        });
  
        if (!response.ok) throw new Error("Failed to fetch data");
  
        const result: APIResponse = await response.json();
  
        console.log("result", result);
        setLengthData(result.total);
  
        // Map Doctor[] to Payment[]
        const paymentData: Payment[] = result.data.map((doctor) => ({
          img: doctor.staff.staff_avatar,
          id: doctor.id.toString(),
          دكاترة: `دكتور ${doctor.staff.first_name} ${doctor.staff.last_name}`,
          "تاريخ الانضمام": new Date(doctor.create_date), // Adjust this field as needed
          التقييم: doctor.rating || 0,
        }));
  
        setTableData(paymentData); // Set the transformed data
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, [currentPage]);

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
              <DataTable data={tableData} lengthData={lengthData} onPageChange={handlePageChange}/>
            )}
          </div>
        </div>
      </SidebarInset>

      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
