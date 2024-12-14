"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumb from "@/components/layout/app-breadcrumb";
import InformationCard from "@/components/shared/InformationCardProps";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DoctorData } from "@/constant";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  fixed_price: string;
}

interface Specialty {
  id: number;
  name: string;
  foreign_name: string;
}

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [specialtyName, setSpecialtyName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const items = [
    { label: "الرئسية", href: "/dashboard" },
    { label: "الأطباء", href: "/dashboard/doctors" },
    { label: "تعديل", href: "#" },
  ];

  useEffect(() => {
    const fetchDoctorAndSpecialty = async () => {
      const accessToken = localStorage.getItem("access");
      try {
        const response = await fetch(`/api/doctors/getDoctorById?id=${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const doctorData = await response.json();

        if (doctorData.success) {
          setDoctor(doctorData.data);

          const specialtiesResponse = await fetch("https://test-roshita.net/api/specialty-list/");
          const specialtiesData: Specialty[] = await specialtiesResponse.json();

          if (specialtiesResponse.ok) {
            const specialty = specialtiesData.find(
              (item) => item.id === doctorData.data.specialty
            );
            setSpecialtyName(specialty?.name || "Specialty not found");
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

  const handleUpdateDoctor = async () => {
    if (!doctor) return;

    const updatedDoctor = {
      ...doctor,
      staff: {
        ...doctor.staff,
        city: doctor.staff.medical_organization[0]?.city.foreign_name || "",
        address: "Updated Address",
      },
      specialty: 1,
      fixed_price: doctor.fixed_price || "0",
      rating: 5,
      is_consultant: true,
    };

    try {
      const accessToken = localStorage.getItem("access");
      const response = await fetch(`/api/doctors/updateDoctorById?id=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedDoctor),
      });

      const result = await response.json();
      if (result.success) {
        setDoctor(updatedDoctor);
        window.location.href="/dashboard/doctors"; // Navigate on success
      } else {
        setError(result.message || "Error updating doctor information");
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
      setError("An error occurred while updating doctor information");
    }
  };

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center border-b px-4 gap-2">
          <Breadcrumb items={items} translate={(key) => key} />
          <SidebarTrigger className="rotate-180 " />
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="p-8 space-y-8">
            {error && <div className="text-red-500">{error}</div>}
            <InformationCard
              title="بيانات الشخصية"
              name={doctor?.staff.first_name + " " + (doctor?.staff.last_name ?? "") || "غير محدد"}
              fields={[
                { label: "رقم الهاتف", value: `${doctor?.staff.medical_organization[0]?.phone ?? "غير محدد"}` },
                { label: "مكان", value: `${doctor?.staff.medical_organization[0]?.city.foreign_name ?? "غير محدد"}` },
                { label: "سعر الحجز", value: `${doctor?.fixed_price ?? "غير محدد"}` },
              ]}
              picture={doctor?.staff.staff_avatar ?? "/Images/default-doctor.jpg"}
              photoUploadHandler={(file) => console.log("Photo uploaded:", file)}
              onNameChange={(name) => setDoctor((prev) => prev && { ...prev, staff: { ...prev.staff, first_name: name } })}
              onFieldChange={(index, value) => {
                if (index === 0) {
                  setDoctor((prev) =>
                    prev && {
                      ...prev,
                      staff: {
                        ...prev.staff,
                        medical_organization: prev.staff.medical_organization.map((org, i) =>
                          i === 0 ? { ...org, phone: value } : org
                        ),
                      },
                    }
                  );
                }
                if (index === 1) {
                  setDoctor((prev) =>
                    prev && {
                      ...prev,
                      staff: {
                        ...prev.staff,
                        medical_organization: prev.staff.medical_organization.map((org, i) =>
                          i === 0 ? { ...org, city: { ...org.city, foreign_name: value } } : org
                        ),
                      },
                    }
                  );
                }
                if (index === 2) {
                  setDoctor((prev) => prev && { ...prev, fixed_price: value });
                }
              }}
            />
            <Button
              variant="register"
              className="rounded-2xl h-[52px] w-[140px]"
              onClick={handleUpdateDoctor}
            >
              حفظ
            </Button>
          </div>
        </div>
      </SidebarInset>
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
