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

type PaymentMethod = {
  id: number;
  name: string;
  name_en: string;
  image: string;
  word: string;
};

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
  endTime: string;
  medical_organizations: { id: number; name: string };
  paymentMethod: PaymentMethod | undefined | null;
  payement: string;
  formData: any;
  familymember: boolean;
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
  endTime,
  medical_organizations,
  paymentMethod,
  payement,
  formData,
  familymember,
  id,
}) => {
  const [profileData, setProfileData] = useState({
    user: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
    gender: "",
    service_country: 0,
    birthday: "",
    city: 0,
    user_type: 0,
    address: "",
  });

  console.log("medical_organizations", medical_organizations);
  console.log("paymentMethod", paymentMethod);

  const [language, setLanguage] = useState<Language>("ar");
  const [confirmModal, setConfirmModal] = useState(false);
  const [processID, setProcessID] = useState("");
  const [amount, setAmount] = useState(0);
  const [otpCode, setOtpCode] = useState("");
  const [payementID, setPayementId] = useState("");
  const [url, setUrl] = useState("");

  console.log("this is the payment method", payement);

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
        console.log("datadata", data);
        setProfileData({
          user: {
            first_name: data.user?.first_name || "",
            last_name: data.user?.last_name || "",
            email: data.user?.email || "",
            phone: data.user?.phone || "",
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

  console.log("formDataAcceptAppointement", formData);
  console.log("familymember", familymember);

  const t = translations[language]; // Choose translation based on selected language

  const organizationId =
    Array.isArray(medical_organizations) && medical_organizations.length > 0
      ? medical_organizations[0].id
      : 0;

  const handleCreateAppointment = async () => {
    const token = localStorage.getItem("access"); // Get the access token from localStorage

    if (!token) {
      console.error("No access token found");
      return;
    }

    console.log("day", day);
    console.log("time", time);
    console.log("endTime", endTime);

    // Convert the day and time to ISO 8601 format
    const [dayPart, monthPart, yearPart] = day.split("/"); // Split day into DD/MM/YYYY
    const formattedDate = `${yearPart}-${monthPart}-${dayPart}`; // Rearrange to YYYY-MM-DD
    const reservationDate = `${formattedDate}T${time}:00Z`; // Combine date and time into ISO format
    const formattedStartTime = `${time}:00`;
    const formattedEndTime = `${endTime}:00`;
    // Prepare the payload for the API
    const newAppointment = {
      reservation: {
        patient: {
          first_name:
            familymember === true
              ? formData.first_name
              : profileData.user.first_name,
          last_name:
            familymember === true
              ? formData.last_name
              : profileData.user.last_name,
          relative: familymember === true ? formData.relative : "",
          phone:
            familymember === true ? formData.phone : profileData.user.phone,
          email:
            familymember === true ? formData.email : profileData.user.email,
          city: familymember === true ? formData.city : profileData.city || 2,
          address:
            familymember === true ? formData.address : profileData.address,
        },
        reservation_date: formattedDate, // Use correctly formatted ISO 8601 date
        start_time: formattedStartTime,
        end_time: formattedEndTime,
      },
      medical_organizations: organizationId || 0,
      //confirmation_code: "CONFIRM123", // Replace with actual confirmation code if needed
      doctor: id, // Replace with the actual doctor ID
      price: price,
      pay_full_amount: payement === "full" ? true : false,
      payment: {
        //payment_method: paymentMethod?.word,
        mobile_number: "0913632323",
        birth_year: 1990,
      },
    };

    try {
      // Send a POST request to your backend
      const response = await fetch("/api/appointements/createAppointement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(newAppointment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error reserving appointment:", errorData);
        alert("Failed to book the appointment.");
        return;
      }

      const responseData = await response.json();
      console.log("Reservation successful:", responseData);
      console.log(
        "testing url",
        responseData.payment_confirmation.result.redirect_url
      );
      // Handle response based on the payment method
      if (
        paymentMethod?.word?.toLowerCase() === "sadad" ||
        paymentMethod?.word?.toLowerCase() === "adfali"
      ) {
        // Assuming the 'payment_confirmation' has necessary details
        if (responseData.payment_confirmation) {
          console.log(
            "Payment Confirmation:",
            responseData.payment_confirmation
          );

          // You can process the payment confirmation here
          setProcessID(responseData.payment_confirmation.result.process_id);
          setAmount(responseData.payment_confirmation.result.amount);
          setPayementId(responseData.reservation_invoice_detail_id);
          setConfirmModal(true);
          setUrl(responseData.payment_confirmation.result.redirect_url);
        }
      } else if (paymentMethod?.word?.toLowerCase() === "local bank card") {
        // Redirect for local bank card payment
        console.log(
          "url2",
          responseData.payment_confirmation.result.redirect_url
        );
        window.location.href =
          responseData.payment_confirmation.result.redirect_url;
      } else {
        // Default redirect
        window.location.href = "/appointments";
      }
    } catch (error) {
      console.error("Error booking the appointment:", error);
      alert("An error occurred while booking the appointment.");
    }
  };

  const handleOtpSubmit = async () => {
    const confirmUrl = `https://test-roshita.net/api/user-appointment-reservations/confirm-payment/${payementID}/`;
    const token = localStorage.getItem("access");
    const requestBody = {
      process_id: `${processID}`,
      code: `${otpCode}`,
      //amount: `${amount}`,
    };

    console.log("resquestBody", requestBody);

    try {
      const response = await fetch(confirmUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error confirming payment:", errorData);
        alert("Failed to confirm payment.");
        return;
      }

      const responseData = await response.json();
      console.log("Payment confirmation successful:", responseData);
      window.location.href = "/appointments";
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("An error occurred while confirming the payment.");
    }
  };

  return (
    <div>
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
                  {familymember === true
                    ? formData.first_name
                    : profileData.user.first_name || "admin"}
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
                    defaultValue={`${time} - ${endTime}`}
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
      {/* OTP Modal */}
      <Dialog open={confirmModal} onOpenChange={setConfirmModal}>
        <DialogContent className="sm:max-w-[625px] h-full">
          <DialogHeader>
            <DialogTitle className="text-center">
              {t.confirmBooking}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t.appointmentSuccess}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="otpCode">OTP Code</Label>
              <Input
                id="otpCode"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter OTP"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleOtpSubmit}
              className="p-4 bg-roshitaBlue rounded text-white font-bold"
            >
              {t.confirmBooking}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
