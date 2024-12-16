import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchProfileDetails } from "@/lib/api";
import { CircleCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

type DoctorCardAppointmentProps = {
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  price: string;
  location: string;
  imageUrl: string;
  id: number;
  day: string;
  time: string;
};

type Language = "ar" | "en";

const translations = {
  ar: {
    confirmBooking: "تأكيد حجــز",
    appointmentSuccess: "تــم تسجيــــل الموعد بنجاح",
    user: "مستخـــــدم",
    appointmentDetails: "بيـــــانات الحجــــز",
    doctorName: "اسم الدكتــور",
    specialty: "التخصص",
    date: "التاريخ",
    time: "الساعة",
    myAppointments: "مواعيــــدي",
  },
  en: {
    confirmBooking: "Confirm Booking",
    appointmentSuccess: "Appointment successfully registered",
    user: "User",
    appointmentDetails: "Appointment Details",
    doctorName: "Doctor's Name",
    specialty: "Specialty",
    date: "Date",
    time: "Time",
    myAppointments: "My Appointments",
  },
};

export const AcceptAppointment: React.FC<DoctorCardAppointmentProps> = ({
  name,
  specialty,
  rating,
  reviewsCount,
  price,
  location,
  imageUrl,
  day,
  time,
}) => {
  const [profileData, setProfileData] = useState({
    user: {
      first_name: "",
      last_name: "",
      email: "",
    },
    gender: "",
    service_country: 0,
    birthday: "",
    city: 0,
    user_type: 0,
    address: "",
  });

  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await fetchProfileDetails();
        setProfileData({
          user: {
            first_name: data.user?.first_name || "",
            last_name: data.user?.last_name || "",
            email: data.user?.email || "",
          },
          gender: data.gender || "",
          service_country: data.service_country || 0,
          birthday: data.birthday || "",
          city: data.city || 0,
          user_type: data.user_type || 0,
          address: data.address || "",
        });
      } catch (error) {
        console.error("Error loading profile data", error);
      }
    };

    loadProfileData();
  }, []);

  const handleCreateAppointment = () => {
    const newAppointment = {
      appointmentDate: new Date().toLocaleDateString(),
      imageUrl: imageUrl,
      doctorName: name,
      specialty: specialty,
      price: price,
      time: time,
      day: day,
    };

    const existingAppointments = JSON.parse(
      localStorage.getItem("appointments") || "[]"
    );
    existingAppointments.push(newAppointment);
    localStorage.setItem("appointments", JSON.stringify(existingAppointments));
    window.location.href = "/appointments";
  };

  const t = translations[language]; // Choose translation based on selected language

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="p-4 bg-roshitaBlue rounded text-white !text-center font-bold flex justify-center mt-4">
          {t.confirmBooking}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            <CircleCheck className="h-40 w-40 text-white fill-roshitaBlue" />
          </DialogTitle>
          <DialogDescription className="text-center">
            {t.appointmentSuccess}
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <div
            className={`flex justify-end items-center gap-8 ${
              language === "en" ? "flex-row-reverse" : ""
            }`}
          >
            <div>
              <p className="font-semibold text-end">
                {profileData.user.first_name || "admin"}
              </p>
              <p className="font-regular text-gray-400">{t.user}</p>
            </div>
            <div className="bg-roshitaBlue rounded-full h-24 w-24 flex justify-center items-center">
              <UserRound className="h-20 w-20 text-white" />
            </div>
          </div>

          <div className="px-6">
            <p
              className={`font-semibold mt-4 text-xl ${
                language === "en" ? "text-start" : "text-end"
              }`}
            >
              {t.appointmentDetails}
            </p>
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`flex items-center gap-4 ${
                  language === "en" ? "flex-row-reverse" : ""
                }`}
              >
                <Input
                  id="name"
                  defaultValue={name}
                  className="flex-1"
                  readOnly
                  disabled
                />
                <Label
                  htmlFor="name"
                  className={`text-${
                    language === "en" ? "left" : "right"
                  } w-40`}
                >
                  {t.doctorName}
                </Label>
              </div>
              <div
                className={`flex items-center gap-4 ${
                  language === "en" ? "flex-row-reverse" : ""
                }`}
              >
                <Input
                  id="specialty"
                  defaultValue={specialty}
                  className="flex-1"
                  readOnly
                  disabled
                />
                <Label
                  htmlFor="specialty"
                  className={`text-${
                    language === "en" ? "left" : "right"
                  } w-40`}
                >
                  {t.specialty}
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`flex items-center gap-4 ${
                  language === "en" ? "flex-row-reverse" : ""
                }`}
              >
                <Input
                  id="day"
                  defaultValue={day}
                  className="flex-1"
                  readOnly
                  disabled
                />
                <Label
                  htmlFor="day"
                  className={`text-${
                    language === "en" ? "left" : "right"
                  } w-40`}
                >
                  {t.date}
                </Label>
              </div>
              <div
                className={`flex items-center gap-4 ${
                  language === "en" ? "flex-row-reverse" : ""
                }`}
              >
                <Input
                  id="time"
                  defaultValue={time}
                  className="flex-1"
                  readOnly
                  disabled
                />
                <Label
                  htmlFor="time"
                  className={`text-${
                    language === "en" ? "left" : "right"
                  } w-40`}
                >
                  {t.time}
                </Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button
              type="button"
              className="bg-roshitaBlue"
              onClick={handleCreateAppointment}
            >
              {t.myAppointments}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
