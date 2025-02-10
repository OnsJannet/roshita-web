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
import LoadingDoctors from "../../../../../components/layout/LoadingDoctors";
import { Table, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { logAction } from "@/lib/logger";
// Define types for doctor data and specialty data

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
      city: { id: string; foreign_name: string; name: string };
      phone: string;
    }[];
    staff_avatar: string;
  };
  specialty: Specialty[];
  fixed_price: string;
  user: User;
  appointments: Appointment[];
}

interface Specialty {
  id: number;
  name: string;
  foreign_name: string;
}

type Params = {
  id: string;
};

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

type Appointment = {
  scheduled_date: string;
  start_time: string;
  end_time: string;
  appointment_status: string;
  //price: string;
};

type Language = "ar" | "en";

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
    roshitaBook: "End",
    status: "Status",
    patientName: "Patient Name",
    patientLastName: "Patient Last Name",
    patientNumber: "Patient Number",
    patientEmail: "Patient Email",
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
    roshitaBook: "إنهاء ",
    status: "الحالة",
    patientName: "اسم المريض",
    patientLastName: "اسم العائلة للمريض",
    patientNumber: "رقم المريض",
    patientEmail: "بريد المريض الإلكتروني",
  },
  it: {
    title: "Disponibilità degli appuntamenti del medico",
    selectDate: "Seleziona la data",
    startTime: "Orario di inizio",
    endTime: "Orario di fine",
    duration: "Durata (Ore)",
    addSlot: "Aggiungi orario",
    currentSlots: "Orari attuali",
    noSlots: "Nessun orario aggiunto ancora.",
    remove: "Annulla",
    durationError: "La durata è maggiore dell'intervallo di tempo disponibile.",
    date: "Data",
    action: "Azione",
    roshitaBook: "Prenota",
    status: "Stato",
    patientName: "Nome del paziente",
    patientLastName: "Cognome del paziente",
    patientNumber: "Numero del paziente",
    patientEmail: "Email del paziente",
  },
};

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
  const [appointments, setAppointments] = useState<any[]>([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [cities, setCities] = useState<City[]>([]); // State for cities
  const [specialities, setSpecialities] = useState<Specialities | null>(null); // Allow null if no data
  const [bookingDetails, setBookingDetails] = useState<Appointment | null>(
    null
  );
  const t = translations[language];
  const [patientDetails, setPatientDetails] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
  });

  const handleBooked = (index: number) => {
    console.log("index", index);
    if (doctor && doctor.appointments) {
      console.log("entered doctors");
      const selectedAppointment = doctor.appointments[index];
      setBookingDetails(selectedAppointment);
      setPopupVisible(true);
    }
  };

  const formatDate = (scheduledDate: string) => {
    const date = new Date(scheduledDate); // Scheduled date is already in YYYY-MM-DD
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };


  const handleRemoveSlot = async (index: number) => {
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
          `https://test-roshita.net/api/appointment-reservations/${index}/`,
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
            error.response?.status || 500, // Use the error status code or default to 500
            error.message || "An unknown error occurred" // Error message
          );
        }
      }
    }
  };

  const handleEndSlot = async (index: number) => {
    // Define the URL of the API endpoint
    const url =
      "https://test-roshita.net/api/complete-appointment-reservations/";

    // Retrieve the Bearer token from localStorage
    const token = localStorage.getItem("access");

    // Define the data to be sent in the request body
    const data = {
      appointment_reservation_id: index, // Use the index parameter as the appointment_reservation_id
    };

    try {
      // Use the Fetch API to make the POST request
      const response = await fetch(url, {
        method: "POST", // Specify the request method
        headers: {
          accept: "application/json", // Accept JSON response
          Authorization: `Bearer ${token}`, // Add Bearer token to headers
          "X-CSRFToken":
            "9htdjDGAaHSm5TKSyU7DoBSxj4PlVCSYt2yA1iOmGLIu2JXABwbrTe3rgvbCnG2U", // Add CSRF token
          "Content-Type": "application/json", // Specify content type
        },
        body: JSON.stringify(data), // Convert the data to a JSON string
      });

      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      // Log the action as a success
      if (token) {
        await logAction(
          token,
          url,
          { appointmentId: index },
          "success",
          response.status
        );
      }
      // Parse the JSON response
      const responseData = await response.json();

      console.log("Success:", responseData); // Handle the success response
    } catch (error) {
      // Log the action as an error
      if (token) {
        await logAction(
          token,
          url,
          { appointmentId: index },
          "error",
          error?.response?.status || 500, // Use the error status code or default to 500
          error?.message || "An unknown error occurred"
        );
      }
      console.error("Error:", error); // Handle any errors
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

  const handleBookingSubmit = async () => {
    const payload = {
      reservation: {
        patient: patientDetails,
        //reservation_payment_status: "pending payment",
        reservation_date: bookingDetails?.scheduled_date,
      },
      confirmation_code: "12345", // Replace or generate dynamically
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
        alert("Booking successful!");
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
              (item) => item.id === doctorData.data.specialty.id
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


  // Fetch data from API with token from localStorage
  const fetchAppointments = async () => {
    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem("access");

      if (!token) {
        console.error("Access token is missing.");
        return;
      }

      // Make the GET request with the Authorization header
      const response = await fetch(
        `https://www.test-roshita.net/api/appointment-reservations/search/?id&doctor_id=${id}&page=4`,
        
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in Authorization header
            "Content-Type": "application/json", // Set content type to JSON
          },
        }
      );

      // Handle response
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log("this is the data appointments", data);
      console.log("appointment.doctor.id", id);

      // Correct filtering: Ensure doctor exists before accessing doctor.id
      const filteredAppointments = data.results.filter((appointment: any) => {
        if (!appointment.doctor) {
          console.error(`Appointment has no doctor: ${appointment.id}`);
          return false;
        }

        // Log the price for each appointment while filtering
        console.log(
          `Filtering appointment ID: ${appointment.doctor.id}, id: ${id}`
        );

        return String(appointment.doctor.id) === String(id);
      });

      console.log("this is the filtered appointments", filteredAppointments);

      setAppointments(filteredAppointments.reverse());
      console.log(data); // Log the fetched data or handle it accordingly

      return data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Example usage of the function
  useEffect(() => {
    fetchAppointments();
  }, [id]);

  console.log("appointments", appointments);


  return loading ? (
    <div className="flex items-center justify-center min-h-screen mx-auto">
      <LoadingDoctors />
    </div>
  ) : (
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
                  (language === "en"
                    ? doctor?.staff.medical_organization[0]?.city.foreign_name
                    : doctor?.staff.medical_organization[0]?.city.name) ??
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
              <div>
                {error && <div className="text-red-500">{error}</div>}
                {popupVisible && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 h-screen">
                    <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-lg">
                      <h3
                        className={`text-lg font-bold mb-4 ${
                          language === "ar" ? "text-right" : "text-left"
                        }`}
                      >
                        {language === "ar"
                          ? "احجز موعدك"
                          : "Book Your Appointment"}
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
                          placeholder={
                            language === "ar" ? "رقم الهاتف" : "Phone"
                          }
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
                              {language === "ar"
                                ? "اختر المدينة"
                                : "Select a city"}
                            </option>
                            {cities.map((city) => (
                              <option key={city.id} value={city.id}>
                                {
                                  city[
                                    language === "ar" ? "name" : "foreign_name"
                                  ]
                                }
                              </option>
                            ))}
                          </select>
                        </div>
                        <input
                          type="text"
                          placeholder={
                            language === "ar" ? "العنوان" : "Address"
                          }
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
                <Table className="w-full border border-gray-300 shadow-sm rounded-sm">
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
                            {t.patientEmail}
                          </TableCell>
                          <TableCell className="font-bold text-gray-700 text-center">
                            {t.patientNumber}
                          </TableCell>
                          <TableCell className="font-bold text-gray-700 text-center">
                            {t.patientLastName}
                          </TableCell>
                          <TableCell className="font-bold text-gray-700 text-center">
                            {t.patientName}
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
                            {t.patientName}
                          </TableCell>
                          <TableCell className="font-bold text-gray-700 text-center">
                            {t.patientLastName}
                          </TableCell>
                          <TableCell className="font-bold text-gray-700 text-center">
                            {t.patientNumber}
                          </TableCell>
                          <TableCell className="font-bold text-gray-700 text-center">
                            {t.patientEmail}
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
                    {appointments && appointments.length > 0 ? (
                      appointments.map((slot, index) => (
                        <TableRow key={index}>
                          {language === "ar" ? (
                            <>
                              {slot.reservation.reservation_payment_status ===
                              "pending" ? (
                                <TableCell className="text-center">
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleRemoveSlot(slot.id)}
                                    className="text-white hover:text-red-800"
                                  >
                                    {t.remove}
                                  </Button>
                                  <Button
                                    onClick={() => handleEndSlot(slot.id)}
                                    className="text-white bg-[#1685c7] ml-2"
                                  >
                                    {t.roshitaBook}
                                  </Button>
                                </TableCell>
                              ) : (
                                <p className="text-center p-4">-</p>
                              )}
                              <TableCell className="text-center">
                                {slot.reservation.reservation_payment_status}
                              </TableCell>
                              <TableCell className="text-center">
                                {slot.end_time ? slot.end_time : "-"}
                              </TableCell>
                              <TableCell className="text-center">
                                {slot.start_time ? slot.start_time : "-"}
                              </TableCell>
                              <TableCell className="text-center">
                                {slot.reservation.patient.email}
                              </TableCell>
                              <TableCell className="text-center">
                                {slot.reservation.patient.phone}
                              </TableCell>
                              <TableCell className="text-center">
                                {slot.reservation.patient.last_name}
                              </TableCell>
                              <TableCell className="text-center">
                                {slot.reservation.patient.first_name}
                              </TableCell>
                              <TableCell className="text-center">
                                {formatDate(slot.reservation.reservation_date)}
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell className="text-center">
                                {formatDate(slot.reservation.reservation_date)}
                              </TableCell>
                              <TableCell className="text-center">
                                {slot.reservation.patient.first_name}
                              </TableCell>
                              <TableCell className="text-center">
                                {slot.reservation.patient.last_name}
                              </TableCell>
                              <TableCell className="text-center">
                                {slot.reservation.patient.phone}
                              </TableCell>
                              <TableCell className="text-center">
                                {slot.reservation.patient.email}
                              </TableCell>
                              <TableCell className="text-center">
                                {slot.start_time}
                              </TableCell>
                              <TableCell className="text-center">
                                {slot.end_time}
                              </TableCell>
                              <TableCell className="text-center">
                                {slot.reservation.reservation_payment_status}
                              </TableCell>
                              {slot.reservation.reservation_payment_status ===
                              "pending" ? (
                                <TableCell className="text-center">
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleRemoveSlot(slot.id)}
                                    className="text-white hover:text-red-800"
                                  >
                                    {t.remove}
                                  </Button>
                                  <Button
                                    onClick={() => handleEndSlot(slot.id)}
                                    className="text-white bg-[#1685c7] ml-2"
                                  >
                                    {t.roshitaBook}
                                  </Button>
                                </TableCell>
                              ) : (
                                <p className="text-center p-4">-</p>
                              )}
                            </>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={10}
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
              </div>
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
