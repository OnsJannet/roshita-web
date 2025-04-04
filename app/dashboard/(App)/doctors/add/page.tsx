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
import DoctorSlots from "@/components/layout/doctor-slot";

interface DoctorFormData {
  firstName: string;
  lastName: string;
  city: number;
  address: string;
  specialty: number;
  fixedPrice: string;
  rating: number;
  isConsultant: boolean;
  Image?: string;
  phoneNumber?: string;
  payMethode?: string;
  email?: string;
}

interface Specialty {
  id: number;
  name: string;
  foreign_name: string;
}

type Slot = {
  date: string;
  startTime: string;
  endTime: string;
  backendFormat: string;
};

type Language = "ar" | "en";

export default function Page() {
  const [language, setLanguage] = useState<Language>("ar");
  const [payMethode, setPayMethode] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
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

  const items = [
    { label: language === "ar" ? "الرئسية" : "Dashboard", href: "#" },
    {
      label: language === "ar" ? "الأطباء" : "Doctors",
      href: "/dashboard/doctors",
    },
    {
      label: language === "ar" ? "إضافة" : "Add",
      href: "/dashboard/doctors",
    },
  ];

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [cities, setCities] = useState<Specialty[]>([]);
  const [backendSlots, setBackendSlots] = useState<Slot[]>([]);
  const [formData, setFormData] = useState<DoctorFormData>({
    firstName: "",
    lastName: "",
    city: 0,
    address: "",
    specialty: 0,
    fixedPrice: "",
    phoneNumber: "",
    email: "",
    rating: 0,
    isConsultant: false,
    payMethode: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    setFormData((prevData) => {
      let value: string | number | boolean = e.target.value;

      if (field === "rating") {
        value = Number(e.target.value);
      } else if (field === "specialty") {
        value = Number(e.target.value);
      } else if (
        field === "isConsultant" &&
        e.target instanceof HTMLInputElement
      ) {
        value = e.target.checked;
      } else if (field === "fixedPrice") {
        if (!/^\d*$/.test(e.target.value)) {
          setErrorMessage("سعر الحجز يجب أن يكون رقمًا فقط");
          return prevData;
        }
      } else if (field === "payMethode") {
        value = e.target.value;
      }

      return {
        ...prevData,
        [field]: value,
      };
    });
  };

  const validateForm = (): string[] => {
    const missingFields: string[] = [];
    if (!formData.firstName) missingFields.push("الإسم");
    if (!formData.lastName) missingFields.push("اللقب");
    if (!formData.address) missingFields.push("مكان");
    if (!formData.specialty) missingFields.push("التخصص");
    if (!formData.fixedPrice) missingFields.push("سعر الحجز");
    if (!formData.rating) missingFields.push("التقييم");
    if (!formData.phoneNumber) missingFields.push("رقم التليفون");
    if (!formData.payMethode) missingFields.push("طريقة الدفع");
    if (!formData.email) missingFields.push("البريد الإلكتروني");
    return missingFields;
  };

  const handleSlotsChange = (slots: Slot[]) => {
    setBackendSlots(slots);
    console.log("Updated slots:", slots);
  };

  const appointmentDates = backendSlots.map((slot) => {
    return {
      scheduled_date: slot.date,
      start_time: slot.startTime,
      end_time: slot.endTime,
      price: formData.fixedPrice,
    };
  });

  const handleSubmit = async () => {
    const missingFields = validateForm();
  
    if (missingFields.length > 0) {
      setErrorMessage(`الحقول التالية مطلوبة: ${missingFields.join(", ")}`);
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      setErrorMessage(language === "ar" ? "بريد إلكتروني غير صالح" : "Invalid email address");
      return;
    }
  
    try {
      const accessToken = localStorage.getItem("access");
      const url = "https://test-roshita.net/api/doctors/";
  
      // Prepare the request data structure
      const requestData = {
        doctor_phone: formData.phoneNumber || "",
        fixed_price: formData.fixedPrice,
        pay_method: formData.payMethode || "",
        specialty: String(formData.specialty),
        is_consultant: formData.isConsultant,
        staff: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email || "",
          city: formData.city
        },
        data: {
          appointment_dates: appointmentDates.map(appointment => ({
            scheduled_date: appointment.scheduled_date,
            start_time: `${appointment.start_time}:00`,
            end_time: `${appointment.end_time}:00`,
            appointment_status: "pending",
            price: appointment.price
          }))
        }
      };
  
      const formDataObj = new FormData();
      
      // Append all data as JSON string
      formDataObj.append("doctor_phone", requestData.doctor_phone);
      formDataObj.append("fixed_price", requestData.fixed_price);
      formDataObj.append("pay_method", requestData.pay_method);
      formDataObj.append("specialty", requestData.specialty);
      formDataObj.append("is_consultant", String(requestData.is_consultant));
      
      // Append nested objects as JSON strings
      formDataObj.append("staff", JSON.stringify(requestData.staff));
      formDataObj.append("data", JSON.stringify(requestData.data));
  
      // Add image file if exists
      if (formData.Image && typeof formData.Image !== 'string') {
        formDataObj.append("staff_avatar", formData.Image);
      }
  
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`
          // Don't set Content-Type - let browser set it with boundary
        },
        body: formDataObj
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("✅ Doctor registered:", data);
        window.location.href = "/dashboard/doctors";
      } else {
        console.error("❌ Registration failed:", data);
        setErrorMessage(
          language === "ar" 
            ? "فشل التسجيل: " + JSON.stringify(data)
            : "Registration failed: " + JSON.stringify(data)
        );
      }
    } catch (error) {
      console.error("🚨 Error during registration:", error);
      setErrorMessage(
        language === "ar" 
          ? "حدث خطأ أثناء التسجيل" 
          : "Error during registration"
      );
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
          setSpecialties(data);
        } else {
          console.error("Failed to fetch specialties:", data.error);
        }
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };

    fetchSpecialties();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://test-roshita.net/api/cities-list/"
        );
        const data = await response.json();
        if (data) {
          setCities(data);
        } else {
          console.error("Failed to fetch specialties:", data.error);
        }
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };

    fetchCities();
  }, []);

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
            {errorMessage && (
              <div
                className={`text-red-500 bg-red-100 p-4 rounded ${
                  language === "ar" ? "text-end" : "text-start"
                }`}
              >
                {errorMessage}
              </div>
            )}
            <div
              className={`flex flex-col border rounded-lg bg-white shadow-sm max-w-[1280px] mx-auto ${
                language === "ar" ? "rtl" : "ltr"
              }`}
            >
              <h2
                className={`text-lg font-semibold text-gray-700 ${
                  language === "ar" ? "text-end" : "text-start"
                } border-b p-4`}
              >
                {language === "ar" ? "بيانات الشخصية" : "Personal Information"}
              </h2>

              <div
                className={`flex ${
                  language === "ar" ? "flex-row-reverse" : "flex-row"
                } justify-start items-center p-4 gap-4`}
              >
                <UploadButton
                  onUpload={(file) => {
                    setFormData((prevData) => ({ ...prevData, Image: file }));
                    console.log("Uploaded image path:", file);
                  }}
                  picture=""
                />
                <div className="flex flex-col">
                  <h4 className={language === "ar" ? "text-end" : "text-start"}>
                    {language === "ar" ? "الإســــــم" : "First Name"}
                  </h4>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleFieldChange(e, "firstName")}
                    className={
                      language === "ar"
                        ? "text-start border p-2 rounded"
                        : "text-end border p-2 rounded"
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <h4 className={language === "ar" ? "text-end" : "text-start"}>
                    {language === "ar" ? "اللقب" : "Last Name"}
                  </h4>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleFieldChange(e, "lastName")}
                    className={
                      language === "ar"
                        ? "text-start border p-2 rounded"
                        : "text-end border p-2 rounded"
                    }
                  />
                </div>
              </div>

              {language === "ar" && (
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
                          type="email"
                          value={formData.email || ""}
                          onChange={(e) => handleFieldChange(e, "email")}
                          className="text-end border p-2 rounded"
                          placeholder=""
                        />
                      </td>
                      <td className="py-3 px-2 text-gray-500 p-4">البريد الإلكتروني</td>
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
                          value={formData.phoneNumber}
                          onChange={(e) => handleFieldChange(e, "phoneNumber")}
                          className="text-end border p-2 rounded"
                        />
                      </td>
                      <td className="py-3 px-2 text-gray-500 p-4">
                        رقم التليفون
                      </td>
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
                        <select
                          value={formData.city}
                          onChange={(e) => handleFieldChange(e, "city")}
                          className="text-end border p-2 rounded w-[19%]"
                        >
                          <option value={0}>اختر المدينة</option>
                          {cities.map((specialty) => (
                            <option key={specialty.id} value={specialty.id}>
                              {specialty.name} ({specialty.foreign_name})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-2 text-gray-500 p-4">المدينة</td>
                    </tr>
                    <tr className="border-t p-4">
                      <td className="py-3 px-2 text-gray-500 p-4 text-center">
                        <div className="flex justify-center">
                          <MoveRight className="h-4 w-4" />
                        </div>
                      </td>
                      <td className="py-3 px-2 text-gray-700 p-4">
                        <select
                          value={formData.payMethode}
                          onChange={(e) => handleFieldChange(e, "payMethode")}
                          className="text-end border p-2 rounded w-[19%]"
                        >
                          <option value="">اختر طريقة الدفع</option>
                          <option value="cash">الدفع نقدًا (Cash)</option>
                          <option value="online">
                            الدفع عبر الإنترنت (Online Payment)
                          </option>
                        </select>
                      </td>
                      <td className="py-3 px-2 text-gray-500 p-4">
                        طريقة الدفع
                      </td>
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
                          max={5}
                          min={0}
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
              )}
              {language === "en" && (
                <table className={`w-full p-4 text-left`}>
                  <tbody>
                    <tr className="border-t p-4">
                      <td className="py-3 px-2 text-gray-500 p-4">Email</td>
                      <td className="py-3 px-2 text-gray-700 p-4">
                        <input
                          type="email"
                          value={formData.email || ""}
                          onChange={(e) => handleFieldChange(e, "email")}
                          className={`border p-2 rounded text-end`}
                          placeholder="example@domain.com"
                        />
                      </td>
                      <td className="py-3 px-2 text-gray-500 p-4 text-center">
                        <div className="flex justify-center">
                          <MoveRight className="h-4 w-4" />
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t p-4">
                      <td className="py-3 px-2 text-gray-500 p-4">Booking Price</td>
                      <td className="py-3 px-2 text-gray-700 p-4">
                        <input
                          type="text"
                          value={formData.fixedPrice}
                          onChange={(e) => handleFieldChange(e, "fixedPrice")}
                          className={`border p-2 rounded text-end`}
                        />
                      </td>
                      <td className="py-3 px-2 text-gray-500 p-4 text-center">
                        <div className="flex justify-center">
                          <MoveRight className="h-4 w-4" />
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t p-4">
                      <td className="py-3 px-2 text-gray-500 p-4">
                        Phone Number
                      </td>
                      <td className="py-3 px-2 text-gray-700 p-4">
                        <input
                          type="text"
                          value={formData.phoneNumber}
                          onChange={(e) => handleFieldChange(e, "phoneNumber")}
                          className={`border p-2 rounded text-end`}
                        />
                      </td>
                      <td className="py-3 px-2 text-gray-500 p-4 text-center">
                        <div className="flex justify-center">
                          <MoveRight className="h-4 w-4" />
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t p-4">
                      <td className="py-3 px-2 text-gray-500 p-4">Place</td>
                      <td className="py-3 px-2 text-gray-700 p-4">
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleFieldChange(e, "address")}
                          className={`border p-2 rounded text-end"`}
                        />
                      </td>
                      <td className="py-3 px-2 text-gray-500 p-4 text-center">
                        <div className="flex justify-center">
                          <MoveRight className="h-4 w-4" />
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t p-4">
                      <td className="py-3 px-2 text-gray-500 p-4">Specialty</td>
                      <td className="py-3 px-2 text-gray-700 p-4">
                        <select
                          value={formData.specialty}
                          onChange={(e) => handleFieldChange(e, "specialty")}
                          className={`border p-2 rounded w-[19%] text-end`}
                        >
                          <option value={0}>Select Specialty</option>
                          {specialties.map((specialty) => (
                            <option key={specialty.id} value={specialty.id}>
                              {specialty.foreign_name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-2 text-gray-500 p-4 text-center">
                        <div className="flex justify-center">
                          <MoveRight className="h-4 w-4" />
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t p-4">
                      <td className="py-3 px-2 text-gray-500 p-4">City</td>
                      <td className="py-3 px-2 text-gray-700 p-4">
                        <select
                          value={formData.city}
                          onChange={(e) => handleFieldChange(e, "city")}
                          className={`border p-2 rounded w-[19%] text-end`}
                        >
                          <option value={0}>Select City</option>
                          {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.foreign_name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-2 text-gray-500 p-4 text-center">
                        <div className="flex justify-center">
                          <MoveRight className="h-4 w-4" />
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t p-4">
                      <td className="py-3 px-2 text-gray-500 p-4">Rating</td>
                      <td className="py-3 px-2 text-gray-700 p-4">
                        <input
                          type="number"
                          value={formData.rating}
                          onChange={(e) => handleFieldChange(e, "rating")}
                          className={`border p-2 rounded text-end`}
                          max={5}
                          min={0}
                        />
                      </td>
                      <td className="py-3 px-2 text-gray-500 p-4 text-center">
                        <div className="flex justify-center">
                          <MoveRight className="h-4 w-4" />
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t p-4">
                      <td className="py-3 px-2 text-gray-500 p-4">
                        Consultant
                      </td>
                      <td className="py-3 px-2 text-gray-700 p-4">
                        <input
                          type="checkbox"
                          checked={formData.isConsultant}
                          onChange={(e) => handleFieldChange(e, "isConsultant")}
                          className="text-end border p-2 rounded"
                        />
                      </td>
                      <td className="py-3 px-2 text-gray-500 p-4 text-center">
                        <div className="flex justify-center">
                          <MoveRight className="h-4 w-4" />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>

            <DoctorSlots onSlotsChange={handleSlotsChange} />

            <Button
              variant="register"
              className="rounded-2xl h-[52px] w-[140px]"
              onClick={handleSubmit}
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