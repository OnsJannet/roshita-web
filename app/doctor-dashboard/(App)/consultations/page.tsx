"use client";
import { AppSidebar } from "@/components/app-sidebar";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the types for the data you're expecting from the API
interface Consultation {
  id: number;
  diagnosis_description_request: string;
  patient: {
    id: number;
    full_name: string;
  };
  specialty: {
    id: number;
    name: string;
  };
  patient_files: any[];
  status: string;
  requestDate?: string; // Add this field if available in the API response
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
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null | undefined>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [specialties, setSpecialties] = useState<
    { id: number; name: string; foreign_name: string }[]
  >([]);

  // Helper function to check if a date string is valid
  const isValidDate = (dateString: string | undefined): boolean => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime()); // Check if the date is valid
  };

  // Fetch consultations for a specific doctor
  const fetchDoctorConsultations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      const userId = localStorage.getItem("userId")
      const response = await fetch(
        `https://test-roshita.net/api/consultation-requests/by_doctor/${userId}/?page=${currentPage}&page_size=${itemsPerPage}`,
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
      console.log("API Response Data:", data);
      setConsultations(data.results || []);
      setTotalPages(Math.ceil(data.count / itemsPerPage));
    } catch (error) {
      console.error("Error fetching consultations:", error);
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specialties from the API
  const fetchSpecialties = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(
        "https://test-roshita.net/api/specialty-list/",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch specialties");
      }

      const data = await response.json();
      setSpecialties(data);
    } catch (error) {
      console.error("Error fetching specialties:", error);
    }
  };

  // Fetch consultations based on the active tab
  useEffect(() => {
    if (activeTab === "all") {
      fetchDoctorConsultations();
    }
  }, [currentPage, itemsPerPage, activeTab]);

  // Fetch specialties when the component mounts
  useEffect(() => {
    fetchSpecialties();
  }, []);

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

  // Filter consultations based on selected date and specialty
  const filterConsultations = (consultations: Consultation[]) => {
    let filteredConsultations = consultations;

    // Filter by selected date (if available)
    if (selectedDate) {
      filteredConsultations = filteredConsultations.filter((consultation) => {
        // Check if the requestDate is valid
        if (!isValidDate(consultation.requestDate)) return false;

        const consultationDate = new Date(consultation.requestDate!); // Safe to use ! because we checked validity
        return (
          consultationDate.toISOString().split("T")[0] ===
          selectedDate.toISOString().split("T")[0]
        );
      });
    }

    // Filter by selected specialty (if available)
    if (selectedSpecialty) {
      filteredConsultations = filteredConsultations.filter(
        (consultation) => consultation.specialty.name === selectedSpecialty
      );
    }

    return filteredConsultations;
  };

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
                    </TabsList>
                  </Tabs>

                  {/* Specialty Dropdown */}
                  <Select onValueChange={setSelectedSpecialty}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={language === "ar" ? "اختر التخصص" : "Select specialty"} />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty.id} value={specialty.name}>
                          {language === "ar"
                            ? specialty.name
                            : specialty.foreign_name}
                        </SelectItem>
                      ))}
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
                {filterConsultations(consultations).length > 0 ? (
                  filterConsultations(consultations).map((consultation) => (
                    <RequestCard
                      key={consultation.id}
                      requestNumber={consultation.id.toString()}
                      patientName={consultation.patient.full_name}
                      requestDate={"2025-10-01"} // Replace with actual date if available
                      speciality={consultation.specialty.name}
                      language={language}
                      userType="doctor"
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-500 mt-40">
                    {language === "ar"
                      ? "لا توجد استشارات لعرضها"
                      : "No consultations to display"}
                  </div>
                )}

                {filterConsultations(consultations).length > 0 && (
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