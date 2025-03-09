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
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Folder } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs component

// Define the types for the data you're expecting from the API
interface Consultation {
  id: number;
  diagnosis_description_request: string;
  patient: number;
  specialty: number;
  patient_files: any[];
  status: string;
}

interface APIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Consultation[];
}

type Language = "ar" | "en";

export default function Page() {
  const [language, setLanguage] = useState<Language>("ar");
  const [loading, setLoading] = useState<boolean>(true);
  const [consultations, setConsultations] = useState<Consultation[]>([]); // Initialize as an empty array
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page
  const [totalPages, setTotalPages] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null | undefined>(
    null
  );

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "my">("all"); // Track active tab
  const [hospitalId, setHospitalId] = useState<string | null>(null); // Store hospital ID

  // Fetch all consultations from the API
  const fetchAllConsultations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(
        `https://test-roshita.net/api/consultation-requests/?page=${currentPage}&page_size=${itemsPerPage}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch consultations");
      }

      const data: APIResponse = await response.json();
      console.log("this is the data", data)
      //@ts-ignore
      setConsultations(data || []); // Ensure results is an array
      setTotalPages(Math.ceil(data.count / itemsPerPage)); // Calculate total pages
    } catch (error) {
      console.error("Error fetching consultations:", error);
      setConsultations([]); // Set consultations to an empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Active Tab Changed:", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user"); // Get the whole user object
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser); // Parse it to an object
      const storedHospitalId = parsedUser?.medical_organization?.id; // Access the nested ID
      console.log("storedHospitalId", storedHospitalId);
      setHospitalId(storedHospitalId)
    } else {
      console.log("No user data in localStorage");
    }
  }, []);
  

  // Fetch hospital-specific consultations from the API
  const fetchHospitalConsultations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      const storedUser = localStorage.getItem("user");
  
      if (!storedUser) {
        throw new Error("User data not found in localStorage");
      }
  
      const parsedUser = JSON.parse(storedUser);
      const hospitalId = parsedUser?.medical_organization?.id;
  
      console.log("Fetched hospitalId from localStorage:", hospitalId);
  
      if (!hospitalId) {
        throw new Error("Hospital ID not found");
      }
  
      const response = await fetch(
        `https://test-roshita.net/api/user-consultation-requests/by_hospital/${hospitalId}/?page=${currentPage}&page_size=${itemsPerPage}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch hospital consultations");
      }
  
      const data: APIResponse = await response.json();
      setConsultations(data.results || []); // Ensure results is an array
      setTotalPages(Math.ceil(data.count / itemsPerPage)); // Calculate total pages
    } catch (error) {
      console.error("Error fetching hospital consultations:", error);
      setConsultations([]); // Set consultations to an empty array on error
    } finally {
      setLoading(false);
    }
  };
  

  // Fetch consultations based on the active tab
  useEffect(() => {
    if (activeTab === "all") {
      fetchAllConsultations();
    } else if (activeTab === "my") {
      fetchHospitalConsultations();
    }
  }, [currentPage, itemsPerPage, activeTab]); // Re-fetch when page or tab changes

  console.log("activeTab", activeTab);

  // Handle language change
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

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Breadcrumb items
  const items = [
    { label: language === "ar" ? "الرئسية" : "Dashboard", href: "#" },
    {
      label: language === "ar" ? "الاستشارات" : "Consultations",
      href: "/dashboard/consultations",
    },
  ];

  // Debugging: Log consultations to ensure it's populated correctly
  useEffect(() => {
    console.log("Consultations:", consultations);
    console.log("consultations.length", consultations.length)
  }, [consultations]);

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
                  {/* Tabs for All Requests and My Requests */}
                  <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                      setActiveTab(value as "all" | "my")
                    }
                  >
                    <TabsList>
                      <TabsTrigger value="all">
                        {language === "ar" ? "جميع الطلبات" : "All Requests"}
                      </TabsTrigger>
                      <TabsTrigger value="my">
                        {language === "ar" ? "طلباتي" : "My Requests"}
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

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
                        Date: {format(selectedDate, "yyyy-MM-dd")}
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
                {consultations.length > 0 ? (
                  consultations.map((consultation) => (
                    <RequestCard
                      key={consultation.id}
                      requestNumber={consultation.id.toString()}
                      patientName={`Patient ${consultation.patient}`}
                      requestDate={"2025-10-01"} // Replace with actual date if available
                      speciality={`Specialty ${consultation.specialty}`}
                      language={language}
                      userType="hospital"
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-500 mt-40">
                    {language === "ar"
                      ? "لا توجد استشارات لعرضها"
                      : "No consultations to display"}
                  </div>
                )}

                {consultations.length > 0 && (
                  <PaginationDemo
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      <AppSidebar side="right" />
    </SidebarProvider>
  );
}