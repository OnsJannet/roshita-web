import React, { useState, useEffect, ReactNode } from "react";
import { startOfWeek, format } from "date-fns";
import { Button } from "@/components/ui/button";
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

const PlannerDoctorAll = ({ language = "en" }: { language?: string }) => {
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
  const APPOINTMENTS_PER_PAGE = 5;
  const paginatedAppointments = appointments.slice(
    (page - 1) * APPOINTMENTS_PER_PAGE,
    page * APPOINTMENTS_PER_PAGE
  );

  console.log("paginatedAppointments", paginatedAppointments);

  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        const token = localStorage.getItem("access");
        const id = localStorage.getItem("userId");
        if (!token) {
          console.error("No access token found in localStorage");
          return;
        }

        let allAppointments: Appointment[] = [];
        let nextPage = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await fetch(
            `${API_URL}search/?page=${nextPage}&doctor_id=${id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) throw new Error("Failed to fetch appointments");

          const data = await response.json();
          console.log("data", data);
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
          .sort((a, b) => {
            const dateA = new Date(a.reservation.reservation_date);
            const dateB = new Date(b.reservation.reservation_date);
            //@ts-ignore
            return dateA - dateB;
          });

        setAppointments(filteredAppointments);
        setTotalPages(
          Math.ceil(filteredAppointments.length / APPOINTMENTS_PER_PAGE)
        );
      } catch (error) {
        console.error("Error fetching appointments:", error);
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
        //@ts-ignore
        setError(err.message);
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
    }
  };

  useEffect(() => {
    const fetchDoctorAndSpecialty = async () => {
      const accessToken = localStorage.getItem("access");
      const doctorId = localStorage.getItem("userId");
      try {
        const response = await fetch(
          `/api/doctors/getDoctorById?id=${doctorId}`,
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
        setLoading(false);
      }
    };

    fetchDoctorAndSpecialty();
  }, [appointmentDoctorId]);

  const handleSameDoctorFollowUp = async (appointmentId: number) => {
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
  };

  const handleSlotSelection = (slot: AppointmentSlot) => {
    setSelectedSlot(slot);
  };

  const handleSameDoctorFollowUpSubmit = async () => {
    if (!selectedSlot) {
      alert("Please select a slot.");
      return;
    }

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
      console.log("Follow-up request successful:", data);
    } catch (error) {
      console.error("Error:", error);
      //@ts-ignore
      setFollowUpError(error);
      setIsModalOpen(false);
      setIsFollowUpModalOpen(false);
      setIsSameDoctorModalOpen(false);
      setIsSendToAnotherDoctorModalOpen(false);
    }
  };

  console.log("isModalOpen", isModalOpen);
  console.log("isFollowUpModalOpen", isFollowUpModalOpen);
  console.log("isSameDoctorModalOpen", isSameDoctorModalOpen);
  console.log("isSendToAnotherDoctorModalOpen", isSendToAnotherDoctorModalOpen);

  const handleSendToAnotherDoctorSubmit = async () => {
    /*if (!selectedHospitalId || !selectedDoctorId || !selectedAppointmentId) {
      alert("Please select a hospital, a doctor, and an appointment.");
      return;
    }*/

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
      console.log("Doctor suggestion created successfully:", data);
      setIsSendToAnotherDoctorModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
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
    },
  };
  //@ts-ignore
  const t = translations[language];

  const handleRemoveSlot = async (index: number) => {
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
        await logAction(
          token,
          `https://test-roshita.net/api/appointment-reservations/${index}/`,
          { appointmentId: index },
          "success",
          response.status
        );
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
          //@ts-ignore
          error.response?.status || 500,
          //@ts-ignore
          error.message || "An unknown error occurred"
        );
      }
    }
  };

  const handleEndSlot = async (index: number) => {
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

      const responseData = await response.json();
      console.log("Success:", responseData);
    } catch (error) {
      if (token) {
        await logAction(
          token,
          url,
          { appointmentId: index },
          "error",
          //@ts-ignore
          error.response?.status || 500,
          //@ts-ignore
          error.message || "An unknown error occurred"
        );
      }
      console.error("Error:", error);
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
    //@ts-ignore
    setPatientId(appointmentReservationId);
    //@ts-ignore
    setAppointmentDoctorId(appointmentDoctorId);
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
    console.log(
      "Send to Another Doctor for appointment:",
      selectedAppointmentId
    );
    setIsFollowUpModalOpen(false);
  };

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePreviousPage = () => setPage((prev) => Math.max(1, prev - 1));

  const disableNextPage = page >= totalPages
  const disablePreviousPage = page === 1


  return (
    <div
      className="p-4 border rounded-md shadow"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
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
                    <Button variant="outline" className="mr-2 gap-4">
                      {t.noShow}
                    </Button>
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() =>
                        handleDoneClick(
                          appointment.id,
                          //@ts-ignore
                          appointment.reservation.patient.id,
                          appointment.confirmation_code,
                          appointment.doctor.id
                        )
                      }
                    >
                      {t.done}
                    </Button>
                    <Button
                      className="mr-2"
                      variant="outline"
                      onClick={() => handleRemoveSlot(appointment.id)}
                    >
                      {t.cancel}
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
            <Button onClick={handleEndAppointment}>{t.endAppointment}</Button>
            <Button onClick={handleFollowUpAppointment}>
              {t.followUpAppointment}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isFollowUpModalOpen} onOpenChange={setIsFollowUpModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              {t.followUpAppointment}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => handleSameDoctorFollowUp(selectedAppointmentId!)}
            >
              {t.sameDoctorFollowUp}
            </Button>
            <Button onClick={() => setIsSendToAnotherDoctorModalOpen(true)}>
              {t.sendToAnotherDoctor}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for Same Doctor Follow-Up */}
      <Dialog
        open={isSameDoctorModalOpen}
        onOpenChange={setIsSameDoctorModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              {t.sameDoctorFollowUp}{" "}
              {/* Title for the same doctor follow-up modal */}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {doctorInfo?.appointments?.map((slot, index) => (
              <Button
                key={slot.id || index}
                onClick={() => {
                  handleSlotSelection(slot); // Handle slot selection
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  setSelectedSlot(slot.id); // Set the selected slot ID
                }}
                className={`w-full px-4 py-2 rounded ${
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  selectedSlot === slot.id ? "bg-gray-400" : "bg-gray-200" // Highlight selected slot
                } text-black hover:bg-gray-300 transition-colors`}
              >
                {slot.scheduled_date} - {slot.start_time} to {slot.end_time}{" "}
                {/* Display slot details */}
              </Button>
            ))}
            <Button onClick={handleSameDoctorFollowUpSubmit} className="w-full">
              {t.submit}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for Sending to Another Doctor */}
      <Dialog
        open={isSendToAnotherDoctorModalOpen}
        onOpenChange={setIsSendToAnotherDoctorModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              {t.sendToAnotherDoctor}{" "}
              {/* Title for the send to another doctor modal */}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Hospital Selection Dropdown */}
            <Select
              onValueChange={(value) => setSelectedHospitalId(Number(value))} // Set selected hospital ID
            >
              <SelectTrigger>
                <SelectValue placeholder={t.selectHospital} />{" "}
                {/* Placeholder for hospital selection */}
              </SelectTrigger>
              <SelectContent>
                {hospitals.map((hospital) => (
                  <SelectItem key={hospital.id} value={hospital.id.toString()}>
                    {hospital.name} {/* Display hospital names */}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Doctor Selection Dropdown (only shown if a hospital is selected) */}
            {selectedHospitalId && (
              <Select
                onValueChange={(value) => setSelectedDoctorId(Number(value))} // Set selected doctor ID
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.selectDoctor} />{" "}
                  {/* Placeholder for doctor selection */}
                </SelectTrigger>
                <SelectContent>
                  {hospitals
                    .find((hospital) => hospital.id === selectedHospitalId)
                    ?.doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        {doctor.name} {/* Display doctor names */}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}

            {/* Service Type Selection Dropdown */}
            <Select
              onValueChange={(value) => setServiceType(value)} // Set the selected service type
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    language === "ar"
                      ? "اختر نوع الخدمة"
                      : "Select Service Type" // Placeholder for service type selection
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Shelter">
                  {language === "ar" ? "مأوى" : "Shelter"}{" "}
                  {/* Shelter option */}
                </SelectItem>
                <SelectItem value="Shelter Operation">
                  {language === "ar" ? "عملية مأوى" : "Shelter Operation"}{" "}
                  {/* Shelter Operation option */}
                </SelectItem>
                <SelectItem value="Operation">
                  {language === "ar" ? "عملية" : "Operation"}{" "}
                  {/* Operation option */}
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Additional Notes Input */}
            <Input
              placeholder="Additional Notes" // Placeholder for additional notes
              value={note}
              onChange={(e) => setNote(e.target.value)} // Handle note input change
            />

            {/* Submit Button for Sending to Another Doctor */}
            <Button
              onClick={handleSendToAnotherDoctorSubmit}
              className="w-full"
            >
              {t.submit} {/* Submit button for sending to another doctor */}
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
              disabled={disablePreviousPage}
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
              disabled={disableNextPage}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PlannerDoctorAll;
