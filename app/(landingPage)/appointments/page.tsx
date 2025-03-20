"use client";
import React, { useEffect, useState } from "react";
import { Bell, LogOut, MonitorCheck, Settings, UserRound } from "lucide-react";
import AppointementsCard from "@/components/unique/AppointementsCard"; // Adjust the import path as needed
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"; // Adjust the import path as needed
import LoadingDoctors from "@/components/layout/LoadingDoctors";

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
    loading: "Loading...",
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
    loading: "جاري التحميل...",
  },
};

const Page = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<"previous" | "next">("next");
  const [language, setLanguage] = useState<Language>("ar");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page
  const [loading, setLoading] = useState(true); // Loading state

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
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

  useEffect(() => {
    const fetchAllAppointments = async () => {
      const token = localStorage.getItem("access");
      const userID = localStorage.getItem("userId");

      try {
        let allAppointments: any[] = [];
        let page = 1;
        let totalPages = 1;

        do {
          const response = await fetch(
            `https://test-roshita.net/api/user-appointment-reservations/filter-appointments/?user_id=${userID}&page=${page}`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            allAppointments = allAppointments.concat(data.results || []);
            totalPages = Math.ceil(data.count / itemsPerPage);
            page++;
          } else {
            console.error("Failed to fetch appointments:", response.statusText);
            break;
          }
        } while (page <= totalPages);

        setAppointments(allAppointments);
        setFilteredAppointments(allAppointments);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setErrorMessage("Failed to fetch appointments");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchAllAppointments();
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

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

  const handleFilterChange = (type: "previous" | "next") => {
    setFilterType(type);
    filterAppointments(appointments, type);
    setCurrentPage(1); // Reset to first page when filter changes
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

  const handleConsultationsClick = () => {
    router.push("/consultations");
  };

  const handleNotificationsClick = () => {
    router.push("/notifications");
  };

  const handleSettingsPasswordClick = () => {
    router.push("/password-change");
  };

  const handleError = (errorMessage: string) => {
    console.error("Error from child:", errorMessage);
    setErrorMessage(errorMessage);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        <LoadingDoctors />
      </div>
    );
  }

  return (
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
                onClick={handleNotificationsClick}
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
          <div className="flex gap-10 text-end flex-col lg:w-[80%] w-full mx-auto">
            <div className="flex justify-center bg-white w-[80%] mx-auto p-8 rounded">
              <div
                className={`p-4 text-center border-l-gray-300 w-1/2 cursor-pointer ${
                  filterType === "next" ? "font-bold" : ""
                }`}
                onClick={() => handleFilterChange("next")}
              >
                {translations[language].next}
              </div>
              <div
                className={`p-4 text-center border-l-2 border-l-gray-300 w-1/2 cursor-pointer ${
                  filterType === "previous" ? "font-bold" : ""
                }`}
                onClick={() => handleFilterChange("previous")}
              >
                {translations[language].previous}
              </div>
            </div>
            {errorMessage && (
              <div
                className={`text-red-500 bg-red-100 p-4 rounded lg:w-[80%] w-full mx-auto ${
                  language === "ar" ? "text-end" : "text-start"
                }`}
              >
                {errorMessage}
              </div>
            )}
            <div className="flex flex-col gap-4">
              {currentItems.length > 0 ? (
                currentItems.map((appointment) => {
                  // Log the current appointment item
                  console.log("Current Appointment:", appointment);

                  return (
                    <AppointementsCard
                      key={appointment.id}
                      appointementId={appointment.id}
                      doctorID={appointment.doctor.id}
                      name={`${appointment.doctor.name} ${appointment.doctor.last_name}`}
                      specialty={appointment.doctor.specialty}
                      price={appointment.price}
                      location=""
                      imageUrl=""
                      day={new Date(
                        appointment.reservation.reservation_date
                      ).toLocaleDateString(language)}
                      time={new Date(
                        appointment.reservation.reservation_date
                      ).toLocaleTimeString(language, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      appointementStatus={
                        appointment.reservation.reservation_status
                      }
                      status={appointment.reservation.reservation_status}
                      onError={handleError}
                    />
                  );
                })
              ) : (
                <div className="text-center text-gray-500">
                  {translations[language].noAppointments}
                </div>
              )}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={handlePreviousPage}
                    //@ts-ignore
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => setCurrentPage(index + 1)}
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={handleNextPage}
                    //@ts-ignore
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
