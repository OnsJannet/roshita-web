"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumb from "@/components/layout/app-breadcrumb";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { MoveRight } from "lucide-react";
import UploadButton from "@/components/unique/UploadButton";

// The structure of the data being sent to the backend
// The structure of the data being sent to the backend
interface DoctorFormData {
  firstName: string;
  lastName: string;
  city: number;
  address: string;
  specialty: number;
  fixedPrice: string;
  rating: number;
  isConsultant: boolean;
}

interface Specialty {
  id: number;
  name: string;
  foreign_name: string;
}

export default function Page() {
   // Breadcrumb items with Arabic text
   const items = [
    { label: "الرئسية", href: "/dashboard" },
    { label: "الأطباء", href: "/dashboard/doctors" },
    { label: "إضافة", href: "#" },
  ];

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [formData, setFormData] = useState<DoctorFormData>({
    firstName: "",
    lastName: "",
    city: 1,
    address: "",
    specialty: 0,
    fixedPrice: "",
    rating: 0,
    isConsultant: false,
  });

  // Handle input changes
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    setFormData((prevData) => {
      let value: string | number | boolean = e.target.value; // Start by assuming it's a string
  
      // Convert values to appropriate types
      if (field === "rating") {
        value = Number(e.target.value); // Ensure rating is a number
      } else if (field === "specialty") {
        value = Number(e.target.value); // Ensure specialty is a number
      } else if (field === "isConsultant" && e.target instanceof HTMLInputElement) {
        value = e.target.checked; // Checkbox is a boolean
      }
  
      return {
        ...prevData,
        [field]: value,
      };
    });
  };
  
  

  console.log("specialties", specialties)

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      const response = await fetch("/api/doctors/createDoctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          staff: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            city: formData.city,
            address: formData.address,
          },
          specialty: Number(formData.specialty), // Ensure specialty is sent as a number
          fixed_price: formData.fixedPrice,
          rating: Number(formData.rating), // Ensure rating is sent as a number
          is_consultant: formData.isConsultant, // This will be a boolean
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert("Doctor added successfully!");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error submitting doctor:", error);
      alert("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await fetch(
          "https://test-roshita.net/api/specialty-list/"
        );
        const data = await response.json();
        if (data) {
          setSpecialties(data); // Adjust this line based on the actual structure of your response
        } else {
          console.error("Failed to fetch specialties:", data.error);
        }
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };

    fetchSpecialties();
  }, []);

  return (
    <SidebarProvider>
      <SidebarInset>
        {/* Header Section */}
        <header className="flex justify-between h-16 shrink-0 items-center border-b px-4 gap-2">
          <Breadcrumb items={items} translate={(key) => key} />{" "}
          {/* Pass a no-op translate function */}
          <SidebarTrigger className="rotate-180 " />
        </header>

        {/* Main Content Section */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="p-8 space-y-8">
            <div className="flex flex-col border rounded-lg bg-white shadow-sm max-w-[1280px] mx-auto rtl">
              <h2 className="text-lg font-semibold text-gray-700 text-end border-b p-4">
                بيانات الشخصية
              </h2>
              <div className="flex flex-row-reverse justify-start items-center p-4 gap-4">
                <UploadButton
                  onUpload={(file) => console.log("Personal photo uploaded:", file)}
                  picture=""
                />
                <div className="flex flex-col">
                  <h4 className="text-end">الإســــــم</h4>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleFieldChange(e, "firstName")}
                    className="text-end border p-2 rounded"
                  />
                </div>
              </div>
              <table className="w-full text-right p-4">
                <tbody>
                  <tr className="border-t p-4">
                    <td className="py-3 px-2 text-gray-500 p-4 text-center">
                      <div className="flex justify-center">
                        <MoveRight className="h-4 w-4" />
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-700 p-4">
                      <input
                        type="text"
                        value={formData.fixedPrice}
                        onChange={(e) => handleFieldChange(e, "fixedPrice")}
                        className="text-end border p-2 rounded"
                      />
                    </td>
                    <td className="py-3 px-2 text-gray-500 p-4">سعر الحجز</td>
                  </tr>
                  <tr className="border-t p-4">
                    <td className="py-3 px-2 text-gray-500 p-4 text-center">
                      <div className="flex justify-center">
                        <MoveRight className="h-4 w-4" />
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-700 p-4">
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleFieldChange(e, "address")}
                        className="text-end border p-2 rounded"
                      />
                    </td>
                    <td className="py-3 px-2 text-gray-500 p-4">مكان</td>
                  </tr>
                  {/* Other fields */}
                  <tr className="border-t p-4">
                    <td className="py-3 px-2 text-gray-500 p-4 text-center">
                      <div className="flex justify-center">
                        <MoveRight className="h-4 w-4" />
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-700 p-4">
                      <select
                        value={formData.specialty}
                        onChange={(e) => handleFieldChange(e, "specialty")}
                        className="text-end border p-2 rounded w-[19%]"
                      >
                        <option value={0}>اختر التخصص</option>
                        {specialties.map((specialty) => (
                          <option key={specialty.id} value={specialty.id}>
                            {specialty.name} ({specialty.foreign_name})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-2 text-gray-500 p-4">التخصص</td>
                  </tr>
                  <tr className="border-t p-4">
                    <td className="py-3 px-2 text-gray-500 p-4 text-center">
                      <div className="flex justify-center">
                        <MoveRight className="h-4 w-4" />
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-700 p-4">
                      <input
                        type="number"
                        value={formData.rating}
                        onChange={(e) => handleFieldChange(e, "rating")}
                        className="text-end border p-2 rounded"
                      />
                    </td>
                    <td className="py-3 px-2 text-gray-500 p-4">التقييم</td>
                  </tr>
                  <tr className="border-t p-4">
                    <td className="py-3 px-2 text-gray-500 p-4 text-center">
                      <div className="flex justify-center">
                        <MoveRight className="h-4 w-4" />
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-700 p-4">
                    <input
                      type="checkbox"
                      checked={formData.isConsultant}
                      onChange={(e) => handleFieldChange(e, "isConsultant")}
                      className="text-end border p-2 rounded"
                    />
                    </td>
                    <td className="py-3 px-2 text-gray-500 p-4">استشاري</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Button
              variant="register"
              className="rounded-2xl h-[52px] w-[140px]"
              onClick={handleSubmit}
            >
              حفظ
            </Button>
          </div>
        </div>
      </SidebarInset>

      {/* Sidebar Section */}
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
