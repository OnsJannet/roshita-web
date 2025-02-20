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
    scheduled_date: string;
    start_time: string;
    end_time: string;
    appointment_status: string;
    price: string;
  }[];
}

export function ConsultationTransfer({
  isOpen,
  onClose,
  language,
}: ConsultationTransferProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null); // Track selected doctor

  const limit = 5;

  const content = {
    title: language === "ar" ? "تحويل الاستشارة" : "Transfer Consultation",
    submitButton: language === "ar" ? "إرسال" : "Submit",
  };

  //@ts-ignore
  function handleAppointmentClick(appointment) {
    console.log(appointment);
  }

  const direction = language === "ar" ? "rtl" : "ltr";

  // Utility function to group appointments by date
  const groupAppointmentsByDate = (appointments: Doctor["appointments"]) => {
    return appointments.reduce((acc, appointment) => {
      const date = appointment.scheduled_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(appointment);
      return acc;
    }, {} as Record<string, Doctor["appointments"]>);
  };

  const fetchDoctors = async (pageNumber: number) => {
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
        `/api/doctors/getDoctors?page=${pageNumber}&limit=${limit}`,
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
        setDoctors((prev) => [...prev, ...data.data]);
        setTotalPages(calculatedTotalPages);
        setHasMore(pageNumber < calculatedTotalPages);
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

  // Open modal with appointments for the selected doctor
  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  // Close the appointments modal
  const closeAppointmentsModal = () => {
    setSelectedDoctor(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          dir={direction}
          className={`max-w-[1200px] ${
            language === "ar" ? "text-right h-[80vh]" : "text-left h-[80vh]"
          } py-4 `}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {content.title}
            </DialogTitle>
          </DialogHeader>

          <div className="">
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
              <Carousel className="w-full max-w-[1100px] relative ">
                <CarouselContent>
                  {doctors.map((doctor) => (
                    <CarouselItem
                      key={doctor.id}
                      className="md:basis-1/2 lg:basis-1/5"
                    >
                      <div className="p-1">
                        <Card
                          onClick={() => handleDoctorClick(doctor)} // Open modal on click
                          className="cursor-pointer" // Add pointer cursor
                        >
                          <CardContent className="aspect-square items-center justify-center p-6">
                            <div className="flex justify-center">
                              <img
                                src={
                                  doctor.staff.staff_avatar &&
                                  !doctor.staff.staff_avatar.startsWith(
                                    "/media/media/"
                                  ) &&
                                  !doctor.staff.staff_avatar.startsWith(
                                    "/avatar/"
                                  )
                                    ? doctor.staff.staff_avatar
                                    : "/Images/default-doctor.jpeg"
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

                {loading && <p className="text-center p-2">Loading...</p>}
                {!hasMore && doctors.length > 0 && (
                  <p className="text-center p-2">No more doctors</p>
                )}

                <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10">
                  <CarouselPrevious onClick={handlePrevious} />
                </div>
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10">
                  <CarouselNext onClick={handleNext} />
                </div>
              </Carousel>
            </div>

            <div className="flex justify-center items-center mt-6 ">
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
          className={`max-w-[800px] ${
            language === "ar" ? "text-right" : "text-left"
          } py-4 overflow-y-auto`}
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
                    selectedDoctor.staff.staff_avatar &&
                    !selectedDoctor.staff.staff_avatar.startsWith(
                      "/media/media/"
                    ) &&
                    !selectedDoctor.staff.staff_avatar.startsWith("/avatar/")
                      ? selectedDoctor.staff.staff_avatar
                      : "/Images/default-doctor.jpeg"
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
  {selectedDoctor.appointments.length > 0 ? (
    Object.entries(groupAppointmentsByDate(selectedDoctor.appointments)).map(
      ([date, appointments]) => (
        <div key={date} className="mb-4">
          <p className="font-semibold text-lg text-center">{date}</p>
          <div className="grid grid-cols-1 gap-2">
            {appointments.map((appointment, index) => (
              <button
                key={index}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm text-center"
                onClick={() => handleAppointmentClick(appointment)}
              >
                {appointment.start_time} - {appointment.end_time}
              </button>
            ))}
          </div>
        </div>
      )
    )
  ) : (
    <p className="text-center col-span-4">
      {language === "ar" ? "لا توجد مواعيد" : "No appointments"}
    </p>
  )}
</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}