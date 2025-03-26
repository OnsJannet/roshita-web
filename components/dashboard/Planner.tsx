"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { startOfWeek, format } from "date-fns";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { logAction } from "@/lib/logger";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingDoctors from "../layout/LoadingDoctors";

const API_URL = "https://www.test-roshita.net/api/appointment-reservations/";

interface Appointment {
  id: number;
  reservation: {
    id: number;
    patient: {
      first_name: string;
      last_name: string;
      phone: string;
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
  const [selectedAppointment, setSelectedAppointment] = useState([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isSameDoctorModalOpen, setIsSameDoctorModalOpen] = useState(false);
  const [appointmentNumber, setAppointmentNumber] = useState("");
  const [appointmentDoctorId, setAppointmentDoctorId] = useState("");
  const [isSendToAnotherDoctorModalOpen, setIsSendToAnotherDoctorModalOpen] =
    useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(
    null
  );
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorInfo, setDoctorInfo] = useState<Doctor | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([]);
  const [reservationId, setReservationId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(
    null
  );
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

  useEffect(() => {
    const fetchAllAppointments = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          console.error("No access token found in localStorage");
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

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filteredAppointments = allAppointments
          .filter((appointment) => {
            const appointmentDate = new Date(
              appointment.reservation.reservation_date
            );
            const status = appointment.reservation.reservation_payment_status;

            return status !== "Cancelled" && status !== "Completed";
          })
          .sort((a, b) => {
            const dateA = new Date(a.reservation.reservation_date);
            const dateB = new Date(b.reservation.reservation_date);
            return dateA.getTime() - dateB.getTime();
          });

        setAppointments(filteredAppointments);
        setTotalPages(
          Math.ceil(filteredAppointments.length / APPOINTMENTS_PER_PAGE)
        );
      } catch (error) {
        console.error("Error fetching appointments:", error);
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
        `https://www.test-roshita.net/api/doctors/${doctorId}/slots/`,
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

    fetchDoctorAndSpecialty();
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
        "https://www.test-roshita.net/api/doctor-suggestions/",
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

  const t = translations[language as keyof typeof translations];

  const handleRemoveSlot = async (index: number) => {
    setIsProcessing(true);
    if (!index) {
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
        await logAction(
          token,
          `https://test-roshita.net/api/appointment-reservations/${index}/`,
          { appointmentId: index },
          "success",
          response.status
        );
      } else {
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
        `https://www.test-roshita.net/api/mark-not-attend/${appointmentId}/`,
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
          `https://www.test-roshita.net/api/mark-not-attend/${appointmentId}/`,
          { appointmentId },
          "success",
          response.status
        );
      } else {
        const errorData = await response.json();
        await logAction(
          token,
          `https://www.test-roshita.net/api/mark-not-attend/${appointmentId}/`,
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
          `https://www.test-roshita.net/api/mark-not-attend/${appointmentId}/`,
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

  const handleEndSlot = async (index: number) => {
    setIsProcessing(true);
    const url =
      "https://test-roshita.net/api/complete-appointment-reservations/";
    const token = localStorage.getItem("access");
    const data = {
      appointment_reservation_id: index,
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
          { appointmentId: index },
          "success",
          response.status
        );
      }
    } catch (error) {
      if (token) {
        await logAction(
          token,
          url,
          { appointmentId: index },
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

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePreviousPage = () => setPage((prev) => Math.max(1, prev - 1));

  return (
    <div className="p-4 border rounded-md shadow">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingDoctors />
        </div>
      ) : (
        <>
          {followUpError && (
            <p className="text-red-500 text-center">{followUpError}</p>
          )}
          <div className="overflow-x-auto w-full">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="text-center">
                  {Object.values(t)
                    .slice(0, 8)
                    .map((header, index) => (
                      <TableHead key={index} className="text-center">
                        {header as ReactNode}
                      </TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
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
                      {appointment.reservation.reservation_payment_status}
                    </TableCell>

                    {appointment.reservation.reservation_payment_status !==
                    "pendings" ? (
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          className="mr-2 bg-yellow-500 text-white"
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
                          className="mr-2 bg-green-500 text-white"
                          onClick={() =>
                            handleDoneClick(
                              appointment.id,
                              //@ts-ignore
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
                          className="bg-red-500 text-white"
                          onClick={() => handleRemoveSlot(appointment.id)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <ClipLoader size={20} color="#ffffff" />
                          ) : (
                            t.cancel
                          )}
                        </Button>
                      </TableCell>
                    ) : (
                      <p className="text-center p-4">-</p>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">{t.done}</DialogTitle>
              </DialogHeader>
              <div className="flex lg:flex-row flex-col gap-4 justify-center">
                <Button onClick={handleEndAppointment} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <ClipLoader size={20} color="#ffffff" className="mr-2" />
                      {t.processing}
                    </>
                  ) : (
                    t.endAppointment
                  )}
                </Button>
                <Button
                  onClick={handleFollowUpAppointment}
                  disabled={isProcessing}
                >
                  {t.followUpAppointment}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isFollowUpModalOpen}
            onOpenChange={setIsFollowUpModalOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">
                  {t.followUpAppointment}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <Button
                  onClick={() =>
                    handleSameDoctorFollowUp(selectedAppointmentId!)
                  }
                  disabled={isProcessing}
                >
                  {t.sameDoctorFollowUp}
                </Button>
                <Button
                  onClick={handleSendToAnotherDoctor}
                  disabled={isProcessing}
                >
                  {t.sendToAnotherDoctor}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isSameDoctorModalOpen}
            onOpenChange={setIsSameDoctorModalOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">
                  {t.sameDoctorFollowUp}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {doctorInfo?.appointments?.map((slot, index) => (
                  <Button
                    key={slot.id || index}
                    onClick={() => handleSlotSelection(slot)}
                    disabled={isProcessing}
                    className={`w-full px-4 py-2 rounded ${
                      selectedSlot?.id === slot.id
                        ? "bg-gray-400"
                        : "bg-gray-200"
                    } text-black hover:bg-gray-300 transition-colors`}
                  >
                    {slot.scheduled_date} - {slot.start_time} to {slot.end_time}
                  </Button>
                ))}
                <Button
                  onClick={handleSameDoctorFollowUpSubmit}
                  className="w-full"
                  disabled={isProcessing || !selectedSlot}
                >
                  {isProcessing ? (
                    <>
                      <ClipLoader size={20} color="#ffffff" className="mr-2" />
                      {t.processing}
                    </>
                  ) : (
                    t.submit
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isSendToAnotherDoctorModalOpen}
            onOpenChange={setIsSendToAnotherDoctorModalOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">
                  {t.sendToAnotherDoctor}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select
                  onValueChange={(value) =>
                    setSelectedHospitalId(Number(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectHospital} />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitals.map((hospital) => (
                      <SelectItem
                        key={hospital.id}
                        value={hospital.id.toString()}
                      >
                        {hospital.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedHospitalId && (
                  <Select
                    onValueChange={(value) =>
                      setSelectedDoctorId(Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectDoctor} />
                    </SelectTrigger>
                    <SelectContent>
                      {hospitals
                        .find((hospital) => hospital.id === selectedHospitalId)
                        ?.doctors.map((doctor) => (
                          <SelectItem
                            key={doctor.id}
                            value={doctor.id.toString()}
                          >
                            {doctor.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}

                <Select onValueChange={(value) => setServiceType(value)}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        language === "ar"
                          ? "اختر نوع الخدمة"
                          : "Select Service Type"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Shelter">
                      {language === "ar" ? "مأوى" : "Shelter"}
                    </SelectItem>
                    <SelectItem value="Shelter_Operation">
                      {language === "ar" ? "عملية مأوى" : "Shelter Operation"}
                    </SelectItem>
                    <SelectItem value="Operation">
                      {language === "ar" ? "عملية" : "Operation"}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Additional Notes"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />

                <Button
                  onClick={handleSendToAnotherDoctorSubmit}
                  className="w-full"
                  disabled={
                    isProcessing ||
                    !selectedHospitalId ||
                    !selectedDoctorId ||
                    !serviceType
                  }
                >
                  {isProcessing ? (
                    <>
                      <ClipLoader size={20} color="#ffffff" className="mr-2" />
                      {t.processing}
                    </>
                  ) : (
                    t.submit
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePreviousPage}
                  //@ts-ignore
                  disabled={page === 1}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => setPage(pageNumber)}
                      className={
                        page === pageNumber ? "bg-blue-500 text-white" : ""
                      }
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={handleNextPage}
                  //@ts-ignore
                  disabled={page >= totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
};

export default Planner;
