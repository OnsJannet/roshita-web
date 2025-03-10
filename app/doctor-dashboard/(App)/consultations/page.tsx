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
  const [lengthData, setLengthData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(10); // Number of requests to display per page
  const [selectedDate, setSelectedDate] = useState<Date | null | undefined>(null); // State for date filter
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(""); // State for specialty filter

  const data = [
    {
      requestNumber: "1222233",
      patientName: "علي احمد",
      requestDate: "2025-10-01",
      speciality: "Cardiology",
    },
    {
      requestNumber: "1222234",
      patientName: "محمد خالد",
      requestDate: "2025-10-02",
      speciality: "Dermatology",
    },
    {
      requestNumber: "1222235",
      patientName: "فاطمة علي",
      requestDate: "2025-10-03",
      speciality: "Orthopedics",
    },
    {
      requestNumber: "1222236",
      patientName: "ليلى محمد",
      requestDate: "2025-10-04",
      speciality: "Pediatrics",
    },
    {
      requestNumber: "1222237",
      patientName: "أحمد سعيد",
      requestDate: "2025-10-05",
      speciality: "Neurology",
    },
    {
      requestNumber: "1222238",
      patientName: "سارة عبدالله",
      requestDate: "2025-10-06",
      speciality: "Oncology",
    },
    {
      requestNumber: "1222239",
      patientName: "خالد حسن",
      requestDate: "2025-10-07",
      speciality: "Radiology",
    },
    {
      requestNumber: "1222240",
      patientName: "نورة علي",
      requestDate: "2025-10-08",
      speciality: "Gynecology",
    },
    {
      requestNumber: "1222241",
      patientName: "عبدالرحمن سليمان",
      requestDate: "2025-10-09",
      speciality: "Urology",
    },
    {
      requestNumber: "1222242",
      patientName: "مريم خالد",
      requestDate: "2025-10-10",
      speciality: "Psychiatry",
    },
    {
      requestNumber: "1222243",
      patientName: "يوسف أحمد",
      requestDate: "2025-10-11",
      speciality: "Endocrinology",
    },
    {
      requestNumber: "1222244",
      patientName: "حسن محمد",
      requestDate: "2025-10-12",
      speciality: "Gastroenterology",
    },
  ];

  // Filter data based on selected date and specialty
  const filteredData = data.filter((item) => {
    const matchesDate = selectedDate
      ? new Date(item.requestDate).toDateString() ===
        selectedDate.toDateString()
      : true;
    const matchesSpecialty = selectedSpecialty
      ? item.speciality === selectedSpecialty
      : true;
    return matchesDate && matchesSpecialty;
  });

  // Pagination logic for RequestCard
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredData.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const totalPages = Math.ceil(filteredData.length / requestsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  const [loading, setLoading] = useState<boolean>(true);

  // Fetch function
  const fetchData = async () => {
    try {
      if (
        typeof window !== "undefined" &&
        typeof localStorage !== "undefined"
      ) {
        const accessToken = localStorage.getItem("access");

        if (!accessToken) {
          throw new Error("Access token not found");
        }

        const response = await fetch(
          `/api/doctors/getDoctors?page=${currentPage}&limit=5`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch data");

        const result: APIResponse = await response.json();

        console.log("result", result);
        setLengthData(result.total);

        const paymentData: Payment[] = result.data.map((doctor) => ({
          img: doctor.staff.staff_avatar,
          id: doctor.id.toString(),
          دكاترة: `دكتور ${doctor.staff.first_name} ${doctor.staff.last_name}`,
          "تاريخ الانضمام": new Date(doctor.create_date),
          التقييم: doctor.rating || 0,
        }));

        setTableData(paymentData);
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
      label: language === "ar" ? "الاستشارات" : "Consultations",
      href: "/dashboard/consultations",
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
          <div className="mx-auto w-full">
            {loading ? (
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            ) : (
              <div className="p-4 flex flex-col gap-4">
                {/* Filter Section */}
                <div className="flex gap-4 items-center">
                  {/* Date Picker */}
                  <DatePicker
                  /* @ts-ignore */
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    placeholder="Select a date"
                  />

                  {/* Specialty Dropdown */}
                  <Select onValueChange={setSelectedSpecialty}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Dermatology">Dermatology</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Oncology">Oncology</SelectItem>
                      <SelectItem value="Radiology">Radiology</SelectItem>
                      <SelectItem value="Gynecology">Gynecology</SelectItem>
                      <SelectItem value="Urology">Urology</SelectItem>
                      <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                      <SelectItem value="Endocrinology">
                        Endocrinology
                      </SelectItem>
                      <SelectItem value="Gastroenterology">
                        Gastroenterology
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Display Selected Filters */}
                  <div className="flex gap-2 items-center">
                    {selectedDate && (
                      <div className="px-3 py-1 bg-gray-100 rounded-md text-sm">
                        Date: {format(selectedDate, 'yyyy-MM-dd')}
                      </div>
                    )}
                    {selectedSpecialty && (
                      <div className="px-3 py-1 bg-gray-100 rounded-md text-sm">
                        Specialty: {selectedSpecialty}
                      </div>
                    )}
                  </div>

                  {/* Reset Button */}
                  {(selectedDate || selectedSpecialty) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedDate(null);
                        setSelectedSpecialty("");
                      }}
                    >
                      Reset Filters
                    </Button>
                  )}
                </div>

                {/* Request Cards */}
                {currentRequests.map((item, index) => (
                  <RequestCard
                    key={index}
                    requestNumber={item.requestNumber}
                    patientName={item.patientName}
                    requestDate={item.requestDate}
                    speciality={item.speciality}
                    language={language}
                    //doctors={tableData}
                    userType="hospital"
                  />
                ))}

                {/* Pagination */}
                <PaginationDemo
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      <AppSidebar side="right" />
    </SidebarProvider>
  );
}