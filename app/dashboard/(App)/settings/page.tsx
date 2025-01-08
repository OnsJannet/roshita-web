"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumb from "@/components/layout/app-breadcrumb";
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

/**
 * Settings Page Component
 * 
 * This page allows the user to view and update their profile settings, such as personal information
 * (name, email, phone, address), city, birthday, and avatar. The doctor profile is fetched from 
 * an API, and the user can upload a new avatar, update fields like name, phone, email, and birthday,
 * and change the city. The settings are persisted through API calls and localStorage. 
 * The page also supports switching between Arabic ("ar") and English ("en") for localization.
 * 
 * Key features:
 * - Fetches doctor data (name, email, phone, etc.) from an API using a provided access token.
 * - Allows updating doctor profile information (phone number, city, birthday, email, address).
 * - Supports uploading a new avatar image, with image preview and file handling.
 * - Displays a breadcrumb navigation based on the selected language.
 * - Handles city selection with dynamic population of available cities.
 * - The page layout and UI elements are adapted for both Arabic and English languages.
 * - Updates to the profile are sent to the server using a POST request to update the profile.
 * - Error handling is implemented to show relevant error messages if the data fetch or update fails.
 * 
 * Components used:
 * - `AppSidebar`: Sidebar component for navigation.
 * - `Breadcrumb`: A breadcrumb navigation component that dynamically displays the page path.
 * - `InformationUserCard`: Displays and allows modification of personal information fields.
 * - `Button`: A UI button to save the updated profile.
 * - `SidebarInset`, `SidebarTrigger`, `SidebarProvider`: UI components for handling sidebar behavior.
 * 
 * @component
 */


export default function Page() {
  const params = useParams();
  const router = useRouter();
  const { id } = params ?? {};
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [specialtyName, setSpecialtyName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<City[]>([]); // State for cities
  const [language, setLanguage] = useState<Language>("ar");
  const [formData, setFormData] = useState<{ Image?: File }>({});
  const [image, setImage] = useState("");

  const handleFileUpload = (file: File) => {
    setFormData((prev) => ({ ...prev, Image: file }));
    console.log("Uploaded file received in parent:", file);
  };

  useEffect(() => {
    if(typeof window !== 'undefined') {
      // Code that accesses `localStorage` goes here
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

  // Handle city change here
  const handleCityChange = (newCityId: string) => {
    setDoctor((prev) => {
      if (prev) {
        return {
          ...prev,
          city: newCityId, // Only update the city
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

    console.log("image", image);

    // Use the provided image if it exists, else fallback to the current avatar
    const updatedAvatar = image || "/Images/default-doctor.jpeg";

    // Create the updated doctor object based on the structure of the Doctor interface
    const updatedDoctor: Doctor = {
      ...doctor, // Copy all existing properties from the doctor object
      user: {
        ...doctor.user, // Retain current user properties
        first_name: doctor.user.first_name, // You may want to allow updating this
        last_name: doctor.user.last_name, // Same for last name
        email: doctor.user.email, // Same for email
        phone: doctor.user.phone, // Same for phone
      },
      gender: doctor.gender, // Retain the gender or update if needed
      birthday: doctor.birthday, // Retain the birthday or update if needed
      avatar: updatedAvatar, // Update avatar if a new image is provided
      city: doctor.city
        ? typeof doctor.city === "string"
          ? parseInt(doctor.city.replace(/\D/g, ""), 10) || doctor.city
          : doctor.city
        : null, // Handle null city

      user_type: doctor.user_type, // Retain user type
      address: doctor.address, // Update the address directly here
    };

    try {
      const accessToken = localStorage.getItem("access");
      const response = await fetch(`/api/user/editProfile/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedDoctor),
      });

      const result = await response.json();
      if (result.success) {
        setDoctor(updatedDoctor); // Update the doctor state with the updated information
        window.location.reload(); // Refresh the page after successful update
      } else {
        setError(result.message || "Error updating doctor information");
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
      setError("An error occurred while updating doctor information");
    }
  };

  // Handle field changes for other fields like email, phone, etc.
  const handleFieldChange = (index: number, value: string) => {
    setDoctor((prev) => {
      if (!prev) return prev;

      const updatedDoctor = { ...prev };
      switch (index) {
        case 0:
          updatedDoctor.user.phone = value; // Update phone
          break;
        case 1:
          updatedDoctor.city = value;
          break;
        case 2:
          updatedDoctor.birthday = value; // Update birthday
          break;
        case 3:
          updatedDoctor.user.email = value; // Update email
          break;
        default:
          break;
      }
      return updatedDoctor;
    });
  };

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
              name={`${doctor?.user.first_name} ${
                doctor?.user.last_name || ""
              }`}
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
              picture={"/Images/default-doctor.jpeg"}
              photoUploadHandler={(file: File | string) => {
                const filePath = file instanceof File ? file.name : file;
                setImage(filePath);

                setDoctor((prev) =>
                  prev
                    ? { ...prev, user: { ...prev.user, avatar: filePath } }
                    : prev
                );
              }}
              onNameChange={(name) =>
                setDoctor((prev) =>
                  prev
                    ? { ...prev, user: { ...prev.user, first_name: name } }
                    : prev
                )
              }
              onFieldChange={handleFieldChange} // Use the updated handleFieldChange function here
              cities={cities}
              onCityChange={handleCityChange} // Ensure this only updates the city field
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
