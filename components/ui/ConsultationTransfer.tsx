import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ConsultationTransferProps {
  isOpen: boolean;
  onClose: () => void;
  language: "ar" | "en";
  consultationID: string;
}

interface Doctor {
  id: number;
  staff: {
    first_name: string;
    last_name: string;
    staff_avatar: string;
  };
  specialty: {
    name: string;
    foreign_name: string;
  };
  appointments: {
    id: number;
    scheduled_date: string;
    start_time: string;
    end_time: string;
    appointment_status: string;
    price: string;
    consultationID: string;
  }[];
}

export function ConsultationTransfer({
  isOpen,
  onClose,
  language,
  consultationID,
}: ConsultationTransferProps) {
  // Add error state
  const [error, setError] = useState<string | null>(null);
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Doctor["appointments"][0] | null>(null);

  const limit = 5;

  const content = {
    title: language === "ar" ? "تحويل الاستشارة" : "Transfer Consultation",
    submitButton: language === "ar" ? "إرسال" : "Submit",
  };

  const direction = language === "ar" ? "rtl" : "ltr";

  const groupAppointmentsByDate = (appointments: Doctor["appointments"]) => {
    if (!appointments || appointments.length === 0) {
      return {};
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    // First, group appointments by date
    const grouped = appointments.reduce((acc, appointment) => {
      const appointmentDate = new Date(appointment.scheduled_date);
      appointmentDate.setHours(0, 0, 0, 0); // Reset time to start of day

      // Only include appointments from today onwards
      if (appointmentDate >= today) {
        const date = appointment.scheduled_date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(appointment);
      }
      return acc;
    }, {} as Record<string, Doctor["appointments"]>);

    // Sort dates chronologically
    const sortedDates = Object.keys(grouped).sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    );

    // For each date, sort appointments by time
    const sortedGrouped = sortedDates.reduce((acc, date) => {
      acc[date] = grouped[date].sort((a, b) => 
        a.start_time.localeCompare(b.start_time)
      );
      return acc;
    }, {} as Record<string, Doctor["appointments"]>);

    return sortedGrouped;
  };

  const fetchDoctors = async (page: number) => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access");

      if (!accessToken) {
        console.error("Access token not found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `/api/doctors/getDoctors?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch doctors:", data.error);
        setLoading(false);
        return;
      }

      if (data.success && Array.isArray(data.data)) {
        const total = data.total || 0;
        const calculatedTotalPages = Math.ceil(total / limit);

        setDoctors(data.data);
        setTotalPages(calculatedTotalPages);
        setHasMore(page < calculatedTotalPages);
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(page);
  }, [page]);

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleDoctorClick = (doctor: Doctor) => {
    console.log("doctor", doctor)
    setSelectedDoctor(doctor);
    setSelectedAppointment(null);
  };

  const closeAppointmentsModal = () => {
    setSelectedDoctor(null);
    setSelectedAppointment(null);
  };

  const handleAppointmentClick = (appointment: Doctor["appointments"][0]) => {
    console.log("apointmenet picked", appointment)
    setSelectedAppointment(appointment);
  };

  const handleAcceptAppointment = async () => {
    if (!selectedDoctor || !selectedAppointment) return;
    setError(null); // Clear previous errors

    try {
      const accessToken = localStorage.getItem("access");

      if (!accessToken) {
        setError(language === "ar" ? "لم يتم العثور على رمز الوصول" : "Access token not found");
        return;
      }

      const response = await fetch(
        `http://test-roshita.net/api/accept-consultations/${consultationID}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            doctor_id: selectedDoctor.id,
            doctor_appointment_date_id: selectedAppointment.id,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setError(language === "ar" 
          ? `فشل في قبول الموعد: ${data.detail || data.message || 'حدث خطأ'}`
          : `Failed to accept appointment: ${data.detail || data.message || 'An error occurred'}`
        );
        return;
      }
      closeAppointmentsModal();
      window.location.reload();
    } catch (error) {
      setError(language === "ar"
        ? "حدث خطأ أثناء معالجة الطلب"
        : "An error occurred while processing the request"
      );
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          dir={direction}
          className={`max-w-[1200px] ${
            language === "ar" ? "text-right h-[80vh]" : "text-left h-[80vh]"
          } py-4`}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {content.title}
            </DialogTitle>
          </DialogHeader>

          {/* Add error display */}
          {error && (
            <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 ${
              language === "ar" ? "text-end" : "text-start"
            }`}>
              <strong className="font-bold mr-2">
                {language === "ar" ? "خطأ!" : "Error!"}
              </strong>
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

          <div>
            <div className="text-center">
              <p
                dir={direction}
                className={`w-full ${
                  language === "ar" ? "text-center" : "text-center"
                } py-4`}
              >
                {language === "ar"
                  ? "تحويل الاستشارة يتيح لك إحالة المريض إلى أخصائي أو طبيب آخر. يضمن ذلك حصول المريض على الرعاية الأنسب بناءً على حالته. اختر الطبيب المطلوب من القائمة أدناه وقم بإرسال طلبك."
                  : "Transferring a consultation allows you to redirect a patient to another specialist or doctor. This ensures that the patient receives the most suitable care based on their condition. Select the desired doctor from the list below and submit your request."}
              </p>
            </div>

            <div className="flex justify-center">
              {doctors.length === 0 && !loading && (
                <p className="text-center p-2">No doctors found</p>
              )}
              <Carousel className="w-full max-w-[1100px] relative">
                <CarouselContent>
                  {doctors.map((doctor) => (
                    <CarouselItem
                      key={doctor.id}
                      className="md:basis-1/2 lg:basis-1/5"
                    >
                      <div className="p-1">
                        <Card
                          onClick={() => handleDoctorClick(doctor)}
                          className="cursor-pointer relative"
                        >
                          <CardContent className="aspect-square items-center justify-center p-6">
                            {error && doctor.id === selectedDoctor?.id && (
                              <div className={`absolute top-0 left-0 right-0 bg-red-100 border-b border-red-400 text-red-700 px-3 py-2 text-sm ${
                                language === "ar" ? "text-end" : "text-start"
                              }`}>
                                <span className="block">{error}</span>
                              </div>
                            )}
                            <div className="flex justify-center">
                              <img
                                src={
                                  doctor.staff.staff_avatar ||
                                  "/Images/default-doctor.jpeg"
                                }
                                alt={`${doctor.staff.first_name} ${doctor.staff.last_name}`}
                                className="w-20 h-20 rounded-full object-cover"
                              />
                            </div>
                            <div className="mt-2 text-center">
                              <span className="font-semibold">
                                {doctor.staff.first_name} {doctor.staff.last_name}
                              </span>
                            </div>
                            <div className="mt-2 text-center">
                              <span className="font-regular">
                                {language === "ar"
                                  ? doctor.specialty.name
                                  : doctor.specialty.foreign_name}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10">
                  <CarouselPrevious
                    onClick={handlePrevious}
                    disabled={page === 1} // Disable Previous button on the first page
                  />
                </div>
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10">
                  <CarouselNext
                    onClick={handleNext}
                    disabled={page >= totalPages} // Disable Next button on the last page
                  />
                </div>
              </Carousel>
            </div>

            <div className="flex justify-center items-center mt-6">
              <Button type="submit" className="bg-[#1588C8] text-white w-1/2 h-10">
                {content.submitButton}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal for displaying appointments */}
      <Dialog open={!!selectedDoctor} onOpenChange={closeAppointmentsModal}>
  <DialogContent
    dir={direction}
    className={`max-w-[1200px] ${
      language === "ar" ? "text-right h-[80vh]" : "text-left h-[80vh]"
    } py-4 overflow-y-auto`} // Added overflow-y-auto here
  >
    <DialogHeader>
      <DialogTitle className="text-center text-2xl">
        {language === "ar" ? "مواعيد الطبيب" : "Doctor Appointments"}
      </DialogTitle>
    </DialogHeader>
    {selectedDoctor && (
      <div>
        <div className="text-center">
          <img
            src={
              selectedDoctor.staff.staff_avatar ||
              "/Images/default-doctor.jpeg"
            }
            alt={`${selectedDoctor.staff.first_name} ${selectedDoctor.staff.last_name}`}
            className="w-20 h-20 rounded-full object-cover mx-auto"
          />
          <p className="font-semibold mt-2">
            {selectedDoctor.staff.first_name} {selectedDoctor.staff.last_name}
          </p>
          <p className="text-sm text-gray-600">
            {language === "ar"
              ? selectedDoctor.specialty.name
              : selectedDoctor.specialty.foreign_name}
          </p>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4">
          {selectedDoctor.appointments && selectedDoctor.appointments.length > 0 ? (
            Object.entries(groupAppointmentsByDate(selectedDoctor.appointments)).map(
              ([date, appointments]) => {
                // Filter to only show available appointments
                const availableAppointments = appointments.filter(
                  app => app.appointment_status === "available"
                );
                
                if (availableAppointments.length === 0) return null;
                
                return (
                  <div key={date} className="mb-4">
                    <p className="font-semibold text-lg text-center">{date}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {availableAppointments.map((appointment, index) => (
                        <button
                          key={index}
                          className={`p-2 rounded-lg text-sm text-center ${
                            selectedAppointment?.id === appointment.id
                              ? "bg-[#1588C8] text-white"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                          onClick={() => handleAppointmentClick(appointment)}
                        >
                          {appointment.start_time} - {appointment.end_time}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }
            ).filter(Boolean) // Remove null entries for dates with no available appointments
          ) : (
            <p className="text-center col-span-4">
              {language === "ar" ? "لا توجد مواعيد" : "No appointments"}
            </p>
          )}
        </div>
        {selectedAppointment && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => handleAcceptAppointment()}
              className="bg-[#1588C8] text-white"
            >
              {language === "ar" ? "قبول الموعد" : "Accept Appointment"}
            </Button>
          </div>
        )}
      </div>
    )}
  </DialogContent>
</Dialog>
    </>
  );
}