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

import { Table, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { logAction } from "@/lib/logger";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import LoadingDoctors from "@/components/layout/LoadingDoctors";
import PlannerDoctor from "@/components/dashboard/PlannerDoctor";
import PlannerDoctorAll from "@/components/dashboard/PlannerDoctorAll";
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
    followUpAppointment: "Follow-up Appointment",
    sameDoctorFollowUp: "Same Doctor Follow-up",
    sendToAnotherDoctor: "Send to Another Doctor",
    status: "Status",
    patientName: "Patient Name",
    patientLastName: "Patient Last Name",
    patientNumber: "Patient Number",
    patientEmail: "Patient Email",
    appointmentRef: "Appointment",
    patientFullName: "Patient Name",
    patientPhone: "Patient Phone",
    doctorFullName: "Doctor Name",
    appointmentPrice: "Price",
    appointmentDate: "Date",
    appointmentStatus: "Status",
    noShow: "No Show",
    done: "Done",
    cancel: "Cancel",
    endAppointment: "End Appointment",
    confirmationCode: "Confirmation Code",
    reservationDate: "Reservation Date",
    submit: "Submit",
    selectHospital: "Select Hospital",
    selectDoctor: "Select Doctor",
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
    followUpAppointment: "موعد المتابعة",
    sameDoctorFollowUp: "متابعة نفس الطبيب",
    sendToAnotherDoctor: "إرسال إلى طبيب آخر",
    date: "التاريخ",
    action: "إجراء",
    roshitaBook: "إنهاء ",
    status: "الحالة",
    patientName: "اسم المريض",
    patientLastName: "اسم العائلة للمريض",
    patientNumber: "رقم المريض",
    patientEmail: "بريد المريض الإلكتروني",
    appointmentRef: "الموعد",
    patientFullName: "اسم المريض الكامل",
    patientPhone: "هاتف المريض",
    doctorFullName: "اسم الطبيب الكامل",
    appointmentPrice: "سعر الموعد",
    appointmentDate: "تاريخ الموعد",
    appointmentStatus: "حالة الموعد",
    noShow: "لم يحضر",
    cancel: "إلغاء",
    done: "إنهاء",
    endAppointment: "إنهاء الموعد",
    confirmationCode: "رمز التأكيد",
    reservationDate: "تاريخ الحجز",
    submit: "إرسال",
    selectHospital: "اختر المستشفى",
    selectDoctor: "اختر الطبيب",
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
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(
    null
  );
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isSameDoctorModalOpen, setIsSameDoctorModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendToAnotherDoctorModalOpen, setIsSendToAnotherDoctorModalOpen] =
    useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(
    null
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [appointmentNumber, setAppointmentNumber] = useState("");
  const [followUpError, setFollowUpError] = useState("");
  const t = translations[language];
  const [patientDetails, setPatientDetails] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  // Handle "Same Doctor Follow-up" form submission
  const handleSameDoctorFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      confirmation_code: appointmentNumber,
      reservation_date: selectedSlot.scheduled_date,
      start_time: selectedSlot.start_time,
      end_time: selectedSlot.end_time,
    };

    try {
      const token = localStorage.getItem("access");
      const response = await fetch(
        "https://www.test-roshita.net/api/appointment-reservations/followup-appointment/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to submit follow-up request");

      const data = await response.json();
      console.log("Follow-up request successful:", data);
      setIsModalOpen(false);
      setIsFollowUpModalOpen(false);
      setIsSameDoctorModalOpen(false);
      setIsSendToAnotherDoctorModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
      // Extract the error message from the error object
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setFollowUpError(errorMessage);
      setIsModalOpen(false);
      setIsFollowUpModalOpen(false);
      setIsSameDoctorModalOpen(false);
      setIsSendToAnotherDoctorModalOpen(false);
    }
  };

  // Handle "Send to Another Doctor" action
  const handleSendToAnotherDoctorSubmit = async () => {
    if (!selectedHospitalId || !selectedDoctorId) {
      alert("Please select a hospital and a doctor.");
      return;
    }

    try {
      const token = localStorage.getItem("access");
      const response = await fetch(
        "https://www.test-roshita.net/api/api/select-organization",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctor_suggest_id: selectedDoctorId,
            medical_organization: selectedHospitalId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send to another doctor");

      const data = await response.json();
      console.log("Send to another doctor successful:", data);
      setIsSendToAnotherDoctorModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Open modal and set the selected appointment ID
  const handleDoneClick = (
    appointmentId: number,
    appointmentNumber: number
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setAppointmentNumber(appointmentNumber);
    setSelectedAppointmentId(appointmentId);
    setIsModalOpen(true);
  };

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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            error.response?.status || 500, // Use the error status code or default to 500
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          error?.response?.status || 500, // Use the error status code or default to 500
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
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

  // Fetch hospitals
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/userHospital/getHospital");
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Failed to fetch hospitals");
        setHospitals(data.data || []);
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  // Update doctors when a hospital is selected
  useEffect(() => {
    if (selectedHospitalId) {
      const selectedHospital = hospitals.find(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (h) => h.id === selectedHospitalId
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setFilteredDoctors(selectedHospital?.doctors || []);
    } else {
      setFilteredDoctors([]);
    }
  }, [selectedHospitalId, hospitals]);

  console.log("doctorId", id);

  // Handle "End Appointment" action
  const handleEndAppointment = async () => {
    if (selectedAppointmentId) {
      await handleEndSlot(selectedAppointmentId);
      setIsModalOpen(false);
    }
  };

  // Handle "Follow-up Appointment" action
  const handleFollowUpAppointment = () => {
    setIsModalOpen(false);
    setIsFollowUpModalOpen(true);
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleSlotSelection = (slot: AppointmentSlot) => {
    setSelectedSlot(slot);
  };

  // Breadcrumb items with Arabic text
  const items = [
    { label: language === "ar" ? "الرئسية" : "Dashboard", href: "#" },
    {
      label: language === "ar" ? "الأطباء" : "Doctors",
      href: "/dashboard/doctors",
    },
  ];

  // Fetch doctor details and specialty information
  useEffect(() => {
    const fetchDoctorAndSpecialty = async () => {
      const accessToken =
        typeof window !== "undefined" ? localStorage.getItem("access") : null;
      const doctorId =
        typeof window !== "undefined" ? localStorage.getItem("userId") : null;
      try {
        // Fetch doctor data
        const response = await fetch(
          `/api/doctors/getDoctorById?id=${doctorId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`, // Send the token in the Authorization header
            },
          }
        );
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
  const fetchAppointments = async (page = 1) => {
    try {
      const token = localStorage.getItem("access");
      const doctorId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;
      if (!token) {
        console.error("Access token is missing.");
        return;
      }

      console.log("id0", id)

      const response = await fetch(
        `https://www.test-roshita.net/api/appointment-reservations/search/?doctor_id=${doctorId}&page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      console.log("Fetched Appointments:", data);

      // Filter appointments by doctor ID
      const filteredAppointments = data.results.filter(
        //@ts-ignore
        (appointment) =>
          appointment.doctor && String(appointment.doctor.id) === String(id)
      );

      setAppointments(filteredAppointments.reverse());
      setCurrentPage(page);
      setTotalPages(Math.ceil(data.count / 5)); // Assuming 5 items per page
      setNextPage(data.next);
      setPrevPage(data.previous);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

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
                  doctor?.user.phone ??
                  (language === "ar" ? "غير محدد" : "Not specified")
                }
                imageSrc={
                  doctor?.staff.staff_avatar ?? "/Images/default-doctor.jpg"
                }
                language={language}
              />
              <div>

                <div className=" p-4 flex  flex-col justify-center">
                  <div className="mb-4">
                  <PlannerDoctor language={language} />
                  </div>
                </div>

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
