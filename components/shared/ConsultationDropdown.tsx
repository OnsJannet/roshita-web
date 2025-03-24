import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import FileComponent from "./FileComponent";
import { paiement } from "@/constant";

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
}) => {

  console.log(`consultationId ${consultationId} have status ${consultationStatus}`, )
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const handlePaymentMethodClick = (id: number) => {
    const selectedMethod = paiement.find((option) => option.id === id);
    if (selectedMethod) {
      setSelectedPaymentMethod(selectedMethod.name_en.toLowerCase());
    }
  };

  const acceptRequest = async () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    const token = localStorage.getItem("access");
    try {
      const response = await fetch(
        `https://test-roshita.net/api/accept-doctor-consultation-offer/${consultationId}/`,
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
            mobile_number: "0913632323", // Static number for testing
            birth_year: 1990, // Static birth year for testing
            payment_method: selectedPaymentMethod,
            pay_full_amount: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Request accepted:", result);
      window.location.reload()
      setIsModalOpen(false); // Close the modal after successful request
    } catch (error) {
      console.error("Failed to accept request:", error);
      alert("Failed to accept the request. Please try again.");
    }
  };

  const denyRequest = async () => {
    const token = localStorage.getItem("access");
    try {
      const response = await fetch(
        `https://test-roshita.net/api/accept-doctor-consultation-offer/${consultationId}/`,
         // Replace with the correct endpoint
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
      window.location.reload()
    } catch (error) {
      console.error("Failed to deny request:", error);
      alert("Failed to deny the request. Please try again.");
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const isArabic = language === "ar";

  return (
    <Card
      className={`border !shadow-none rounded-lg w-full ${
        isOpen ? "" : "h-[200px] overflow-hidden"
      }`}
    >
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
                {hospitalName
                  ? hospitalName
                  : isArabic
                  ? "تم إرسال الاستشارة"
                  : "Consultation Sent"}
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
              {notificationMessage
                ? notificationMessage
                : isArabic
                ? "تم إضافة الاستشارة إلى القائمة"
                : "Consultation added to the list"}
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
            <p className="text-sm">
              <span className="font-bold">
                {isArabic ? " يوم الموعد:" : "Appointment Day:"}
              </span>{" "}
              {date}
            </p>
            <p
              className="text-sm leading-relaxed mb-2"
              style={{ whiteSpace: "pre-line" }}
            >
              {isArabic ? doctorMessage : doctorMessage}
            </p>
            <hr className="my-4" />
            <p
              className="text-sm text-gray-600"
              style={{ whiteSpace: "pre-line" }}
            >
              {isArabic ? patientMessage : patientMessage}
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
            onClick={() => setIsModalOpen(true)}
            className="border bg-[#d2e288] border-[#d2e288] hover:border-transparent hover:bg-gray-700 hover:text-white text-white font-bold py-2 px-4 rounded mr-2"
          >
            {isArabic ? "قبول الطلب" : "Accept request"}
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[80%] h-[80%] flex flex-col">
            {/* Scrollable content container */}
            <div
              className="overflow-y-auto flex-1 px-4"
              style={{ maxHeight: "calc(100% - 20px)" }}
            >
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

              {/* Commented-out mobile number field for future use */}
              {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  {language === "en" ? "Mobile Number" : "رقم الجوال"}
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={language === "en" ? "Enter mobile number" : "أدخل رقم الجوال"}
                />
              </div> */}

              <p
                className={`text-gray-600 mb-2 pb-2 text-2xl font-semibold ${
                  language === "en" ? "text-start" : "text-end"
                }`}
              >
                {language === "en" ? "Choose your card" : "أختـــار البطــاقة"}
              </p>

              <div className="flex flex-wrap gap-4">
                {paiement.map((option) => (
                  <div
                    key={option.id}
                    className={`flex ${
                      language === "en" ? "flex-row" : "flex-row-reverse"
                    } justify-start gap-2 items-center p-4 rounded-lg cursor-pointer transition-colors w-full ${
                      selectedPaymentMethod === option.name_en.toLowerCase()
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => handlePaymentMethodClick(option.id)}
                  >
                    <img
                      src={option.image}
                      alt={language === "en" ? option.name_en : option.name}
                      className="w-16 h-16 mb-2 object-contain"
                    />
                    <span className="text-lg font-semibold">
                      {language === "en" ? option.name_en : option.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons fixed at the bottom */}
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                {language === "en" ? "Cancel" : "إلغاء"}
              </button>
              <button
                onClick={acceptRequest}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {language === "en" ? "Confirm" : "تأكيد"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DropdownDetails;