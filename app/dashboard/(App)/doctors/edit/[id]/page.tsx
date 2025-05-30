"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumb from "@/components/layout/app-breadcrumb";
import DoctorSlots from "@/components/layout/doctor-slot";
import InformationCard from "@/components/shared/InformationCardProps";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Table, TableCell, TableRow } from "@/components/ui/table";
import { DoctorData } from "@/constant";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { specialities } from "../../../../../../constant/index";
import LoadingDoctors from "@/components/layout/LoadingDoctors";
import { logAction } from "@/lib/logger";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Appointment = {
  id: number;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  appointment_status: string;
  price: string;
};

interface User {
  phone: string;
}
interface Doctor {
  id: string;
  staff: {
    first_name: string;
    last_name: string;
    city: { id: string; name: string; foreign_name: string };
    medical_organization: {
      name: string;
      city: { id: string; foreign_name: string };
      phone: string;
    }[];
    staff_avatar: string;
    rating: GLfloat;
    is_consultant: boolean;
    specialty: number;
  };
  specialty: Specialty[];
  fixed_price: string;
  user: User;
  appointments: Appointment[];
}

interface City {
  id: number;
  foreign_name: string;
  name: string;
}

interface Specialty {
  id: number;
  name: string;
  foreign_name: string;
}

interface Specialities {
  specialities: Specialty[];
}

type Language = "ar" | "en";

type Params = {
  id: string;
};

type Slot = {
  date: string;
  startTime: string;
  endTime: string;
  backendFormat: string;
  appointment_status: string;
};

const translations = {
  en: {
    title: "Doctor Availability Slots",
    selectDate: "Select Date",
    startTime: "Start Time",
    endTime: "End Time",
    duration: "Duration (Hours)",
    addSlot: "Add Slot",
    currentSlots: "Current Slots",
    noSlots: "No slots added yet.",
    remove: "Cancel",
    durationError: "Duration is greater than the available time range.",
    date: "Date",
    action: "Action",
    roshitaBook: "Book",
    status: "Status",
    previous: "Previous",
    next: "Next",
    changePassword: "Change Password",
    oldPassword: "Old Password",
    newPassword: "New Password",
    submit: "Submit",
    passwordChanged: "Password changed successfully",
    passwordError: "Error changing password"
  },
  ar: {
    title: "مواعيد توفر الطبيب",
    selectDate: "اختر التاريخ",
    startTime: "وقت البدء",
    endTime: "وقت الانتهاء",
    duration: "المدة (بالساعات)",
    addSlot: "إضافة موعد",
    currentSlots: "المواعيد الحالية",
    noSlots: "لم تتم إضافة أي مواعيد بعد.",
    remove: "إلغاء",
    durationError: "المدة أكبر من نطاق الوقت المتاح.",
    date: "التاريخ",
    action: "إجراء",
    roshitaBook: "حجز ",
    status: "الحالة",
    previous: "السابق",
    next: "التالي",
    changePassword: "تغيير كلمة المرور",
    oldPassword: "كلمة المرور القديمة",
    newPassword: "كلمة المرور الجديدة",
    submit: "تأكيد",
    passwordChanged: "تم تغيير كلمة المرور بنجاح",
    passwordError: "خطأ في تغيير كلمة المرور"
  },
};

export default function Page() {
  const params = useParams<Params>();
  const id = params?.id;
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [specialtyName, setSpecialtyName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [specialities, setSpecialities] = useState<Specialities | null>(null);
  const [language, setLanguage] = useState<Language>("ar");
  const [formData, setFormData] = useState<{ Image?: File }>({});
  const [image, setImage] = useState("");
  const [backendSlots, setBackendSlots] = useState<Slot[]>([]);
  const [selectedSpecialityId, setSelectedSpecialityId] = useState<
    number | null
  >(null);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<Appointment | null>(
    null
  );
  const [patientDetails, setPatientDetails] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: ""
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const appointmentsPerPage = 5;

  const handleSlotsChange = (slots: Slot[]) => {
    setBackendSlots(slots);
  };

  const t = translations[language];

  // Pagination logic
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments =
    doctor?.appointments?.slice(
      indexOfFirstAppointment,
      indexOfLastAppointment
    ) || [];
  const totalPages = Math.ceil(
    (doctor?.appointments?.length || 0) / appointmentsPerPage
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleRemoveSlot = async (index: number, id: number) => {
    if (doctor && doctor.appointments) {
      if (!index) {
        console.error("Appointment ID not found");
        return;
      }

      try {
        const token = localStorage.getItem("access");
        if (!token) {
          console.error("Access token not found in localStorage");
          return;
        }

        const response = await fetch(
          `https://test-roshita.net/api/appointment-reservations/${id}/`,
          {
            method: "DELETE",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
              "X-CSRFToken":
                "9htdjDGAaHSm5TKSyU7DoBSxj4PlVCSYt2yA1iOmGLIu2JXABwbrTe3rgvbCnG2U",
            },
          }
        );

        if (response.ok) {
          await logAction(
            token,
            `https://test-roshita.net/api/appointment-reservations/${index}/`,
            { appointmentId: index },
            "success",
            response.status
          );

          if (doctor && doctor.appointments) {
            const updatedAppointments = doctor.appointments.filter(
              (_, idx) => idx !== index
            );
            setDoctor((prevDoctor) => {
              return prevDoctor
                ? {
                    ...prevDoctor,
                    appointments: updatedAppointments,
                  }
                : null;
            });
          }
        } else {
          console.error("Failed to delete appointment", response.statusText);
          const errorData = await response.json();
          await logAction(
            token,
            `https://test-roshita.net/api/appointment-reservations/${index}/`,
            { appointmentId: index },
            "error",
            response.status,
            errorData.message || "Failed to delete appointment"
          );
        }
      } catch (error) {
        console.error("Error deleting appointment:", error);
        const token = localStorage.getItem("access");
        if (token) {
          await logAction(
            token,
            `https://test-roshita.net/api/appointment-reservations/${index}/`,
            { appointmentId: index },
            "error",
            error instanceof Error ? 500 : 500,
            error instanceof Error ? error.message : "An unknown error occurred"
          );
        }
      }
    }
  };

  const handleBooked = (index: number) => {
    if (doctor && doctor.appointments) {
      const selectedAppointment = doctor.appointments[index];
      setBookingDetails(selectedAppointment);
      setPopupVisible(true);
    }
  };

  const handleBookingSubmit = async () => {
    const payload = {
      reservation: {
        patient: patientDetails,
        reservation_date: bookingDetails?.scheduled_date,
        start_time: bookingDetails?.start_time,
        end_time: bookingDetails?.end_time,
      },
      confirmation_code: "12345",
      doctor_id: id,
      doctor: {
        id: id,
        name: doctor?.staff.first_name + " " + doctor?.staff.last_name,
      },
      price: bookingDetails?.price,
    };

    const token = localStorage.getItem("access");

    try {
      const response = await fetch(
        "https://test-roshita.net/api/appointment-reservations/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "X-CSRFToken":
              "rquDldN5xzfxmgsqkc9SyFHxXhrzOvrkLbz03SVR3D5Fj6F8nOdG3iSrUINQgzBg",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setPopupVisible(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Booking failed. Please try again.");
    }
  };

  const appointmentDates = backendSlots.map((slot) => {
    return {
      scheduled_date: slot.date,
      start_time: slot.startTime,
      end_time: slot.endTime,
      appointment_status: "pending",
      price: doctor?.fixed_price,
    };
  });

  const handleFileUpload = (file: File | null) => {
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImage("/Images/default-doctor.jpeg");
    }
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
      label: language === "ar" ? "الأطباء" : "Doctors",
      href: "/dashboard/doctors",
    },
    { label: language === "ar" ? "تعديل" : "Edit", href: "#" },
  ];

  useEffect(() => {
    const fetchDoctorAndSpecialty = async () => {
      const accessToken =
        typeof window !== "undefined" ? localStorage.getItem("access") : null;
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

    const fetchSpecialities = async () => {
      try {
        const response = await fetch(
          "https://test-roshita.net/api/specialty-list/"
        );
        const data: Specialities = await response.json();

        if (response.ok) {
          setSpecialities(data);
        } else {
          console.error("Error fetching cities");
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchDoctorAndSpecialty();
    fetchCities();
    fetchSpecialities();
  }, [id]);

  const handleCityChange = (cityNameOrForeignName: string) => {
    const matchingCity = cities?.find(
      (city) =>
        city.name === cityNameOrForeignName ||
        city.foreign_name === cityNameOrForeignName
    );

    if (!matchingCity) {
      console.log("No matching city found for:", cityNameOrForeignName);
      return;
    }

    const cityId = matchingCity.id;
    setSelectedCityId(cityId);
    
    //@ts-ignore
    setDoctor((prev) => {
      if (!prev) return prev;

      const updatedDoctor = {
        ...prev,
        staff: {
          ...prev.staff,
          city: {
            ...prev.staff.city,
            id: cityId
          }
        }
      };

      return updatedDoctor;
    });
  };

  const handleSpecialityChange = (specialityNameOrForeignName: string) => {
    //@ts-ignore
    const matchingSpeciality = specialities?.find(
      //@ts-ignore
      (speciality) =>
        speciality.name === specialityNameOrForeignName ||
        speciality.foreign_name === specialityNameOrForeignName
    );

    if (!matchingSpeciality) {
      console.log(
        "No matching specialty found for:",
        specialityNameOrForeignName
      );
      return;
    }

    const specialityId = matchingSpeciality.id;
    setSelectedSpecialityId(specialityId);
    //@ts-ignore
    setDoctor((prev) => {
      if (!prev) return prev;

      const updatedDoctor = {
        ...prev,
        specialty: prev.specialty
          ? {
              ...prev.specialty,
              id: specialityId,
            }
          : null,
      };

      return updatedDoctor;
    });
  };

  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    try {
      const token = localStorage.getItem("access");
      if (!token) {
        setPasswordError("Not authenticated");
        return;
      }

      const response = await fetch("https://test-roshita.net/api/account/change-password/", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-CSRFToken": "lMS62bmnKdLW0duxsaqH2O3HFrWSgQnOHbVxc6nV7QwY5ZqdgyFCxuxRkX2wHq42"
        },
        body: JSON.stringify(passwordData)
      });

      if (response.ok) {
        setPasswordSuccess(true);
        setPasswordData({ old_password: "", new_password: "" });
      } else {
        const error = await response.json();
        setPasswordError(error.message || "Failed to change password");
      }
    } catch (error) {
      setPasswordError("An error occurred while changing password");
      console.error("Password change error:", error);
    }
  };

  const handleUpdateDoctor = async () => {
    if (!doctor) return;
    
    setIsUpdating(true);

    console.log("inside selectedCityId", selectedCityId)
  
    // Prepare the complete data object in the desired structure
    const requestData = {
      fixed_price: parseFloat(doctor.fixed_price) || 0,
      //@ts-ignore
      rating: parseFloat(doctor.rating) || 0.0,
      //@ts-ignore
      is_consultant: doctor.is_consultant || false,
      //@ts-ignore
      specialty: doctor.specialty.id,
      staff: {
        last_name: doctor.staff.last_name,
        //@ts-ignore
        email: doctor.staff.email || 'doctor@example.com',
        city: selectedCityId || doctor.staff.city.id
      },
      data: {
        appointment_dates: backendSlots.map(slot => ({
          scheduled_date: slot.date,
          start_time: slot.startTime,
          end_time: slot.endTime,
          price: parseFloat(doctor?.fixed_price) || 150.0,
          //@ts-ignore
          notes: slot.notes || ''
        }))
      }
    };
  
    // Create FormData object
    const formData = new FormData();
    
    // Append all fields except the file
    formData.append('fixed_price', requestData.fixed_price.toString());
    formData.append('rating', requestData.rating.toString());
    formData.append('is_consultant', requestData.is_consultant.toString());
    formData.append('specialty', requestData.specialty.toString());
    // Append staff data as JSON string
    formData.append('staff', JSON.stringify(requestData.staff));
    formData.append('city', requestData.staff.city.toString());
    // Append appointment data as JSON string
    formData.append('data', JSON.stringify(requestData.data));
    
    // Append image file if available
    if (imageFile) {
      formData.append('staff_avatar', imageFile, imageFile.name || 'doctor-image.jpg');
    }
  
    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem('access') || '';
  
      // Make the API request
      const response = await fetch(
        `https://test-roshita.net/api/doctors/${doctor.id}/`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // No Content-Type header as it's set automatically with FormData
          },
          body: formData,
        }
      );
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Doctor updated successfully:', result);
        window.location.reload();
      } else {
        console.error('Error updating doctor:', result);
        setError(result.message || 'Error updating doctor information');
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
      setError('An error occurred while updating doctor information');
    } finally {
      setIsUpdating(false);
    }
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
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
              <button 
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setError(null)}
              >
                <span className="sr-only">Close</span>
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <title>Close</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
              </button>
            </div>
          )}
          <div className="p-8 space-y-8">
            {popupVisible && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 h-screen">
                <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-lg">
                  <h3
                    className={`text-lg font-bold mb-4 ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {language === "ar" ? "احجز موعدك" : "Book Your Appointment"}
                  </h3>
                  <form
                    className={`space-y-4 ${
                      language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    <input
                      type="text"
                      placeholder={
                        language === "ar" ? "الاسم الأول" : "First Name"
                      }
                      value={patientDetails.first_name}
                      onChange={(e) =>
                        setPatientDetails({
                          ...patientDetails,
                          first_name: e.target.value,
                        })
                      }
                      className={`w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder={
                        language === "ar" ? "اسم العائلة" : "Last Name"
                      }
                      value={patientDetails.last_name}
                      onChange={(e) =>
                        setPatientDetails({
                          ...patientDetails,
                          last_name: e.target.value,
                        })
                      }
                      className={`w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    />
                    <input
                      type="text"
                      disabled
                      placeholder={language === "ar" ? "رقم الهاتف" : "Phone"}
                      value={patientDetails.phone}
                      onChange={(e) =>
                        setPatientDetails({
                          ...patientDetails,
                          phone: e.target.value,
                        })

                      }
                      className={`w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    />
                    <input
                      type="email"
                      
                      placeholder={
                        language === "ar" ? "البريد الإلكتروني" : "Email"
                      }
                      value={patientDetails.email}
                      onChange={(e) =>
                        setPatientDetails({
                          ...patientDetails,
                          email: e.target.value,
                        })
                      }
                      className={`w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    />
                    <div className="w-full">
                      <select
                        value={patientDetails.city}
                        onChange={(e) =>
                          setPatientDetails({
                            ...patientDetails,
                            city: e.target.value,
                          })
                        }
                        className={`w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          language === "ar" ? "text-right" : "text-left"
                        }`}
                      >
                        <option value="" disabled>
                          {language === "ar" ? "اختر المدينة" : "Select a city"}
                        </option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city[language === "ar" ? "name" : "foreign_name"]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder={language === "ar" ? "العنوان" : "Address"}
                      value={patientDetails.address}
                      onChange={(e) =>
                        setPatientDetails({
                          ...patientDetails,
                          address: e.target.value,
                        })
                      }
                      className={`w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    />
                    <div
                      className={`flex ${
                        language === "ar"
                          ? "space-x-reverse gap-2 pace-x-4"
                          : "space-x-4"
                      } justify-between`}
                    >
                      <button
                        type="button"
                        onClick={handleBookingSubmit}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        {language === "ar" ? "احجز الآن" : "Book Now"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPopupVisible(false)}
                        className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                      >
                        {language === "ar" ? "إلغاء" : "Cancel"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            <InformationCard
              title={
                language === "ar" ? "بيانات الشخصية" : "Personal Information"
              }
              name={
                doctor?.staff.first_name ||
                (language === "ar" ? "غير محدد" : "Not specified")
              }
              lastName={
                doctor?.staff.last_name ||
                (language === "ar" ? "غير محدد" : "Not specified")
              }
              fields={[
                {
                  label: language === "ar" ? "رقم الهاتف" : "Phone Number",
                  value: doctor?.user.phone || "",
                },
                {
                  label: language === "ar" ? "مكان" : "Location",
                  value: doctor?.staff.city.name || "",
                  isDropdown: true,
                },
                {
                  label: language === "ar" ? "التخصص" : "Specialty",
                  //@ts-ignore
                  value: doctor?.specialty.name || "",
                  isDropdown: true,
                },
                {
                  label: language === "ar" ? "سعر الحجز" : "Booking Price",
                  value: `${doctor?.fixed_price ? `${doctor.fixed_price}` : (language === "ar" ? "غير محدد" : "Not specified")}`,
                },
              ]}
              picture={
                doctor?.staff.staff_avatar
                  ? doctor.staff.staff_avatar.replace("https://", "http://")
                  : "/Images/default-doctor.jpg"
              }
              //@ts-ignore
              photoUploadHandler={handleFileUpload}
              onNameChange={(name) =>
                setDoctor(
                  (prev) =>
                    prev && {
                      ...prev,
                      staff: { ...prev.staff, first_name: name },
                    }
                )
              }
              onLastNameChange={(name) =>
                setDoctor(
                  (prev) =>
                    prev && {
                      ...prev,
                      staff: { ...prev.staff, last_name: name },
                    }
                )
              }
              onFieldChange={(index, value) => {
                if (index === 0) {
                  setDoctor(
                    (prev) =>
                      prev && {
                        ...prev,
                        user: { ...prev.user, phone: value },
                      }
                  );
                }
                if (index === 1) {
                  setDoctor((prev) => {
                    if (!prev) return prev;

                    return {
                      ...prev,
                      staff: {
                        ...prev.staff,
                        city:
                          typeof prev.staff.city === "object"
                            ? {
                                id: prev.staff.city.id,
                                name: value,
                                foreign_name: prev.staff.city.foreign_name,
                              }
                            : prev.staff.city,
                      },
                    };
                  });
                }
                if (index === 2) {
                  setDoctor((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      specialty:
                        prev.specialty && typeof prev.specialty === "object"
                          ? {
                              ...prev.specialty,
                              name: value,
                            }
                          : prev.specialty,
                    };
                  });
                }
                if (index === 3) {
                  setDoctor((prev) => prev && { ...prev, fixed_price: value });
                }
              }}
              cities={cities}
              onCityChange={handleCityChange}
              //@ts-ignore
              specialities={specialities}
              onSpecialityChange={handleSpecialityChange}
            />

            <Table className="w-full border  !rounded-2xl">
              <thead>
                <TableRow>
                  {language === "ar" ? (
                    <>
                      <TableCell className="font-bold text-gray-700 text-center">
                        {t.action}
                      </TableCell>
                      <TableCell className="font-bold text-gray-700 text-center">
                        {t.status}
                      </TableCell>
                      <TableCell className="font-bold text-gray-700 text-center">
                        {t.endTime}
                      </TableCell>
                      <TableCell className="font-bold text-gray-700 text-center">
                        {t.startTime}
                      </TableCell>
                      <TableCell className="font-bold text-gray-700 text-center">
                        {t.date}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-bold text-gray-700 text-center">
                        {t.date}
                      </TableCell>
                      <TableCell className="font-bold text-gray-700 text-center">
                        {t.startTime}
                      </TableCell>
                      <TableCell className="font-bold text-gray-700 text-center">
                        {t.endTime}
                      </TableCell>
                      <TableCell className="font-bold text-gray-700 text-center">
                        {t.status}
                      </TableCell>
                      <TableCell className="font-bold text-gray-700 text-center">
                        {t.action}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              </thead>
              <tbody>
                {currentAppointments.length > 0 ? (
                  currentAppointments.map((slot, index) => (
                    <TableRow key={index}>
                      {language === "ar" ? (
                        <>
                          <TableCell className="text-center">
                            {slot.appointment_status !== "available" && slot.appointment_status !== "reserved" &&(
                              <Button
                                variant="destructive"
                                onClick={() => handleRemoveSlot(index, slot.id)}
                                className="text-white hover:text-red-800"
                              >
                                {t.remove}
                              </Button>
                            )}
                            {slot.appointment_status !== "reserved" && (
                              <Button
                                onClick={() => handleBooked(index)}
                                className="text-white bg-[#1685c7] ml-2"
                              >
                                {t.roshitaBook}
                              </Button>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {slot.appointment_status === "reserved" ? "محجوز" : "متاح"}
                          </TableCell>
                          <TableCell className="text-center">
                            {slot.end_time}
                          </TableCell>
                          <TableCell className="text-center">
                            {slot.start_time}
                          </TableCell>
                          <TableCell className="text-center">
                            {slot.scheduled_date}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="text-center">
                            {slot.scheduled_date}
                          </TableCell>
                          <TableCell className="text-center">
                            {slot.start_time}
                          </TableCell>
                          <TableCell className="text-center">
                            {slot.end_time}
                          </TableCell>
                          <TableCell className="text-center">
                            {slot.appointment_status === "reserved" ? "Reserved" : "Available"}
                          </TableCell>
                          <TableCell className="text-center gap-2">
                            {slot.appointment_status !== "available" && slot.appointment_status !== "reserved" && (
                              <Button
                                variant="destructive"
                                onClick={() => handleRemoveSlot(index, slot.id)}
                                className="text-white hover:text-red-800"
                              >
                                {t.remove}
                              </Button>
                            )}
                            {slot.appointment_status !== "reserved" && (
                              <Button
                                onClick={() => handleBooked(index)}
                                className="text-white bg-[#1685c7] ml-2"
                              >
                                {t.roshitaBook}
                              </Button>
                            )}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-gray-500"
                    >
                      {language === "ar"
                        ? "لا توجد مواعيد متاحة"
                        : "No appointments available."}
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </Table>

          {/* Pagination controls */}
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          //@ts-ignore
                  disabled={currentPage === 1}
                />
              </PaginationItem>

              {/* Always show first page */}
              <PaginationItem>
                <PaginationLink
                  onClick={() => paginate(1)}
                  isActive={currentPage === 1}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {/* Show ellipsis if current page is far from start */}
              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Show current page and neighbors */}
              {currentPage > 2 && currentPage !== totalPages && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => paginate(currentPage - 1)}
                  >
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}
              {currentPage !== 1 && currentPage !== totalPages && (
                <PaginationItem>
                  <PaginationLink
                    isActive
                    onClick={() => paginate(currentPage)}
                  >
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>
              )}
              {currentPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => paginate(currentPage + 1)}
                  >
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Show ellipsis if current page is far from end */}
              {currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Always show last page if there's more than one page */}
              {totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => paginate(totalPages)}
                    isActive={currentPage === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  //@ts-ignore
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

            <DoctorSlots onSlotsChange={handleSlotsChange} />

            <Button
              variant="register"
              className="rounded-2xl h-[52px] w-[140px]"
              onClick={handleUpdateDoctor}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {language === "ar" ? "جاري التحديث..." : "Updating..."}
                </div>
              ) : (
                language === "ar" ? "حفظ" : "Save"
              )}
            </Button>
            {typeof window !== "undefined" && localStorage.getItem("userRole") === "Doctor" && (
              <div className="p-4 md:p-0 space-y-6 md:space-y-8" dir={language === "ar" ? "rtl" : "ltr"}>
                <div className="bg-white rounded-lg p-4 md:p-2">
                  <h2 className={`text-lg font-semibold text-gray-700 border-b p-4`}>
                    {t.changePassword}
                  </h2>
                  <form onSubmit={handlePasswordChange} className="space-y-4 mt-6">
                    <div>
                      <label className="block text-sm font-medium mb-4">{t.oldPassword}</label>
                      <input
                        type="password"
                        value={passwordData.old_password}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, old_password: e.target.value }))}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-4">{t.newPassword}</label>
                      <input
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    {passwordError && (
                      <div className="text-red-500 text-sm">{passwordError}</div>
                    )}
                    {passwordSuccess && (
                      <div className="text-green-500 text-sm">{t.passwordChanged}</div>
                    )}
                    <div className="flex justify-start rtl:justify-end">
                      <Button
                        type="submit"
                        variant="register"
                        className="rounded-2xl h-[52px] w-[140px]"
                      >
                        {t.submit}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
