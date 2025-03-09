import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import FileComponent from "./FileComponent";

interface File {
  description: string;
  file: string;
}

interface DropdownDetailsProps {
  hospitalName: string;
  notificationMessage: string;
  date: string;
  consultationType: string;
  doctorMessage: string;
  patientMessage: string;
  language: string;
  files: File[];
  consultationStatus: string;
  requestId: number;
}

const DropdownDetails: React.FC<DropdownDetailsProps> = ({
  hospitalName,
  notificationMessage,
  date,
  consultationType,
  doctorMessage,
  patientMessage,
  language,
  files,
  consultationStatus,
  requestId
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Accepts consultation
  const acceptRequest = async () => {
    const token = localStorage.getItem("access");
    try {
      const response = await fetch(
        `https://test-roshita.net/api/accept-doctor-consultation-offer/${requestId}/`, // Use dynamic ID
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "X-CSRFToken": "j0SeEpLccXPhKy1Se6Qw8mC1azuRHSXpQeJ1LMAC56KpeM0WC7wzo18bRNcMflLt",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Request accepted:", result);
      alert("Request accepted successfully!");
    } catch (error) {
      console.error("Failed to accept request:", error);
      alert("Failed to accept the request. Please try again.");
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const isArabic = language === "ar"; // Check if the language is Arabic

  return (
    <Card
      className={`border !shadow-none rounded-lg w-full ${isOpen ? "" : "h-[200px] overflow-hidden"}`}
    >
      <div className={`flex flex-col w-full ${isArabic ? "lg:flex-row-reverse" : "lg:flex-row"} justify-between items-center p-4`}>
        <div className={`flex w-full ${isArabic ? "lg:flex-row-reverse" : "lg:flex-row"} items-center space-x-2 gap-4 `}>
          <div className="p-2 rounded-full lg:flex hidden">
            <img
              src="/Images/home_health_2.png"
              className="w-8 h-[auto]"
              alt="hospital"
            />
          </div>
          <div className="w-full">
            <div className={`flex ${isArabic ? "flex-row-reverse" : "flex-row"} items-center space-x-2 gap-4 w-full justify-between`}>
              <h2 className={`text-lg font-semibold ${isArabic ? "text-right" : "text-start"}`}>
                {hospitalName ? hospitalName : isArabic ? "تم إرسال الاستشارة" : "Consultation Sent"}
              </h2>
              <div className={`flex ${isArabic ? "flex-row-reverse" : "flex-row"} items-center space-x-4 gap-4`}>
                <span className="text-sm text-gray-400">{date}</span>
                <button
                  onClick={toggleDropdown}
                  className="text-[#1588C8] focus:outline-none"
                >
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>
            <p className={`text-sm text-gray-500 text-${isArabic ? "right" : "left"}`}>
              {notificationMessage ? notificationMessage : isArabic ? "تم إضافة الاستشارة إلى القائمة" : "Consultation added to the list"}
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
            <p
              className="text-sm leading-relaxed mb-2"
              style={{ whiteSpace: "pre-line" }}
            >
              {isArabic ? doctorMessage : doctorMessage}
            </p>
            <hr className="my-4" />
            <p className="text-sm text-gray-600" style={{ whiteSpace: "pre-line" }}>
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

      {consultationStatus !== "Pending" && (
        <div className={`p-4 flex justify-start ${isOpen ? "" : "mt-6"}`}>
          <button className="border bg-red-500 border-[#eb6f7d] hover:border-transparent hover:bg-gray-700 hover:text-white text-white font-bold py-2 px-4 rounded mr-2">
            {isArabic ? "رفض الطلب" : "Deny request"}
          </button>
          <button onClick={acceptRequest} className="border bg-[#d2e288] border-[#d2e288] hover:border-transparent hover:bg-gray-700 hover:text-white text-white font-bold py-2 px-4 rounded mr-2">
            {isArabic ? "قبول الطلب" : "Accept request"}
          </button>
        </div>
      )}
    </Card>
  );
};

export default DropdownDetails;
