"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
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
import LoadingDoctors from "../layout/LoadingDoctors";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

const API_URL = "http://www.test-roshita.net/api/appointment-reservations/";

interface Appointment {
  id: number;
  reservation: {
    id: number;
    patient: {
      first_name: string;
      last_name: string;
      phone: string;
      id: number;
    };
    reservation_date: string;
    reservation_payment_status: string;
  };
  doctor: {
    id: number;
    name: string;
    last_name: string;
  };
  doctor_price: string;
  confirmation_code: string;
}

interface Hospital {
  id: number;
  name: string;
  doctors: Doctor[];
}

interface Doctor {
  id: number;
  name: string;
  appointments: AppointmentSlot[];
}

interface AppointmentSlot {
  id: number;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  price: string;
}

const Planner = ({ language = "en" }: { language?: string }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isSameDoctorModalOpen, setIsSameDoctorModalOpen] = useState(false);
  const [appointmentNumber, setAppointmentNumber] = useState("");
  const [appointmentDoctorId, setAppointmentDoctorId] = useState("");
  const [isSendToAnotherDoctorModalOpen, setIsSendToAnotherDoctorModalOpen] =
    useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(null);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [doctorInfo, setDoctorInfo] = useState<Doctor | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [followUpError, setFollowUpError] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [note, setNote] = useState("");
  const [patientId, setPatientId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const APPOINTMENTS_PER_PAGE = 5;
  const paginatedAppointments = appointments.slice(
    (page - 1) * APPOINTMENTS_PER_PAGE,
    page * APPOINTMENTS_PER_PAGE
  );

  const noDataMessage = language === "ar" ? "لا توجد مواعيد لعرضها" : "No appointments to display";
  const nextText = language === "ar" ? "التالي" : "Next";
  const previousText = language === "ar" ? "السابق" : "Previous";

  const getStatusTranslation = (status: string): string => {
    if (language !== "ar") return status;
    
    const lowerStatus = status.toLowerCase();
    
    switch (lowerStatus) {
      case "pending payment":
        return "في انتظار الدفع";
      case "cancelled by patient":
        return "ملغى من قبل المريض";        
      case "confirmed":
        return "مؤكد";
      case "completed":
        return "مكتمل";
      case "not attend":
        return "لم يحضر";
      case "rejected":
        return "مرفوض";
      case "cancelled by doctor":
        return "ملغى من قبل الطبيب";
      case "cancelled":
        return "ملغى";
      default:
        return status;
    }
  };

  useEffect(() => {
    const fetchAllAppointments = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          console.error("No access token found in localStorage");
          setIsLoading(false);
          return;
        }
    
        let allAppointments: Appointment[] = [];
        let nextPage = 1;
        let hasMore = true;
    
        while (hasMore) {
          const response = await fetch(`${API_URL}search/?page=${nextPage}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          if (!response.ok) throw new Error("Failed to fetch appointments");
    
          const data = await response.json();
          allAppointments = [...allAppointments, ...data.results];
    
          if (data.next) {
            nextPage += 1;
          } else {
            hasMore = false;
          }
        }
    
        const filteredAppointments = allAppointments
          .filter((appointment) => {
            const status = appointment.reservation.reservation_payment_status;
            return status !== "Cancelled" && status !== "Completed";
          })
          .sort((a, b) => {
            const dateA = new Date(a.reservation.reservation_date);
            const dateB = new Date(b.reservation.reservation_date);
            return dateA.getTime() - dateB.getTime();
          });
    
        setAppointments(filteredAppointments);
        setTotalPages(Math.ceil(filteredAppointments.length / APPOINTMENTS_PER_PAGE));
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to fetch appointments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllAppointments();
  }, []);

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
        setError(
          err instanceof Error ? err.message : "Failed to fetch hospitals"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    if (selectedHospitalId) {
      const selectedHospital = hospitals.find(
        (h) => h.id === selectedHospitalId
      );
      setFilteredDoctors(selectedHospital?.doctors || []);
    } else {
      setFilteredDoctors([]);
    }
  }, [selectedHospitalId, hospitals]);

  const fetchAvailableSlots = async (doctorId: string) => {
    try {
      setIsProcessing(true);
      const token = localStorage.getItem("access");
      const response = await fetch(
        `http://www.test-roshita.net/api/doctors/${doctorId}/slots/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch available slots");

      const data = await response.json();
      setAvailableSlots(data);
    } catch (error) {
      console.error("Error fetching available slots:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const fetchDoctorAndSpecialty = async () => {
      setIsLoading(true);
      const accessToken = localStorage.getItem("access");
      try {
        const response = await fetch(
          `/api/doctors/getDoctorById?id=${appointmentDoctorId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const doctorData = await response.json();
        setDoctorInfo(doctorData.data);
      } catch (error) {
        setError("An error occurred while fetching doctor data");
        console.error(error);
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    };

    if (appointmentDoctorId) {
      fetchDoctorAndSpecialty();
    }
  }, [appointmentDoctorId]);

  const handleSameDoctorFollowUp = async (appointmentId: number) => {
    setIsProcessing(true);
    try {
      const selectedAppointment = appointments.find(
        (appointment) => appointment.id === appointmentId
      );
      if (!selectedAppointment) {
        console.error("Appointment not found");
        return;
      }

      const doctorId = selectedAppointment.doctor.id;
      setSelectedDoctorId(doctorId);
      await fetchAvailableSlots(doctorId.toString());
      setIsSameDoctorModalOpen(true);
    } catch (error) {
      console.error("Error in handleSameDoctorFollowUp:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSlotSelection = (slot: AppointmentSlot) => {
    setSelectedSlot(slot);
  };

  const handleSameDoctorFollowUpSubmit = async () => {
    if (!selectedSlot) {
      alert("Please select a slot.");
      return;
    }

    setIsProcessing(true);
    const payload = {
      confirmation_code: appointmentNumber,
      reservation_date: selectedSlot.scheduled_date,
      start_time: selectedSlot.start_time,
      end_time: selectedSlot.end_time,
    };

    try {
      const token = localStorage.getItem("access");
      const response = await fetch(
        "http://www.test-roshita.net/api/appointment-reservations/followup-appointment/",
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
      setIsModalOpen(false);
      setIsFollowUpModalOpen(false);
      setIsSameDoctorModalOpen(false);
      setIsSendToAnotherDoctorModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      setFollowUpError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendToAnotherDoctorSubmit = async () => {
    setIsProcessing(true);
    const payload = {
      patient: patientId,
      appointment_reservation: selectedAppointmentId,
      medical_organization_ids: [selectedHospitalId],
      service_type: serviceType,
      note: note,
    };

    try {
      const token = localStorage.getItem("access");
      const response = await fetch(
        "http://www.test-roshita.net/api/doctor-suggestions/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to create doctor suggestion");

      const data = await response.json();
      setIsSendToAnotherDoctorModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const translations = {
    en: {
      appointmentRef: "Appointment",
      patientFullName: "Patient Name",
      patientPhone: "Patient Phone",
      doctorFullName: "Doctor Name",
      appointmentPrice: "Price",
      appointmentDate: "Date",
      appointmentStatus: "Status",
      action: "Action",
      noShow: "No Show",
      done: "Done",
      cancel: "Cancel",
      endAppointment: "End Appointment",
      followUpAppointment: "Follow-up Appointment",
      sameDoctorFollowUp: "Same Doctor Follow-up",
      sendToAnotherDoctor: "Send to Another Doctor",
      confirmationCode: "Confirmation Code",
      reservationDate: "Reservation Date",
      startTime: "Start Time",
      endTime: "End Time",
      submit: "Submit",
      selectHospital: "Select Hospital",
      selectDoctor: "Select Doctor",
      processing: "Processing...",
    },
    ar: {
      appointmentRef: "الموعد",
      patientFullName: "اسم المريض الكامل",
      patientPhone: "هاتف المريض",
      doctorFullName: "اسم الطبيب الكامل",
      appointmentPrice: "سعر الموعد",
      appointmentDate: "تاريخ الموعد",
      appointmentStatus: "حالة الموعد",
      action: "إجراء",
      noShow: "لم يحضر",
      cancel: "إلغاء",
      done: "إنهاء",
      endAppointment: "إنهاء الموعد",
      followUpAppointment: "موعد المتابعة",
      sameDoctorFollowUp: "متابعة نفس الطبيب",
      sendToAnotherDoctor: "إرسال إلى طبيب آخر",
      confirmationCode: "رمز التأكيد",
      reservationDate: "تاريخ الحجز",
      startTime: "وقت البدء",
      endTime: "وقت الانتهاء",
      submit: "إرسال",
      selectHospital: "اختر المستشفى",
      selectDoctor: "اختر الطبيب",
      processing: "جاري المعالجة...",
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const handleRemoveSlot = async (appointmentId: number) => {
    setIsProcessing(true);
    if (!appointmentId) {
      console.error("Appointment ID not found");
      setIsProcessing(false);
      return;
    }

    try {
      const token = localStorage.getItem("access");
      if (!token) {
        console.error("Access token not found in localStorage");
        setIsProcessing(false);
        return;
      }

      const response = await fetch(
        `https://test-roshita.net/api/appointment-reservations/${appointmentId}/`,
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
          `https://test-roshita.net/api/appointment-reservations/${appointmentId}/`,
          { appointmentId },
          "success",
          response.status
        );
        setAppointments(prev => prev.filter(app => app.id !== appointmentId));
      } else {
        const errorData = await response.json();
        await logAction(
          token,
          `https://test-roshita.net/api/appointment-reservations/${appointmentId}/`,
          { appointmentId },
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
          `https://test-roshita.net/api/appointment-reservations/${appointmentId}/`,
          { appointmentId },
          "error",
          error instanceof Error ? 500 : 500,
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkNotAttend = async (appointmentId: number) => {
    setIsProcessing(true);
    if (!appointmentId) {
      console.error("Appointment ID not found");
      setIsProcessing(false);
      return;
    }

    try {
      const token = localStorage.getItem("access");
      if (!token) {
        console.error("Access token not found in localStorage");
        setIsProcessing(false);
        return;
      }

      const response = await fetch(
        `http://www.test-roshita.net/api/mark-not-attend/${appointmentId}/`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-CSRFToken":
              "9htdjDGAaHSm5TKSyU7DoBSxj4PlVCSYt2yA1iOmGLIu2JXABwbrTe3rgvbCnG2U",
          },
          body: JSON.stringify({ appointmentId }),
        }
      );

      if (response.ok) {
        await logAction(
          token,
          `http://www.test-roshita.net/api/mark-not-attend/${appointmentId}/`,
          { appointmentId },
          "success",
          response.status
        );
        setAppointments(prev => prev.map(app => 
          app.id === appointmentId ? {
            ...app,
            reservation: {
              ...app.reservation,
              reservation_payment_status: "No Show"
            }
          } : app
        ));
      } else {
        const errorData = await response.json();
        await logAction(
          token,
          `http://www.test-roshita.net/api/mark-not-attend/${appointmentId}/`,
          { appointmentId },
          "error",
          response.status,
          errorData.message || "Failed to mark as not attended"
        );
      }
    } catch (error) {
      console.error("Error marking as not attended:", error);
      const token = localStorage.getItem("access");
      if (token) {
        await logAction(
          token,
          `http://www.test-roshita.net/api/mark-not-attend/${appointmentId}/`,
          { appointmentId },
          "error",
          error instanceof Error ? 500 : 500,
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndSlot = async (appointmentId: number) => {
    setIsProcessing(true);
    const url =
      "https://test-roshita.net/api/complete-appointment-reservations/";
    const token = localStorage.getItem("access");
    const data = {
      appointment_reservation_id: appointmentId,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
          "X-CSRFToken":
            "9htdjDGAaHSm5TKSyU7DoBSxj4PlVCSYt2yA1iOmGLIu2JXABwbrTe3rgvbCnG2U",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      if (token) {
        await logAction(
          token,
          url,
          { appointmentId },
          "success",
          response.status
        );
      }
      
      setAppointments(prev => prev.map(app => 
        app.id === appointmentId ? {
          ...app,
          reservation: {
            ...app.reservation,
            reservation_payment_status: "Completed"
          }
        } : app
      ));
    } catch (error) {
      if (token) {
        await logAction(
          token,
          url,
          { appointmentId },
          "error",
          error instanceof Error ? 500 : 500,
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      }
      console.error("Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDoneClick = (
    appointmentId: number,
    appointmentReservationId: number,
    appointmentNumber: string,
    appointmentDoctorId: number
  ) => {
    setSelectedAppointmentId(appointmentId);
    setAppointmentNumber(appointmentNumber);
    setPatientId(appointmentReservationId.toString());
    setAppointmentDoctorId(appointmentDoctorId.toString());
    setIsModalOpen(true);
  };

  const handleEndAppointment = async () => {
    if (selectedAppointmentId) {
      await handleEndSlot(selectedAppointmentId);
      setIsModalOpen(false);
    }
  };

  const handleFollowUpAppointment = () => {
    setIsModalOpen(false);
    setIsFollowUpModalOpen(true);
  };

  const handleSendToAnotherDoctor = () => {
    setIsFollowUpModalOpen(false);
    setIsSendToAnotherDoctorModalOpen(true);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const disableNextPage = page >= totalPages;
  const disablePreviousPage = page === 1;

  return (
    <div className="p-4 border rounded-md shadow" dir={language === "ar" ? "rtl" : "ltr"}>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingDoctors />
        </div>
      ) : (
        <>
          {error && (
            <p className="text-red-500 text-center">{error}</p>
          )}
          {followUpError && (
            <p className="text-red-500 text-center">{followUpError}</p>
          )}
          <div className="overflow-x-auto w-full">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="text-center">
                  {language === "ar" ? (
                    <>
                    <TableHead className="text-center">{t.appointmentRef}</TableHead>
                    <TableHead className="text-center">{t.patientFullName}</TableHead>
                    <TableHead className="text-center">{t.patientPhone}</TableHead>
                    <TableHead className="text-center">{t.doctorFullName}</TableHead>
                    <TableHead className="text-center">{t.appointmentPrice}</TableHead>
                    <TableHead className="text-center">{t.appointmentDate}</TableHead>
                    <TableHead className="text-center">{t.appointmentStatus}</TableHead>
                    <TableHead className="text-center">{t.action}</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead className="text-center">{t.appointmentRef}</TableHead>
                      <TableHead className="text-center">{t.patientFullName}</TableHead>
                      <TableHead className="text-center">{t.patientPhone}</TableHead>
                      <TableHead className="text-center">{t.doctorFullName}</TableHead>
                      <TableHead className="text-center">{t.appointmentPrice}</TableHead>
                      <TableHead className="text-center">{t.appointmentDate}</TableHead>
                      <TableHead className="text-center">{t.appointmentStatus}</TableHead>
                      <TableHead className="text-center">{t.action}</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {noDataMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      {language === "ar" ? (
                        <>
                          <TableCell className="text-right">
                          #{appointment.reservation.id }
                        </TableCell>
                        <TableCell className="text-right">
                          {`${appointment.reservation.patient.first_name} ${appointment.reservation.patient.last_name}`}
                        </TableCell>
                        <TableCell className="text-right">
                          {appointment.reservation.patient.phone}
                        </TableCell>
                        <TableCell className="text-right">
                          {`${appointment.doctor.name} ${appointment.doctor.last_name}`}
                        </TableCell>
                        <TableCell className="text-right">
                          {appointment.doctor_price}
                        </TableCell>
                        <TableCell className="text-right">
                          {format(new Date(appointment.reservation.reservation_date), "yyyy-MM-dd")}
                        </TableCell>
                        <TableCell className="text-right">
                          {getStatusTranslation(appointment.reservation.reservation_payment_status)}
                        </TableCell>
                        <TableCell className="text-center">
                            {!["Cancelled By Patient", "Not Attend", "rejected", "Cancelled By Doctor", "Cancelled", "No Show"].includes(appointment.reservation.reservation_payment_status) ? (
                              <div className={`flex justify-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                                <Button
                                  variant="outline"
                                  className="bg-yellow-500 text-white hover:bg-yellow-600"
                                  onClick={() => handleMarkNotAttend(appointment.id)}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? (
                                    <ClipLoader size={20} color="#ffffff" />
                                  ) : (
                                    t.noShow
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  className="bg-green-500 text-white hover:bg-green-600"
                                  onClick={() =>
                                    handleDoneClick(
                                      appointment.id,
                                      appointment.reservation.patient.id,
                                      appointment.confirmation_code,
                                      appointment.doctor.id
                                    )
                                  }
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? (
                                    <ClipLoader size={20} color="#ffffff" />
                                  ) : (
                                    t.done
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  className="bg-red-500 text-white hover:bg-red-600"
                                  onClick={() => handleRemoveSlot(appointment.id)}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? (
                                    <ClipLoader size={20} color="#ffffff" />
                                  ) : (
                                    t.cancel
                                  )}
                                </Button>
                              </div>
                            ) : "-"}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="text-center">
                            #{appointment.reservation.id || "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            {appointment.reservation.patient.first_name}{" "}
                            {appointment.reservation.patient.last_name}
                          </TableCell>
                          <TableCell className="text-center">
                            {appointment.reservation.patient.phone || "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            {appointment.doctor
                              ? `${appointment.doctor.name} ${appointment.doctor.last_name}`
                              : "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            {appointment.doctor_price || "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            {format(
                              new Date(appointment.reservation.reservation_date),
                              "yyyy-MM-dd"
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {getStatusTranslation(appointment.reservation.reservation_payment_status)}
                          </TableCell>
                          <TableCell className="text-center">
                            {!["Cancelled By Patient", "Not Attend", "rejected", "Cancelled By Doctor", "Cancelled", "No Show"].includes(appointment.reservation.reservation_payment_status) ? (
                              <div className="flex justify-center gap-2">
                                <Button
                                  variant="outline"
                                  className="bg-yellow-500 text-white hover:bg-yellow-600"
                                  onClick={() => handleMarkNotAttend(appointment.id)}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? (
                                    <ClipLoader size={20} color="#ffffff" />
                                  ) : (
                                    t.noShow
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  className="bg-green-500 text-white hover:bg-green-600"
                                  onClick={() =>
                                    handleDoneClick(
                                      appointment.id,
                                      appointment.reservation.patient.id,
                                      appointment.confirmation_code,
                                      appointment.doctor.id
                                    )
                                  }
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? (
                                    <ClipLoader size={20} color="#ffffff" />
                                  ) : (
                                    t.done
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  className="bg-red-500 text-white hover:bg-red-600"
                                  onClick={() => handleRemoveSlot(appointment.id)}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? (
                                    <ClipLoader size={20} color="#ffffff" />
                                  ) : (
                                    t.cancel
                                  )}
                                </Button>
                              </div>
                            ) : "-"}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <Pagination className={`mt-4 ${language === "ar" ? "flex-row-reverse" : ""}`}>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={handlePreviousPage}
                    //@ts-ignore
                    disabled={disablePreviousPage || isProcessing}
                    className={language === "ar" ? "flex-row-reverse" : ""}
                  >
                    {previousText}
                  </PaginationPrevious>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink>{page}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={handleNextPage}
                                        //@ts-ignore
                    disabled={disableNextPage || isProcessing}
                    className={language === "ar" ? "flex-row-reverse" : ""}
                  >
                    {nextText}
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.endAppointment}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p>{language === "ar" ? "ما الذي تريد القيام به؟" : "What would you like to do?"}</p>
                <div className="flex space-x-2">
                  <Button onClick={handleEndAppointment}>
                    {t.endAppointment}
                  </Button>
                  <Button onClick={handleFollowUpAppointment}>
                    {t.followUpAppointment}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isFollowUpModalOpen} onOpenChange={setIsFollowUpModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.followUpAppointment}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p>{language === "ar" ? "اختر نوع المتابعة:" : "Choose follow-up type:"}</p>
                <div className="flex space-x-2">
                  <Button onClick={() => handleSameDoctorFollowUp(selectedAppointmentId!)}>
                    {t.sameDoctorFollowUp}
                  </Button>
                  <Button onClick={handleSendToAnotherDoctor}>
                    {t.sendToAnotherDoctor}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isSameDoctorModalOpen} onOpenChange={setIsSameDoctorModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.sameDoctorFollowUp}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {isProcessing ? (
                  <div className="flex justify-center">
                    <ClipLoader size={30} color="#3b82f6" />
                  </div>
                ) : (
                  <>
                    <p>{t.confirmationCode}: {appointmentNumber}</p>
                    <div className="grid gap-2">
                      {availableSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`p-2 border rounded cursor-pointer ${
                            selectedSlot?.id === slot.id ? "bg-blue-100" : ""
                          }`}
                          onClick={() => handleSlotSelection(slot)}
                        >
                          <p>{t.reservationDate}: {slot.scheduled_date}</p>
                          <p>{t.startTime}: {slot.start_time}</p>
                          <p>{t.endTime}: {slot.end_time}</p>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={handleSameDoctorFollowUpSubmit}
                      disabled={!selectedSlot || isProcessing}
                    >
                      {isProcessing ? t.processing : t.submit}
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isSendToAnotherDoctorModalOpen} onOpenChange={setIsSendToAnotherDoctorModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.sendToAnotherDoctor}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label>{t.selectHospital}</label>
                  <Select
                    onValueChange={(value) => setSelectedHospitalId(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectHospital} />
                    </SelectTrigger>
                    <SelectContent>
                      {hospitals.map((hospital) => (
                        <SelectItem key={hospital.id} value={hospital.id.toString()}>
                          {hospital.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedHospitalId && (
                  <div>
                    <label>{t.selectDoctor}</label>
                    <Select
                      onValueChange={(value) => setSelectedDoctorId(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectDoctor} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredDoctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id.toString()}>
                            {doctor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <label>{language === "ar" ? "نوع الخدمة" : "Service Type"}</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                  />
                </div>
                <div>
                  <label>{language === "ar" ? "ملاحظات" : "Notes"}</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleSendToAnotherDoctorSubmit}
                  disabled={isProcessing || !selectedHospitalId || !selectedDoctorId}
                >
                  {isProcessing ? t.processing : t.submit}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default Planner;