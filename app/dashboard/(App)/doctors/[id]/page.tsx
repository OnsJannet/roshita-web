"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumb from "@/components/layout/app-breadcrumb";
import EditButton from "@/components/layout/editButton";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DoctorCard from "@/components/unique/DoctorCardDash";
import { useParams } from "next/navigation";

// Define types for doctor data and specialty data
interface Doctor {
  id: string;
  staff: {
    first_name: string;
    last_name: string;
    medical_organization: {
      name: string;
      city: { foreign_name: string };
      phone: string;
    }[];
    staff_avatar: string;
  };
}

interface Specialty {
  id: number;
  name: string;
  foreign_name: string;
}

type Params = {
  id: string;
};

type Language = "ar" | "en";

/**
 * Doctor Detail Page
 *
 * This page is responsible for displaying detailed information about a doctor.
 * It retrieves and displays the doctor's data, including their name, specialty,
 * hospital information, location, and contact details. The page also provides
 * functionality for editing and uploading information related to the doctor.
 *
 * Features:
 * - Displays doctor details such as name, specialty, hospital name, location,
 *   and phone number.
 * - Fallback values are provided for missing data, with a default of "غير محدد"
 *   (meaning "not defined" in Arabic) for any missing or undefined information.
 * - Displays the doctor's profile picture or a default image if the avatar is not available.
 * - Includes a breadcrumb navigation with Arabic text to navigate between pages.
 * - Supports dynamic fetching of data based on the doctor's unique ID (from the URL).
 * - Handles loading states and errors when fetching data.
 * - Provides buttons for editing the doctor's details.
 * - The page is styled to fit within a sidebar layout and displays detailed content in a
 *   user-friendly manner.
 *
 * Fetching Flow:
 * 1. The doctor's data is fetched from the backend API based on the ID parameter from
 *    the URL.
 * 2. If the data is successfully retrieved, it is displayed on the page. If any data
 *    is missing, fallback values are shown.
 * 3. If there's an error or if the doctor is not found, an error message is displayed.
 * 4. Specialties are also fetched dynamically, and the corresponding specialty name
 *    is displayed alongside the doctor's other information.
 *
 * Components Used:
 * - Breadcrumb: Displays the page hierarchy for easy navigation.
 * - DoctorCard: Displays detailed information about the doctor in a visually appealing way.
 * - EditButton: Provides the option to edit the doctor's information.
 *
 * Expected Props:
 * - Doctor: The doctor object containing the relevant information (name, specialty, etc.).
 * - Specialty: A list of specialties used to match and display the doctor's specialty.
 *
 * Example:
 * The doctor with ID '123' will load their profile, and their specialty will be shown
 * as "Cardiology" if the specialty exists in the list.
 *
 * Notes:
 * - All error messages and fallback values are in Arabic, with some elements in English
 *   for accessibility and better user experience.
 * - The page is optimized for mobile and desktop views and is part of a larger admin
 *   panel for managing doctors.
 */

export default function Page() {
  const params = useParams<Params>();
  const id = params?.id;

  // Define the state types
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [specialtyName, setSpecialtyName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("ar");

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

  console.log("doctorId", id);

  // Breadcrumb items with Arabic text
  const items = [
    { label: language === "ar" ? "الرئسية" : "Dashboard", href: "#" },
    {
      label: language === "ar" ? "الأطباء" : "Doctors",
      href: "/dashboard/doctors",
    },
    { label: `${id}`, href: "#" },
  ];

  // Fetch doctor details and specialty information
  useEffect(() => {
    const fetchDoctorAndSpecialty = async () => {
      const accessToken =
        typeof window !== "undefined" ? localStorage.getItem("access") : null;
      try {
        // Fetch doctor data
        const response = await fetch(`/api/doctors/getDoctorById?id=${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`, // Send the token in the Authorization header
          },
        });
        const doctorData = await response.json();

        if (doctorData.success) {
          setDoctor(doctorData.data);

          // Fetch specialties
          const specialtiesResponse = await fetch(
            "https://test-roshita.net/api/specialty-list/"
          );
          const specialtiesData: Specialty[] = await specialtiesResponse.json();

          if (specialtiesResponse.ok) {
            // Find specialty by ID
            const specialty = specialtiesData.find(
              (item) => item.id === doctorData.data.specialty
            );
            if (specialty) {
              setSpecialtyName(specialty.name);
            } else {
              setSpecialtyName("Specialty not found");
            }
          } else {
            setSpecialtyName("Error fetching specialties");
          }
        } else {
          setError("Doctor not found");
        }
      } catch (error) {
        setError("An error occurred while fetching doctor data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorAndSpecialty();
  }, [id]);

  const handleUpload = (file: File) => {
    console.log("Uploaded file:", file);
    // Handle the uploaded file (e.g., send it to a server or preview it)
  };

  const handleEdit = () => {
    console.log("Edit clicked");
  };

  const handleDelete = () => {
    console.log("Delete clicked");
  };

  return (
    <SidebarProvider>
      <SidebarInset>
        {/* Header Section */}
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

        {/* Main Content Section */}
        <div className="p-4 flex flex-col justify-center">
          <div className="max-w-[1280px] w-full flex justify-start mx-auto">
            <div className="mb-4 max-w-[1280px]">
              {doctor && (
                <EditButton
                  href={`/dashboard/doctors/edit/${doctor.id}`}
                  language={language}
                />
              )}
            </div>
          </div>

          {loading ? (
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="p-8 space-y-8">
              <DoctorCard
                name={
                  doctor?.staff.first_name +
                    " " +
                    (doctor?.staff.last_name ?? "") ||
                  (language === "ar" ? "غير محدد" : "Not specified")
                }
                specialty={
                  specialtyName ??
                  (language === "ar" ? "غير محدد" : "Not specified")
                }
                hospital={
                  doctor?.staff.medical_organization[0]?.name ??
                  (language === "ar" ? "غير محدد" : "Not specified")
                }
                location={
                  doctor?.staff.medical_organization[0]?.city.foreign_name ??
                  (language === "ar" ? "غير محدد" : "Not specified")
                }
                phone={
                  doctor?.staff.medical_organization[0]?.phone ??
                  (language === "ar" ? "غير محدد" : "Not specified")
                }
                imageSrc={
                  doctor?.staff.staff_avatar ?? "/Images/default-doctor.jpg"
                }
                language={language}
              />
            </div>
          )}

          {/* Empty div to fill space */}
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>

      {/* Sidebar Section */}
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
