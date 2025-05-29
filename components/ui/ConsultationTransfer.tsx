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
import { CircleCheck } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Doctor["appointments"][0] | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transferredDoctorName, setTransferredDoctorName] = useState("");

  const limit = 5;

  const content = {
    title: language === "ar" ? "تحويل الاستشارة" : "Transfer Consultation",
    submitButton: language === "ar" ? "إرسال" : "Submit",
    selectButton: language === "ar" ? "اختيار" : "Select",
    successTitle: language === "ar" ? "تم التحويل بنجاح" : "Transfer Successful",
    successMessage: (doctorName: string) => 
      language === "ar" 
        ? `تم تحويل الاستشارة بنجاح إلى الدكتور ${doctorName}`
        : `Consultation successfully transferred to Dr. ${doctorName}`,
    closeButton: language === "ar" ? "إغلاق" : "Close"
  };

  const direction = language === "ar" ? "rtl" : "ltr";

  const groupAppointmentsByDate = (appointments: Doctor["appointments"]) => {
    if (!appointments || appointments.length === 0) {
      return {};
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const grouped = appointments.reduce((acc, appointment) => {
      const appointmentDate = new Date(appointment.scheduled_date);
      appointmentDate.setHours(0, 0, 0, 0);

      if (appointmentDate >= today) {
        const date = appointment.scheduled_date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(appointment);
      }
      return acc;
    }, {} as Record<string, Doctor["appointments"]>);

    const sortedDates = Object.keys(grouped).sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    );

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
    console.log("doctor selected", doctor);
    setSelectedDoctor(doctor);
  };

  const closeAppointmentsModal = () => {
    setSelectedDoctor(null);
    setSelectedAppointment(null);
  };

  const handleTransferConsultation = async (doctorToTransfer?: Doctor | null) => {
    const doctor = doctorToTransfer || selectedDoctor;
    if (!doctor) {
        setError(language === "ar" ? "يرجى اختيار طبيب أولاً" : "Please select a doctor first");
        return;
    }
    setError(null);

    try {
      const accessToken = localStorage.getItem("access");

      if (!accessToken) {
        setError(language === "ar" ? "لم يتم العثور على رمز الوصول" : "Access token not found");
        return;
      }

      const response = await fetch(
        `https://test-roshita.net/api/accept-second-opinion/${consultationID}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            doctor_id: doctor.id,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setError(language === "ar" 
          ? `فشل في تحويل الاستشارة: ${data.detail || data.message || 'حدث خطأ'}`
          : `Failed to transfer consultation: ${data.detail || data.message || 'An error occurred'}`
        );
        return;
      }
      
      // Set the doctor name for the success modal
      const doctorName = language === "ar" 
        ? `${doctor.staff.first_name} ${doctor.staff.last_name}`
        : `${doctor.staff.first_name} ${doctor.staff.last_name}`;
      
      setTransferredDoctorName(doctorName);
      setShowSuccessModal(true);
      
      // Close the transfer dialog
      onClose();
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
                  ? "تحويل الاستشارة يتيح لك إحالة المريض إلى أخصائي أو طبيب آخر. يضمن ذلك حصول المريض على الرعاية الأنسب بناءً على حالته. اختر الطبيب المطلوب من القائمة أدناه ثم اضغط على زر الاختيار."
                  : "Transferring a consultation allows you to redirect a patient to another specialist or doctor. This ensures that the patient receives the most suitable care based on their condition. Select the desired doctor from the list below and then click the select button."}
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
                          className={`cursor-pointer relative ${
                            selectedDoctor?.id === doctor.id ? "border-2 border-[#1588C8]" : "border"
                          }`}
                        >
                          <CardContent className="aspect-square items-center justify-center p-6">
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
                    disabled={page === 1}
                  />
                </div>
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10">
                  <CarouselNext
                    onClick={handleNext}
                    disabled={page >= totalPages}
                  />
                </div>
              </Carousel>
            </div>

            <div className="flex justify-center items-center mt-6">
              <Button 
                onClick={() => handleTransferConsultation()} 
                className="bg-[#1588C8] text-white w-1/2 h-10"
                disabled={!selectedDoctor || loading}
              >
                {content.selectButton}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent
          dir={direction}
          className="max-w-[500px] text-center"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl text-green-600 text-center">
            <div className="flex justify-center">
            <CircleCheck className="h-12 w-12 text-green-500" />
            </div>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg">
              {content.successMessage(transferredDoctorName)}
            </p>
          </div>
          <div className="flex justify-center">
            <Button 
              onClick={() => {
                setShowSuccessModal(false);
                window.location.reload();
              }}
              className="bg-[#1588C8] text-white"
            >
              {content.closeButton}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}