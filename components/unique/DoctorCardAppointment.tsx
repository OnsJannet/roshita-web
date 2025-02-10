import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Banknote, Calendar, MapPin } from "lucide-react";
import { AcceptAppointment } from "../shared/accpetAppoitment"; // Ensure the path is correct for this import
import { paiement } from "@/constant";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
};

interface City {
  id: number;
  foreign_name: string;
  name: string;
}

type Language = "ar" | "en";

const DoctorCardAppointment: React.FC<DoctorCardAppointmentProps> = ({
  id,
  name,
  specialty,
  price,
  location,
  imageUrl,
  endTime,
  day,
  time,
  medical_organizations,
}) => {
  const [step, setStep] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [language, setLanguage] = useState<Language>("ar");
  const [processId, setProcessId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState<string>("");
  const [selectedPaiementOption, setSelectedPaiementOption] = useState("");
  const [selectedFamilyOption, setSelectedFamilyOption] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    relative: "",
    phone: "",
    email: "",
    city: "",
    address: "",
  });

  const fetchCities = async () => {
    try {
      const response = await fetch("https://test-roshita.net/api/cities-list/");
      const citiesData: City[] = await response.json();
      if (response.ok) {
        setCities(citiesData);
      } else {
        console.error("Error fetching cities");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    setIsModalOpen(false);
    // Add your form submission logic here
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (id: any) => {
    setSelectedPaiementOption(selectedPaiementOption === id ? "" : id); // Toggle selection
  };

  const handleCheckboxFamilyChange = () => {
    setSelectedFamilyOption(!selectedFamilyOption);
    setIsModalOpen(!selectedFamilyOption);
  };

  const handleClick = (id: number) => {
    setSelectedId(id);
  };

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

  const callTransactionAPI = async (
    service: string,
    action: string,
    payload: any
  ) => {
    try {
      const response = await fetch(`/api/transaction?service=${service}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "API request failed");
      return data;
    } catch (error: any) {
      console.error("API error:", error.message);
      alert(error.message);
      return null;
    }
  };

  const handleVerifyTransaction = async () => {
    if (!selectedId) {
      alert(
        language === "en"
          ? "Please select a payment method"
          : "يرجى اختيار طريقة الدفع"
      );
      return;
    }

    const selectedPaymentMethod = paiement.find(
      (option) => option.id === selectedId
    );
    if (selectedPaymentMethod) {
      const verifyPayload = {
        payment_method: selectedPaymentMethod.name,
        mobile_number: "0913632323", // Replace with dynamic user input
        ...(selectedPaymentMethod.name === "sadad" && { birth_year: "1998" }), // Example for Sadad
      };

      const verifyResponse = await callTransactionAPI(
        selectedPaymentMethod.name,
        "verify",
        verifyPayload
      );
      if (verifyResponse?.status === 200) {
        setProcessId(verifyResponse.result.process_id);
        alert(
          language === "en"
            ? "Verification successful! Enter OTP to confirm."
            : "تم التحقق بنجاح! أدخل رمز التحقق للتأكيد."
        );
      }
    }
  };

  const handleConfirmTransaction = async () => {
    if (!processId || !otpCode) {
      alert(
        language === "en"
          ? "Please complete verification and enter the OTP."
          : "يرجى إكمال التحقق وإدخال رمز التحقق."
      );
      return;
    }

    const selectedPaymentMethod = paiement.find(
      (option) => option.id === selectedId
    );
    if (selectedPaymentMethod) {
      const confirmPayload = {
        process_id: processId,
        code: otpCode,
        amount: price, // Ensure this is numeric
      };

      const confirmResponse = await callTransactionAPI(
        selectedPaymentMethod.name,
        "confirm",
        confirmPayload
      );
      if (confirmResponse?.status === 200) {
        alert(language === "en" ? "Payment successful!" : "تم الدفع بنجاح!");
        setStep(3); // Proceed to next step
      }
    }
  };

  return (
    <div className="shadow-lg py-10 mt-2 max-w-[1280px] rounded-2xl">
      {step === 1 && (
        <>
          <h2 className="text-center font-semibold lg:text-4xl text-2xl">
            {language === "en" ? "Booking Confirmation" : "تأكيد الحجز"}
          </h2>
          {/* Right Section: Doctor Info */}
          <div
            className={`flex flex-1 ${
              language === "en" ? "justify-end flex-row-reverse" : "justify-end"
            } gap-4 lg:px-40 lg:py-10 p-4`}
          >
            {/* Doctor's Details */}
            <div
              className={`flex flex-col ${
                language === "en" ? "items-start " : "items-end"
              }`}
            >
              <h1 className="lg:text-2xl text-xl font-bold text-gray-800 mb-1">
                {name}
              </h1>
              <p className="text-sm text-gray-500 mb-2 text-end">{specialty}</p>
              <div
                className={`flex items-center text-sm text-gray-600 mb-1 mt-2 gap-2 ${
                  language === "en" ? "flex-row-reverse" : ""
                }`}
              >
                <span>
                  {language === "en" ? "Price: " : "سعر الكشف: "} {price}
                </span>
                <Banknote className="text-roshitaDarkBlue" />
              </div>

              <div
                className={`flex items-center text-sm text-gray-600 mb-1 mt-2 gap-2 ${
                  language === "en" ? "flex-row-reverse" : ""
                }`}
              >
                <p className="text-sm text-gray-500">
                  {language === "en" ? "Location: " : ""}
                  {location}
                </p>
                <MapPin className="text-roshitaDarkBlue" />
              </div>

              <h1
                className={`lg:text-2xl text-xl font-bold text-gray-800 mb-1 mt-4 flex gap-2 items-center ${
                  language === "en" ? "flex-row-reverse" : ""
                }`}
              >
                {language === "en" ? "Day" : "اليوم"}{" "}
                <Calendar className="text-roshitaDarkBlue w-6 h-6" />
              </h1>

              <p>
                {time} {day}
              </p>

              <div className="flex gap-2">
                {/* Full Payment Option */}
                <div className="flex items-center space-x-2 mt-4 mb-2">
                  <input
                    type="checkbox"
                    id="full"
                    checked={selectedPaiementOption === "full"}
                    onChange={() => handleCheckboxChange("full")}
                    className="w-4 h-4" // Add appropriate styling
                  />
                  <label
                    htmlFor="full"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {language === "en" ? "Pay full amount" : "دفع المبلغ كاملا"}
                  </label>
                </div>

                {/* Roshita Option */}
                <div className="flex items-center space-x-2 mt-4 mb-2">
                  <input
                    type="checkbox"
                    id="roshita"
                    checked={selectedPaiementOption === "roshita"}
                    onChange={() => handleCheckboxChange("roshita")}
                    className="w-4 h-4" // Add appropriate styling
                  />
                  <label
                    htmlFor="roshita"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {language === "en"
                      ? "Pay Doctor's Fee in Cash and Settle Roshita's Fee"
                      : "دفع أتعاب الطبيب نقدًا وتسديد رسوم روشيتا"}
                  </label>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2 mt-4 mb-2">
                  <input
                    type="checkbox"
                    id="family"
                    checked={selectedFamilyOption}
                    onChange={handleCheckboxFamilyChange}
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="full"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {language === "en"
                      ? "Is this appointment for a family member?"
                      : " هل هذا الموعد لأحد أفراد العائلة؟"}
                  </label>
                </div>
              </div>

              {isModalOpen && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      {language === "en"
                        ? "Add Family Member"
                        : "إضافة أحد أفراد العائلة"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {language === "en"
                          ? "Family Member Details"
                          : "تفاصيل أحد أفراد العائلة"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder={
                          language === "en" ? "First Name" : "الاسم الأول"
                        }
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                      />
                      <Input
                        placeholder={
                          language === "en" ? "Last Name" : "اسم العائلة"
                        }
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                      />
                      <Input
                        placeholder={
                          language === "en" ? "Relative" : "صلة القرابة"
                        }
                        name="relative"
                        value={formData.relative}
                        onChange={handleInputChange}
                      />
                      <Input
                        placeholder={language === "en" ? "Phone" : "رقم الهاتف"}
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                      <Input
                        placeholder={
                          language === "en" ? "Email" : "البريد الإلكتروني"
                        }
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      <Select
                        onValueChange={(value) =>
                          setFormData({ ...formData, city: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              language === "en" ? "Select City" : "اختر مدينة"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.id} value={city.id}>
                              {language === "en"
                                ? city.foreign_name
                                : city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder={language === "en" ? "Address" : "العنوان"}
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button variant="outline">
                        {language === "en" ? "Cancel" : "إلغاء"}
                      </Button>
                      <Button onClick={handleSubmit}>
                        {language === "en" ? "Save" : "حفظ"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Navigate to Step 2 Button */}
              <Button onClick={() => setStep(2)} className="mt-4">
                {language === "en"
                  ? "Proceed to Payment"
                  : "الانتقال إلى الدفع"}
              </Button>
            </div>

            {/* Doctor's Image */}
            <div className="ml-4 h-[120px] w-[120px] rounded-full bg-roshitaBlue flex justify-center items-center overflow-hidden">
              <img
                src={
                  imageUrl &&
                  imageUrl !== null &&
                  !imageUrl.startsWith("/media/media/")
                    ? imageUrl
                    : "/Images/default-doctor.jpeg"
                }
                alt={name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="lg:p-20 p-4">
          <h2 className="text-center font-semibold lg:text-4xl text-2x">
            {language === "en" ? "Payment Methods" : "طــــرق الدفـــع"}
          </h2>
          {/* Payment Section */}
          <div
            className={`flex flex-col p-4 ${
              language === "en" ? "text-start" : "text-end"
            }`}
          >
            {/* Payment Details */}
            <div className={`text-${language === "en" ? "start" : "end"} mb-4`}>
              <p className="text-gray-600 mb-2 pb-2 text-center">
                {language === "en"
                  ? "Select the payment method available to you"
                  : "أختار الطريقــة المعاملة التي موجودة لديــــــك"}
              </p>

              <p className="text-black mb-2 pb-2 text-center">
                {language === "en"
                  ? "Your payment for Roshita will be processed using the selected method. Please note that payments for the doctor must be made in cash directly at the doctor's cabinet."
                  : "سيتم معالجة دفعتك لروشيتا باستخدام الطريقة المحددة. يرجى ملاحظة أن الدفع للطبيب يجب أن يتم نقدًا مباشرة في عيادة الطبيب."}
              </p>
              <p
                className={`text-gray-600 mb-2 pb-2 text-2xl font-semibold ${
                  language === "en" ? "text-start" : "text-end"
                }`}
              >
                {language === "en" ? "Choose your card" : "أختـــار البطــاقة"}
              </p>
              <div>
                <div className="flex flex-wrap gap-4">
                  {paiement.map((option) => (
                    <div
                      key={option.id}
                      className={`flex ${
                        language === "en" ? "flex-row" : "flex-row-reverse"
                      } justify-start gap-2 items-center p-4 rounded-lg cursor-pointer transition-colors w-full ${
                        selectedId === option.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                      onClick={() => handleClick(option.id)}
                    >
                      <img
                        src={option.image}
                        alt={language === "en" ? option.name_en : option.name} // Use name_en for English
                        className="w-16 h-16 mb-2 object-contain"
                      />
                      <span className="text-lg font-semibold">
                        {language === "en" ? option.name_en : option.name}{" "}
                        {/* Use name_en if language is en */}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Accept Appointment Button */}
            <AcceptAppointment
              name={name}
              specialty={specialty}
              rating={0}
              reviewsCount={0}
              price={price}
              location={location}
              imageUrl={imageUrl}
              id={id}
              day={day}
              time={time}
              endTime={endTime}
              medical_organizations={medical_organizations}
              payement={selectedPaiementOption}
              formData={{
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                relative: formData.relative,
              }}
              familymember={selectedFamilyOption}
              paymentMethod={
                selectedId
                  ? paiement.find((option) => option.id === selectedId)
                  : null
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorCardAppointment;
