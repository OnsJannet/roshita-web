"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumb from "@/components/layout/app-breadcrumb";
import LoadingDoctors from "@/components/layout/LoadingDoctors";
import InformationCard from "@/components/shared/InformationCardProps";
import InformationUserCard from "@/components/shared/InformationUserCardProps";
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
  success: boolean;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  gender: string | null;
  birthday: string | null;
  avatar: string | null;
  city: string | number | null;
  user_type: number;
  address: string | null;
}

type InformationCardProps = {
  photoUploadHandler: (file: File) => void;
  // other props
};

interface Specialty {
  id: number;
  name: string;
  foreign_name: string;
}

interface City {
  id: number;
  name: string;
  foreign_name: string;
}

type Language = "ar" | "en";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const { id } = params ?? {};
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [specialtyName, setSpecialtyName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [language, setLanguage] = useState<Language>("ar");
  const [formData, setFormData] = useState<{ Image?: File }>({});
  const [image, setImage] = useState("");

  const handleFileUpload = (file: File) => {
    setFormData((prev) => ({ ...prev, Image: file }));
    console.log("Uploaded file received in parent:", file);
  };

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

  const items = [
    { label: language === "ar" ? "الرئسية" : "Home", href: "/dashboard" },
    {
      label: language === "ar" ? "إعدادات" : "Settings",
      href: "/dashboard/settings",
    },
    { label: language === "ar" ? "تعديل" : "Edit", href: "#" },
  ];

  const handleCityChange = (newCityId: string) => {
    setDoctor((prev) => {
      if (prev) {
        return {
          ...prev,
          city: newCityId,
        };
      }
      return prev;
    });
  };

  useEffect(() => {
    const fetchDoctorAndSpecialty = async () => {
      const accessToken =
        typeof window !== "undefined" ? localStorage.getItem("access") : null;

      try {
        if (!accessToken) {
          setError("Access token not found");
          return;
        }

        const response = await fetch(`/api/user/getProfile/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const doctorData = await response.json();

        if (doctorData.success) {
          setDoctor(doctorData.data);

          const specialtiesResponse = await fetch(
            "https://test-roshita.net/api/specialty-list/"
          );
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

    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://test-roshita.net/api/cities-list/"
        );
        const citiesData: City[] = await response.json();
        if (response.ok) {
          setCities(citiesData);
        } else {
          console.error("Error fetching cities");
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchDoctorAndSpecialty();
    fetchCities();
  }, [id]);

  const handleUpdateDoctor = async () => {
    if (!doctor) return;

    // Create a FormData object
    const formData = new FormData();

    // Append user details
    formData.append("user[first_name]", doctor.user.first_name);
    formData.append("user[last_name]", doctor.user.last_name);
    formData.append("user[email]", doctor.user.email);
    if (doctor.user.phone) {
      formData.append("user[phone]", doctor.user.phone);
    }

    // Append other fields
    if (doctor.gender) {
      formData.append("gender", doctor.gender);
    }
    if (doctor.birthday) {
      formData.append("birthday", doctor.birthday);
    }
    if (doctor.city) {
      formData.append("city", doctor.city.toString());
    }
    formData.append("user_type", doctor.user_type.toString());
    if (doctor.address) {
      formData.append("address", doctor.address);
    }

    // Append the avatar file if it exists
    if (image) {
      //@ts-ignore
      const file = formData.Image; // Replace this with the actual file object if available
      if (file instanceof File) {
        formData.append("avatar", file);
      }
    }

    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        setError("Access token not found");
        return;
      }

      // Send the request directly to the external API
      const response = await fetch(
        "http://www.test-roshita.net/api/account/profile/edit/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        setDoctor({
          ...doctor,
          avatar: image || "/Images/default-doctor.jpeg", // Update the avatar in the state
        });
        window.location.reload(); // Refresh the page after successful update
      } else {
        setError(result.message || "Error updating doctor information");
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
      setError("An error occurred while updating doctor information");
    }
  };

  const handleFieldChange = (index: number, value: string) => {
    setDoctor((prev) => {
      if (!prev) return prev;

      const updatedDoctor = { ...prev };
      switch (index) {
        case 0:
          updatedDoctor.user.phone = value;
          break;
        case 1:
          updatedDoctor.city = value;
          break;
        case 2:
          updatedDoctor.birthday = value;
          break;
        case 3:
          updatedDoctor.user.email = value;
          break;
        case 4:
          updatedDoctor.address = value;
          break;
        default:
          break;
      }
      return updatedDoctor;
    });
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
          <div className="p-8 space-y-8">
            {error && <div className="text-red-500">{error}</div>}
            <InformationUserCard
              title={
                language === "ar" ? "بيانات الشخصية" : "Personal Information"
              }
              name={`${doctor?.user.first_name}`}
              lastName={`${doctor?.user.last_name}`}
              fields={[
                {
                  label: language === "ar" ? "رقم الهاتف" : "Phone Number",
                  value:
                    doctor?.user.phone ??
                    (language === "ar" ? "غير محدد" : "Not specified"),
                },
                {
                  label: language === "ar" ? "المدينة" : "City",
                  value: (
                    doctor?.city ??
                    (language === "ar" ? "غير محدد" : "Not specified")
                  ).toString(),
                },
                {
                  label: language === "ar" ? "عيد ميلاد" : "Birthday",
                  value:
                    doctor?.birthday ??
                    (language === "ar" ? "غير محدد" : "Not specified"),
                },
                {
                  label: language === "ar" ? "بريد إلكتروني" : "Email",
                  value:
                    doctor?.user.email ??
                    (language === "ar" ? "غير محدد" : "Not specified"),
                },
                {
                  label: language === "ar" ? "العنوان" : "Address",
                  value:
                    doctor?.address ??
                    (language === "ar" ? "غير محدد" : "Not specified"),
                },
              ]}
              picture={image || "/Images/default-doctor.jpeg"}
              //@ts-ignore
              photoUploadHandler={handleFileUpload}
              onNameChange={(name) =>
                setDoctor((prev) =>
                  prev
                    ? { ...prev, user: { ...prev.user, first_name: name } }
                    : prev
                )
              }
              onLastNameChange={(name) =>
                setDoctor((prev) =>
                  prev
                    ? { ...prev, user: { ...prev.user, last_name: name } }
                    : prev
                )
              }
              onFieldChange={handleFieldChange}
              cities={cities}
              onCityChange={handleCityChange}
            />

            <Button
              variant="register"
              className="rounded-2xl h-[52px] w-[140px]"
              onClick={handleUpdateDoctor}
            >
              {language === "ar" ? "حفظ" : "Save"}
            </Button>
          </div>
        </div>
      </SidebarInset>
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}