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

type Appointment = {
  scheduled_date: string;
  start_time: string;
  end_time: string;
  appointment_status: string;
  //price: string;
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

/**
 * This is the `Page` component which represents the doctor information editing page.
 * It allows users to view and update personal information about a doctor, such as their name, phone number, location, and booking price.
 * 
 * Features:
 * - Displays doctor's personal information retrieved from the API (name, phone number, location, and booking price).
 * - Allows users to update the doctor's profile picture by uploading an image.
 * - Provides functionality to edit the doctor's phone number, location (city), and booking price.
 * - Supports language switching between Arabic and English. The language preference is stored in `localStorage` and is applied across the page.
 * - Handles updating the doctor's information by sending the modified data to the API.
 * - The form includes a breadcrumb navigation for easy navigation back to the doctor's list and home page.
 * - Uses a sidebar for additional navigation options.
 * 
 * States:
 * - `doctor`: Holds the data of the doctor being edited (or null if no doctor is selected).
 * - `specialtyName`: Stores the specialty name of the doctor, fetched from a separate API.
 * - `loading`: Boolean state that controls loading indicators while fetching doctor data.
 * - `error`: Stores error messages related to fetching doctor or specialty data.
 * - `cities`: Stores a list of cities available for the doctor's location.
 * - `language`: Tracks the current language of the page (either "ar" for Arabic or "en" for English).
 * - `formData`: Stores form data for photo upload.
 * - `image`: Stores the updated profile image path.

 * Effects:
 * - On mount, the component fetches doctor details, specialty data, and available cities.
 * - Language preference is loaded from `localStorage` and updates dynamically if changed.
 * 
 * Handlers:
 * - `handleFileUpload`: Handles the file upload for the profile picture.
 * - `handleCityChange`: Updates the doctor's city information when a new city is selected.
 * - `handleUpdateDoctor`: Sends the updated doctor data to the server for saving.

 * The component uses various custom components:
 * - `Breadcrumb`: Displays the navigation breadcrumb for the page.
 * - `InformationCard`: Displays the doctor's personal information and provides editable fields.
 * - `SidebarTrigger`, `SidebarProvider`, `SidebarInset`: Manages the sidebar functionality.
 * - `Button`: Represents the save button to submit the updated doctor information.

 * Error handling is included for fetching data and updating the doctor details, with appropriate error messages displayed.
 */

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
  },
};

export default function Page() {
  const params = useParams<Params>();
  const id = params?.id;
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [specialtyName, setSpecialtyName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<City[]>([]); // State for cities
  const [specialities, setSpecialities] = useState<Specialities | null>(null); // Allow null if no data
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

  const handleSlotsChange = (slots: Slot[]) => {
    setBackendSlots(slots);
    console.log("Updated slots:", slots);
  };

  console.log("patientDetails", patientDetails);

  const t = translations[language];

  /*const handleRemoveSlot = (index: number) => {
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
  };*/

    const handleRemoveSlot = async ( index: number, id:number) => {
      console.log("index: ", index);
      if (doctor && doctor.appointments) {
        if (!index) {
          console.error("Appointment ID not found");
          return;
        }
    
        try {
          // Get the Bearer token from localStorage
          const token = localStorage.getItem("access");
          if (!token) {
            console.error("Access token not found in localStorage");
            return;
          }
    
          // Send the DELETE request
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
            console.log("Appointment deleted successfully");
    
            // Log the action as a success
            await logAction(
              token,
              `https://test-roshita.net/api/appointment-reservations/${index}/`,
              { appointmentId: index },
              "success",
              response.status // HTTP status code (e.g., 200)
            );
    
            // Update the appointments locally
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
            //window.location.reload();
          } else {
            console.error("Failed to delete appointment", response.statusText);
    
            // Log the action as an error
            const errorData = await response.json(); // Parse the error response
            await logAction(
              token,
              `https://test-roshita.net/api/appointment-reservations/${index}/`,
              { appointmentId: index },
              "error",
              response.status, // HTTP status code (e.g., 400, 500)
              errorData.message || "Failed to delete appointment" // Error message
            );
          }
        } catch (error) {
          console.error("Error deleting appointment:", error);
    
          // Log the action as an error
          const token = localStorage.getItem("access");
          if (token) {
            await logAction(
              token,
              `https://test-roshita.net/api/appointment-reservations/${index}/`,
              { appointmentId: index },
              "error",
              /* @ts-ignore */
              error.response?.status || 500, // Use the error status code or default to 500
              /* @ts-ignore */
              error.message || "An unknown error occurred" // Error message
            );
          }
        }
      }
    };

  console.log("specialities", specialities);
  const handleBooked = (index: number) => {
    console.log("index", index);
    if (doctor && doctor.appointments) {
      console.log("entered doctors");
      const selectedAppointment = doctor.appointments[index];
      setBookingDetails(selectedAppointment);
      setPopupVisible(true);
    }
  };

  const handleBookingSubmit = async () => {
    const payload = {
      reservation: {
        patient: patientDetails,
        //reservation_status: "pending payment",
        reservation_date: bookingDetails?.scheduled_date,
        start_time: bookingDetails?.start_time,
        end_time: bookingDetails?.end_time

      },
      confirmation_code: "12345", // Replace or generate dynamically
      doctor_id: id,
      doctor: {
        id: id,
        name: doctor?.staff.first_name + " " + doctor?.staff.last_name
      },
      // @ts-ignore
      price: bookingDetails?.price, // Adjust as needed
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
      scheduled_date: slot.date, // Date in YYYY-MM-DD format
      start_time: slot.startTime, // Start time in HH:mm format
      end_time: slot.endTime, // End time in HH:mm format
      appointment_status: "pending",
      price: doctor?.fixed_price,
    };
  });

  const handleFileUpload = (file: File | null) => {
    if (file) {
      setImageFile(file); // Store the File object
      setImage(URL.createObjectURL(file)); // Set the image preview URL
    } else {
      setImageFile(null); // Clear the File object
      setImage("/Images/default-doctor.jpeg"); // Reset to the default image
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
          setSpecialities(data); // Now setSpecialities accepts Specialities
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

  // Handle city change here
  const handleCityChange = (cityNameOrForeignName: string) => {
    console.log("City selected:", cityNameOrForeignName);

    // Find the matching city in the cities list based on name or foreign_name
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
    console.log("Matched city ID:", cityId);

    // Set the selected city ID in state
    setSelectedCityId(cityId);

    // Update the doctor state
    // @ts-ignore
    setDoctor((prev) => {
      if (!prev || !prev.staff?.medical_organization) {
        console.log("Doctor state or medical organization not defined.");
        return prev;
      }

      const updatedDoctor = {
        ...prev,
        staff: {
          ...prev.staff,
          medical_organization: prev.staff.medical_organization.map(
            (org, index) =>
              index === 0 // Assuming we're updating the first organization's city
                ? {
                    ...org,
                    city: {
                      ...org.city,
                      id: cityId, // Update city ID
                    },
                  }
                : org
          ),
        },
      };

      console.log("Updated doctor state in setDoctor:", updatedDoctor);
      return updatedDoctor;
    });

    console.log("Updated doctor state after city change:", doctor);
  };

  const handleSpecialityChange = (specialityNameOrForeignName: string) => {
    // Find the matching specialty in the specialties list based on name or foreign_name
    // @ts-ignore
    const matchingSpeciality = specialities?.find(
      // @ts-ignore
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

    // Set the selected specialty ID in state
    setSelectedSpecialityId(specialityId);

    // Update the doctor state
    // @ts-ignore
    setDoctor((prev) => {
      if (!prev) return prev;

      const updatedDoctor = {
        ...prev,
        specialty: prev.specialty
          ? {
              ...prev.specialty,
              id: specialityId, // Update specialty ID
            }
          : null, // Handle the case where specialty is not defined
      };

      return updatedDoctor;
    });

  };

  const handleUpdateDoctor = async () => {
    if (!doctor) return;

    // Filter out old and new appointments
    const updatedAppointments =
      doctor.appointments?.filter((existingAppointment) => {
        return !appointmentDates.some(
          (newAppointment) =>
            newAppointment.scheduled_date ===
              existingAppointment.scheduled_date &&
            newAppointment.start_time === existingAppointment.start_time &&
            newAppointment.appointment_status ===
              existingAppointment.appointment_status
        );
      }) || [];

    const newAppointments = appointmentDates.filter((newAppointment) => {
      return !doctor.appointments?.some(
        (existingAppointment) =>
          existingAppointment.scheduled_date ===
            newAppointment.scheduled_date &&
          existingAppointment.start_time === newAppointment.start_time &&
          existingAppointment.appointment_status ===
            newAppointment.appointment_status
      );
    });

    // Create the `data` object for appointment dates
    const data = {
      appointment_dates: [
        ...updatedAppointments.map((appointment) => ({
          scheduled_date: appointment.scheduled_date,
          start_time: appointment.start_time,
          end_time: appointment.end_time,
          appointment_status: appointment.appointment_status,
          //@ts-ignore
          price: appointment.price,
        })),
        ...newAppointments.map((appointment) => ({
          scheduled_date: appointment.scheduled_date,
          start_time: appointment.start_time,
          end_time: appointment.end_time,
          appointment_status: appointment.appointment_status,
          price: appointment.price,
        })),
      ],
    };

    // Create the `staff` object for staff information
    const staff = {
      first_name: doctor.staff.first_name,
      last_name: doctor.staff.last_name,
      //@ts-ignore
      email: doctor.staff.email,
      city: doctor.staff.city.id, // Include city ID
    };

    // Log the data and staff objects
    console.log("Data:", JSON.stringify(data));
    console.log("Staff:", JSON.stringify(staff));

    // Create FormData object
    const formData = new FormData();

    // Append the `data` object as a JSON string
    formData.append("data", JSON.stringify(data));

    // Append the `staff` object as a JSON string
    formData.append("staff", JSON.stringify(staff));

    // Add the image file to FormData if it exists
    //@ts-ignore
    if (imageFile) {
      //@ts-ignore
      formData.append("staff_avatar", imageFile); // Append the file directly if it exists
      //@ts-ignore
      console.log("Image file being sent:", imageFile);
    }

    // Log the FormData content
    formData.forEach((value, key) => {
      console.log("FormData -", key, value);
    });

    try {
      const accessToken = localStorage.getItem("access");

      // Send the request to the backend
      const response = await fetch(
        `https://test-roshita.net/api/doctors/${doctor.id}/`,
        {
          method: "PUT", // Use PUT for updating
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData, // Send FormData
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Handle success
        console.log("Doctor updated successfully:", result);
       //window.location.reload() Reload the page or update the state as needed
      } else {
        // Handle error
        console.error("Error updating doctor:", result);
        setError(result.message || "Error updating doctor information");
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
      setError("An error occurred while updating doctor information");
    }
  };

  return loading ? (
    <div className="flex items-center justify-center min-h-screen mx-auto">
      <LoadingDoctors />
    </div>
  ) :(
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
                            city: e.target.value, // Store city ID here
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
                doctor?.staff.first_name +
                  " " +
                  (doctor?.staff.last_name ?? "") ||
                (language === "ar" ? "غير محدد" : "Not specified")
              }
              fields={[
                {
                  label: language === "ar" ? "رقم الهاتف" : "Phone Number",
                  value: `${
                    (doctor?.user.phone ?? "") ||
                    (language === "ar" ? "غير محدد" : "Not specified")
                  }`,
                },
                {
                  label: language === "ar" ? "مكان" : "Location",
                  value: `${
                    // @ts-ignore
                    (language === "ar"
                      ? // @ts-ignore
                      doctor?.staff?.city.name
                      : // @ts-ignore
                      doctor?.staff?.city.foreign_name) ??
                    (language === "ar" ? "غير محدد" : "Not specified")
                  }`,
                  isDropdown: true,
                },
                {
                  label: language === "ar" ? "التخصص" : "specialty",
                  value: `${
                    // @ts-ignore
                    (language === "ar"
                      ? // @ts-ignore
                        doctor?.specialty?.name
                      : // @ts-ignore
                        doctor?.specialty?.foreign_name) ??
                    (language === "ar" ? "غير محدد" : "Not specified")
                  }`,
                  isDropdown: true,
                },
                {
                  label: language === "ar" ? "سعر الحجز" : "Booking Price",
                  value: `${doctor?.fixed_price ? `${doctor.fixed_price} ${language === "ar" ? "د.ل" : "DL"}` : (language === "ar" ? "غير محدد" : "Not specified")}`,
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
              onFieldChange={(index, value) => {
                if (index === 0) { // Phone number field
                  setDoctor(
                    (prev) =>
                      prev && {
                        ...prev,
                        user: { ...prev.user, phone: value }, // Update `doctor.user.phone`
                      }
                  );
                }
                if (index === 1) {
                  setDoctor((prev) => {
                    if (!prev) return prev; // Ensure prev exists
                
                    return {
                      ...prev,
                      staff: {
                        ...prev.staff,
                        city:
                          typeof prev.staff.city === "object" // Ensure city is an object
                            ? {
                                id: prev.staff.city.id, // Keep the existing ID (should be a number)
                                name: value, // Update city name
                                foreign_name: prev.staff.city.foreign_name,
                              }
                            : prev.staff.city, // If city is not an object, keep it as is
                      },
                    };
                  });
                }
                if (index === 2) {
                  setDoctor((prev) => {
                    if (!prev) return prev; // Ensure prev exists
                    return {
                      ...prev,
                      specialty:
                        prev.specialty && typeof prev.specialty === "object"
                          ? {
                              ...prev.specialty,
                              name: value, // Update the name with the desired value
                            }
                          : prev.specialty, // If specialty is not an object, keep it as is
                    };
                  });
                }

                if (index === 3) {
                  setDoctor((prev) => prev && { ...prev, fixed_price: value });
                }
              }}
              cities={cities}
              onCityChange={handleCityChange} // Pass the city change handler
              // @ts-ignore
              specialities={specialities}
              onSpecialityChange={handleSpecialityChange} // Pass the city change handler
            />

            <Table className="w-full border border-gray-300  shadow-sm  rounded-xl">
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
  {doctor?.appointments && doctor.appointments.length > 0 ? (
    doctor.appointments.map((slot, index) => {
      console.log("Appointment:", slot); // Log the appointment

      return (
        <TableRow key={index}>
          {language === "ar" ? (
            <>
              <TableCell className="text-center">
                <Button
                  variant="destructive"
                  /* @ts-ignore */
                  onClick={() => handleRemoveSlot(index, slot.id)}
                  className="text-white hover:text-red-800"
                >
                  {t.remove}
                </Button>
                <Button
                  onClick={() => handleBooked(index)}
                  className="text-white bg-[#1685c7] ml-2"
                >
                  {t.roshitaBook}
                </Button>
              </TableCell>
              <TableCell className="text-center">
                {slot.appointment_status}
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
                {slot.appointment_status}
              </TableCell>
              <TableCell className="text-center gap-2">
                <Button
                  variant="destructive"
                  /* @ts-ignore */
                  onClick={() => handleRemoveSlot(index, slot.id)}
                  className="text-white hover:text-red-800"
                >
                  {t.remove}
                </Button>
                <Button
                  onClick={() => handleBooked(index)}
                  className="text-white bg-[#1685c7] ml-2"
                >
                  {t.roshitaBook}
                </Button>
              </TableCell>
            </>
          )}
        </TableRow>
      );
    })
  ) : (
    <TableRow>
      <TableCell colSpan={4} className="text-center text-gray-500">
        {language === "ar"
          ? "لا توجد مواعيد متاحة"
          : "No appointments available."}
      </TableCell>
    </TableRow>
  )}
</tbody>

            </Table>

            <DoctorSlots onSlotsChange={handleSlotsChange} />

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