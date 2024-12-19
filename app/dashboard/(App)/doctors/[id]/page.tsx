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

export default function Page() {
  const params = useParams();
  const { id } = params;

  // Define the state types
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [specialtyName, setSpecialtyName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log("doctorId", id);

  // Breadcrumb items with Arabic text
  const items = [
    { label: "الرئسية", href: "#" },
    { label: "الأطباء", href: "/dashboard/doctors" },
    { label: `${id}`, href: "/dashboard/doctors/1" },
  ];

  // Fetch doctor details and specialty information
  useEffect(() => {
    const fetchDoctorAndSpecialty = async () => {
      const accessToken = localStorage.getItem("access");
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
          const specialtiesResponse = await fetch("https://test-roshita.net/api/specialty-list/");
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
        <header className="flex justify-between h-16 shrink-0 items-center border-b px-4 gap-2">
          <Breadcrumb items={items} translate={(key) => key} />
          <SidebarTrigger className="rotate-180 " />
        </header>

        {/* Main Content Section */}
        <div className="p-4 flex flex-col justify-center">
          <div className="max-w-[1280px] w-full flex justify-start mx-auto">
            <div className="mb-4 max-w-[1280px]">
              {doctor && (
                <EditButton href={`/dashboard/doctors/edit/${doctor.id}`} />
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
                name={doctor?.staff.first_name + " " + (doctor?.staff.last_name ?? "") || "غير محدد"}
                specialty={specialtyName ?? "غير محدد"}
                hospital={doctor?.staff.medical_organization[0]?.name ?? "غير محدد"}
                location={doctor?.staff.medical_organization[0]?.city.foreign_name ?? "غير محدد"}
                phone={doctor?.staff.medical_organization[0]?.phone ?? "غير محدد"}
                imageSrc={doctor?.staff.staff_avatar ?? "/Images/default-doctor.jpg"}
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
