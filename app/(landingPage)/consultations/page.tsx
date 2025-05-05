"use client";
import React, { useEffect, useState } from "react";
import { Bell, LogOut, MonitorCheck, Settings, UserRound } from "lucide-react";
import AppointementsCard from "@/components/unique/AppointementsCard"; // Adjust the import path as needed
import { useRouter } from "next/navigation";
import { fetchProfileDetails } from "@/lib/api";
import LoadingDoctors from "@/components/layout/LoadingDoctors";
import ConsultationDropdown from "@/components/shared/ConsultationDropdown";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"; // Import your pagination components
import withAuth from "@/hoc/withAuth";

type Language = "ar" | "en";

const translations = {
  en: {
    settings: "Settings",
    changePassword: "Change Password",
    appointments: "My Appointments",
    consultations: "My Consultations",
    notification: "Notifications",
    logout: "Log Out",
    next: "Next",
    previous: "Previous",
    noAppointments: "No appointments to display",
    noConsultations: "No consultations to display",
  },
  ar: {
    settings: "الإعدادات",
    changePassword: "تغير كلمة المرور",
    appointments: "مواعيدي",
    consultations: "استشارتي",
    logout: "تسجيل الخروج",
    notification: "إشعارات",
    next: "التالي",
    previous: "السابق",
    noAppointments: "لا توجد مواعيد لعرضها",
    noConsultations: "لا توجد استشارات لعرضها",
  },
};

interface EditProfileData {
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  gender: string;
  service_country: number;
  birthday: string;
  city: number;
  user_type: number;
  address: string;
}

interface Consultation {
  id: number;
  diagnosis_description_request: string;
  patient_detail: {
    id: number;
    first_name: string;
    last_name: string;
    relative: string;
    phone: string;
    email: string;
    city: number;
    address: string;
  };
  specialty_detail: {
    id: number;
    name: string;
    foreign_name: string;
  };
  patient_files: {
    id: number;
    file: string;
    content_file_type: string;
    description: string;
  }[];
  status: string;
  consultation_response: {
    id: number;
    diagnosis_description_response: string;
    selected_medical_organization: {
      id: number;
      name: string;
      foreign_name: string;
    };
    doctor: {
      id: number;
      name: string;
      last_name: string;
      specialty: string;
    };
    doctor_appointment_date: {
      id: number;
      scheduled_date: string;
      start_time: string;
      end_time: string;
      appointment_status: string;
    };
    estimated_cost: string;
    service_type: string;
    status: string;
  };
}

const Page = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<"previous" | "next">("next");
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("ar");
  const [errorMessage, setErrorMessage] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<EditProfileData>({
    user: {
      first_name: "",
      last_name: "",
      email: "",
    },
    gender: "",
    service_country: 2,
    birthday: "",
    city: 1,
    user_type: 0,
    address: "",
  });
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(0); // Total pages based on count

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

  useEffect(() => {
    const storedAppointments = localStorage.getItem("appointments");
    if (storedAppointments) {
      const parsedAppointments = JSON.parse(storedAppointments);
      setAppointments(parsedAppointments);
      filterAppointments(parsedAppointments, "next");
    }
  }, []);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await fetchProfileDetails();
        setProfileData({
          user: {
            first_name: data.user?.first_name || "",
            last_name: data.user?.last_name || "",
            email: data.user?.email || "",
          },
          gender: data.gender || "",
          service_country: data.service_country || 2,
          birthday: data.birthday || "",
          city: data.city || 1,
          user_type: data.user_type || 0,
          address: data.address || "",
        });
      } catch (error) {
        console.error("Error loading profile data", error);
      }
    };

    loadProfileData();
  }, []);

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access");
        const patientId = localStorage.getItem("patientId");
        const response = await fetch(
          `https://test-roshita.net/api/user-consultation-requests/by_patient/${patientId}/?page=${currentPage}&page_size=${itemsPerPage}`,
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

        const data = await response.json();
        setConsultations(data.results);
        setTotalPages(Math.ceil(data.count / itemsPerPage));
      } catch (error) {
        console.error("Error fetching consultations:", error);
        setError("Failed to fetch consultations");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [currentPage]);

  // Slice consultations to display only the current page's items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentConsultations = consultations;

  const filterAppointments = (
    appointments: any[],
    type: "previous" | "next"
  ) => {
    const today = new Date();

    if (type === "next") {
      const nextAppointments = appointments.filter(
        (appointment) =>
          new Date(appointment.reservation.reservation_date) > today
      );
      setFilteredAppointments(nextAppointments);
    } else {
      const previousAppointments = appointments.filter(
        (appointment) =>
          new Date(appointment.reservation.reservation_date) <= today
      );
      setFilteredAppointments(previousAppointments);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  };

  const handleSettingsClick = () => {
    router.push("/profile");
  };

  const handleAppointmentsClick = () => {
    router.push("/appointments");
  };

  const handleSettingsPasswordClick = () => {
    router.push("/password-change");
  };

  const handleConsultationsClick = () => {
    router.push("/consultations");
  };

  const handleError = (errorMessage: string) => {
    console.error("Error from child:", errorMessage);
    setErrorMessage(errorMessage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen mx-auto">
        <LoadingDoctors />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return loading ? (
    <div className="bg-white flex items-center justify-center min-h-screen">
      <LoadingDoctors />
    </div>
  ) : (
    <div className="flex justify-center flex-col p-8 bg-[#fafafa]">
      <div>
        <div
          className={`flex ${
            language === "ar" ? "lg:flex-row-reverse" : "lg:flex-row"
          } flex-col justify-start gap-10 mx-auto`}
        >
          <div className="flex lg:w-[20%] w-[100%] justify-start gap-10 mx-auto p-4 bg-white rounded flex-col">
            <div className="mx-auto flex justify-center">
              <div className="relative lg:w-60 lg:h-60 xl:w-20 xl:h-20 h-40 w-40">
                <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center overflow-hidden">
                  <UserRound className="w-1/2 h-1/2 text-roshitaBlue" />
                </div>
              </div>
            </div>
            <div>
              <div
                onClick={handleSettingsClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].settings}</p>
              </div>
              <div
                onClick={handleSettingsPasswordClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].changePassword}</p>
              </div>
              <div
                onClick={handleAppointmentsClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <MonitorCheck className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].appointments}</p>
              </div>
              <div
                onClick={handleConsultationsClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <MonitorCheck className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].consultations}</p>
              </div>
              <div
                onClick={handleAppointmentsClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].notification}</p>
              </div>
              <div
                onClick={handleLogout}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <LogOut className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].logout}</p>
              </div>
            </div>
          </div>
          <div className="lg:w-[80%]">
            <div
              className={`flex mb-4 ${
                language === "ar" ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              <Button
                className="bg-[#1584c5]"
                onClick={() => (window.location.href = "/create-consultation")}
              >
                {language === "en"
                  ? "Create New Consultation"
                  : "إنشاء استشارة جديدة"}
              </Button>
            </div>
            {currentConsultations.length > 0 ? (
              <div className="flex flex-col gap-4">
                {currentConsultations.map((consultation) => (
                  <ConsultationDropdown
                    key={consultation.id}
                    requestId={consultation.id}
                    consultationId={consultation.consultation_response?.id}
                    hospitalName={
                      language === "ar"
                        ? consultation?.consultation_response
                            ?.selected_medical_organization?.name
                        : consultation?.consultation_response
                            ?.selected_medical_organization?.foreign_name
                    }
                    notificationMessage=""
                    creatin_date=""
                    date={
                      consultation.consultation_response
                        ?.doctor_appointment_date?.scheduled_date ||
                      "No date available"
                    }
                    price={consultation.consultation_response?.estimated_cost}
                    consultationType="استشارة خاصة"
                    doctorMessage={
                      consultation.consultation_response
                        ?.diagnosis_description_response ||
                      "No doctor message available"
                    }
                    patientMessage={consultation.diagnosis_description_request}
                    language={language}
                    files={consultation.patient_files}
                    consultationStatus={consultation.status}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                {translations[language].noConsultations}
              </p>
            )}
            {currentConsultations.length > 0 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    //@ts-ignore
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => handlePageChange(index + 1)}
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    //@ts-ignore
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page);
