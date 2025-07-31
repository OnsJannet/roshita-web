//@ts-nocheck
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import FileComponent from "./FileComponent";
import { paiement } from "@/constant";
import { MessageAlert } from "./MessageAlert";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { fetchProfileDetails } from "@/lib/api";
import { Label } from "../ui/label";

interface File {
  description: string;
  file: string;
}

interface DropdownDetailsProps {
  hospitalName: string;
  notificationMessage: string;
  date: string;
  creatin_date: string;
  consultationType: string;
  doctorMessage: string;
  patientMessage: string;
  language: string;
  files: File[];
  consultationStatus: string;
  consultationId: number;
  requestId: number;
  price: string;
}

const DropdownDetails: React.FC<DropdownDetailsProps> = ({
  hospitalName,
  notificationMessage,
  date,
  creatin_date,
  consultationType,
  doctorMessage,
  patientMessage,
  language,
  files,
  consultationStatus,
  requestId,
  consultationId,
  price,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentStep, setCurrentStep] = useState(1);
  const [birthYear, setBirthYear] = useState("");
  const [showBirthYearInput, setShowBirthYearInput] = useState(false);
  const [birthYearError, setBirthYearError] = useState("");

  const handlePaymentMethodClick = (id: number) => {
    const selectedMethod = paiement.find((option) => option.id === id);
    if (selectedMethod) {
      setSelectedPaymentMethod(selectedMethod.name_en.toLowerCase());
      setError("");
    }
  };

  const acceptRequest = async () => {
    if (!selectedPaymentMethod) {
      setError(
        language === "ar"
          ? "الرجاء اختيار طريقة الدفع"
          : "Please select a payment method"
      );
      return;
    }

    if (!selectedDate) {
      setError(
        language === "ar"
          ? "الرجاء اختيار تاريخ الموعد"
          : "Please select an appointment date"
      );
      return;
    }

    if (!birthYear) {
      setBirthYearError(
        language === "ar"
          ? "الرجاء إدخال سنة الميلاد للمتابعة"
          : "Please enter your birth year to proceed"
      );
      return;
    }

    const yearNum = parseInt(birthYear);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()) {
      setBirthYearError(
        language === "ar"
          ? "سنة الميلاد غير صالحة"
          : "Invalid birth year"
      );
      return;
    }

    const formattedDateTime = format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss");

    const token = localStorage.getItem("access");
    const phone = localStorage.getItem("phone");
    
    try {
      const response = await fetch(
        `https://test-roshita.net/api/accept-hospital-second-opinion-offer/${consultationId}/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "X-CSRFToken":
              "j0SeEpLccXPhKy1Se6Qw8mC1azuRHSXpQeJ1LMAC56KpeM0WC7wzo18bRNcMflLt",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile_number: phone,
            birth_year: yearNum,
            payment_method: selectedPaymentMethod,
            pay_full_amount: true,
            reservation_date_time: formattedDateTime
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Request accepted:", result);
      setSuccessMessage(
        language === "ar"
          ? "تم قبول الطلب بنجاح"
          : "Request accepted successfully"
      );
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to accept request:", error);
      setError(
        language === "ar"
          ? "فشل قبول الطلب. الرجاء المحاولة مرة أخرى"
          : "Failed to accept the request. Please try again."
      );
    }
  };

  const handlePreviousStep = () => {
    setError("");
    setCurrentStep(1);
  };

  const denyRequest = async () => {
    const token = localStorage.getItem("access");
    try {
      const response = await fetch(
        `https://test-roshita.net/api/accept-hospital-second-opinion-offer/${consultationId}/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "X-CSRFToken":
              "j0SeEpLccXPhKy1Se6Qw8mC1azuRHSXpQeJ1LMAC56KpeM0WC7wzo18bRNcMflLt",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "deny",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Request denied:", result);
      setSuccessMessage(
        language === "ar" ? "تم رفض الطلب بنجاح" : "Request denied successfully"
      );
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Failed to deny request:", error);
      setError(
        language === "ar"
          ? "فشل رفض الطلب. الرجاء المحاولة مرة أخرى"
          : "Failed to deny the request. Please try again."
      );
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setError("");
    setSuccessMessage("");
    setCurrentStep(1);
  };

  const openModal = () => {
    setCurrentStep(1);
    setError("");
    setSuccessMessage("");
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStep(1);
    setError("");
    setSuccessMessage("");
  }

  const isArabic = language === "ar";

  const handleNextStep = () => {
    if (!selectedDate) {
      setError(
        language === "ar"
          ? "الرجاء اختيار تاريخ الموعد"
          : "Please select an appointment date"
      );
      return;
    }
  
    setError("");
    setCurrentStep(2);
  };

  return (
    <Card
      className={`border !shadow-none rounded-lg w-full ${
        isOpen ? "" : "h-[200px] overflow-hidden"
      }`}
    >
      {successMessage && (
        <MessageAlert
          type="success"
          language={language}
          className="rounded-t-lg rounded-b-none"
        >
          {successMessage}
        </MessageAlert>
      )}

      {error && (
        <MessageAlert
          type="error"
          language={language}
          className="rounded-t-lg rounded-b-none"
        >
          {error}
        </MessageAlert>
      )}

      <div
        className={`flex flex-col w-full ${
          isArabic ? "lg:flex-row-reverse" : "lg:flex-row"
        } justify-between items-center p-4`}
      >
        <div
          className={`flex w-full ${
            isArabic ? "lg:flex-row-reverse" : "lg:flex-row"
          } items-center space-x-2 gap-4 `}
        >
          <div className="p-2 rounded-full lg:flex hidden">
            <img
              src="/Images/home_health_2.png"
              className="w-8 h-[auto]"
              alt="hospital"
            />
          </div>
          <div className="w-full">
            <div
              className={`flex ${
                isArabic ? "flex-row-reverse" : "flex-row"
              } items-center space-x-2 gap-4 w-full justify-between`}
            >
              <h2
                className={`text-lg font-semibold ${
                  isArabic ? "text-right" : "text-start"
                }`}
              >
                {hospitalName ||
                  (isArabic ? "تم إرسال الاستشارة" : "Consultation Sent")}
              </h2>
              <div
                className={`flex ${
                  isArabic ? "flex-row-reverse" : "flex-row"
                } items-center space-x-4 gap-4`}
              >
                <span className="text-sm text-gray-400">{creatin_date}</span>
                <button
                  onClick={toggleDropdown}
                  className="text-[#1588C8] focus:outline-none"
                >
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>
            <p
              className={`text-sm text-gray-500 text-${
                isArabic ? "right" : "left"
              }`}
            >
              {notificationMessage ||
                (isArabic
                  ? "تم إضافة الاستشارة إلى القائمة"
                  : "Consultation added to the list")}
            </p>
          </div>
        </div>
      </div>

      {isOpen && (
        <CardContent className="p-4">
          <div className={`text-${isArabic ? "right" : "left"} space-y-4`}>
            <p className="text-sm">
              <span className="font-bold">
                {isArabic ? "نوع الاستشارة:" : "Consultation Type:"}
              </span>{" "}
              {consultationType}
            </p>
            {date && consultationStatus !== "Pending" && (
            <p className="text-sm">
              <span className="font-bold">
                {isArabic ? " يوم الموعد:" : "Appointment Day:"}
              </span>{" "}
              {date}
            </p>
            )}
            {price && (
            <p className="text-sm">
              <span className="font-bold">
                {isArabic ? " السعر:" : "Price:"}
              </span>{" "}
              {price}
            </p>
            )}
            {doctorMessage && consultationStatus !== "Pending" && (
            <p
              className="text-sm leading-relaxed mb-2"
              style={{ whiteSpace: "pre-line" }}
            >
              {doctorMessage}
            </p>
            )}
            <hr className="my-4" />
            <p
              className="text-sm text-gray-600"
              style={{ whiteSpace: "pre-line" }}
            >
              {patientMessage}
            </p>

            {files && files.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-700">
                  {isArabic ? "الملفات المرفقة" : "Attached Files"}
                </h3>
                {files.map((file, index) => (
                  <FileComponent
                    key={index}
                    fileName={file.description}
                    fileUrl={file.file}
                    language={language}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      )}

      {consultationStatus === "Reviewed" && (
        <div className={`p-4 flex justify-start ${isOpen ? "" : "mt-6"}`}>
          <button
            onClick={denyRequest}
            className="border bg-red-500 border-[#eb6f7d] hover:border-transparent hover:bg-gray-700 hover:text-white text-white font-bold py-2 px-4 rounded mr-2"
          >
            {isArabic ? "رفض الطلب" : "Deny request"}
          </button>
          <button
            onClick={openModal}
            className="border bg-[#d2e288] border-[#d2e288] hover:border-transparent hover:bg-gray-700 hover:text-white text-white font-bold py-2 px-4 rounded mr-2"
          >
            {isArabic ? "قبول الطلب" : "Accept request"}
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[80%] max-w-2xl h-auto max-h-[90vh] flex flex-col">
            <div className="overflow-y-auto flex-1 px-2 sm:px-4">
              {currentStep === 1 && (
                <div className="mb-6">
                  <p className="text-gray-700 mb-4 pb-2 text-center font-semibold text-lg">
                    {language === "en"
                      ? "Step 1: Select Appointment Date and Time"
                      : "الخطوة ١: اختر تاريخ ووقت الموعد"}
                  </p>
                  
                  <div className="flex flex-col md:flex-row gap-6 justify-center items-start md:items-center">
                    <div className="bg-white p-2 sm:p-4 rounded-lg shadow-sm border w-full md:w-auto flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                        disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[200px]">
                      {selectedDate && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm">
                          <p className={language === "ar" ? "text-right" : "text-left"}>
                            {language === "ar" ? "التاريخ المحدد:" : "Selected date:"}
                            <span className="font-semibold"> {format(selectedDate, "PPP")}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div>
                  <p className="text-gray-700 mb-4 pb-2 text-center font-semibold text-lg">
                    {language === "en"
                      ? "Step 2: Select Payment Method"
                      : "الخطوة ٢: أختار طريقة الدفع"}
                  </p>

                  <p className="text-gray-600 mb-2 pb-2 text-center text-sm">
                    {language === "en"
                      ? "Select the payment method available to you."
                      : "أختار الطريقــة المعاملة التي موجودة لديـــــــك."}
                  </p>

                  <p className="text-black mb-4 pb-2 text-center text-xs sm:text-sm">
                    {language === "en"
                      ? "Your payment for Roshita will be processed using the selected method. Please note that payments for the doctor must be made in cash directly at the doctor's cabinet."
                      : "سيتم معالجة دفعتك لروشيتا باستخدام الطريقة المحددة. يرجى ملاحظة أن الدفع للطبيب يجب أن يتم نقدًا مباشرة في عيادة الطبيب."}
                  </p>

                  <p
                    className={`text-gray-700 mb-2 pb-2 text-xl font-semibold ${
                      language === "en" ? "text-start" : "text-end"
                    }`}
                  >
                    {language === "en" ? "Choose your card" : "أختـــار البطــاقة"}
                  </p>

                  <div className="flex flex-col gap-3">
                    {paiement.map((option) => (
                      <div
                        key={option.id}
                        className={`flex ${
                          language === "en" ? "flex-row" : "flex-row-reverse"
                        } justify-start gap-4 items-center p-3 rounded-lg cursor-pointer transition-colors w-full border ${
                          selectedPaymentMethod === option.name_en.toLowerCase()
                            ? "bg-blue-500 text-white border-blue-600"
                            : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                        }`}
                        onClick={() => handlePaymentMethodClick(option.id)}
                      >
                        <img
                          src={option.image}
                          alt={language === "en" ? option.name_en : option.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                        />
                        <span className="text-md sm:text-lg font-semibold">
                          {language === "en" ? option.name_en : option.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Birth Year Input Field */}
                  <div className="mt-6">
                    <div
                      className={`flex items-center gap-4 ${
                        language === "en" ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      <Input
                        id="birthYear"
                        value={birthYear}
                        onChange={(e) => {
                          setBirthYear(e.target.value);
                          setBirthYearError("");
                        }}
                        className="flex-1"
                        placeholder={
                          language === "en" ? "Enter your birth year" : "أدخل سنة الميلاد"
                        }
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                      <Label
                        htmlFor="birthYear"
                        className={`text-${
                          language === "en" ? "left" : "right"
                        } w-40`}
                      >
                        {language === "en" ? "Birth Year" : "سنة الميلاد"}
                      </Label>
                    </div>
                    {birthYearError && (
                      <p className={`text-red-500 text-sm mt-2 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}>
                        {birthYearError}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {error && currentStep === 1 && (
                <MessageAlert type="error" language={language} className="mt-4">
                  {error}
                </MessageAlert>
              )}
              {error && currentStep === 2 && (
                <MessageAlert type="error" language={language} className="mt-4">
                  {error}
                </MessageAlert>
              )}
            </div>

            <div className="flex justify-between items-center gap-4 mt-6 pt-4 border-t">
              {currentStep === 1 && (
                <>
                  <button
                    onClick={closeModal}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded text-sm sm:text-base"
                  >
                    {language === "en" ? "Cancel" : "إلغاء"}
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm sm:text-base"
                  >
                    {language === "en" ? "Next" : "التالي"}
                  </button>
                </>
              )}
              {currentStep === 2 && (
                <>
                  <button
                    onClick={handlePreviousStep}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded text-sm sm:text-base"
                  >
                    {language === "en" ? "Back" : "رجوع"}
                  </button>
                  <button
                    onClick={acceptRequest}
                    disabled={!birthYear || !!birthYearError}
                    className={`px-4 py-2 rounded text-sm sm:text-base ${
                      !birthYear || birthYearError
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {language === "en" ? "Confirm Payment" : "تأكيد الدفع"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DropdownDetails;