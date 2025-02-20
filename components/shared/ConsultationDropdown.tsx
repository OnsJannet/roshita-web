import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import FileComponent from "./FileComponent";

interface DropdownDetailsProps {
  hospitalName: string;
  notificationMessage: string;
  date: string;
  consultationType: string;
  doctorMessage: string;
  patientMessage: string;
  language: string;
  files: any;
}

const DropdownDetails: React.FC<DropdownDetailsProps> = ({
  hospitalName,
  notificationMessage,
  date,
  consultationType,
  doctorMessage,
  patientMessage,
  language,
  files
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const isArabic = language === "ar";  // Check if the language is Arabic

  return (
    <Card
      className={`border !shadow-none rounded-lg w-full ${isOpen ? "" : "h-40 overflow-hidden"}`}
    >
      <div className={`flex flex-col w-full ${isArabic ? "lg:flex-row-reverse" : "lg:flex-row"} justify-between items-center p-4`}>
        <div className={`flex  w-full ${isArabic ? "lg:flex-row-reverse" : "lg:flex-row"} items-center space-x-2 gap-4 `}>
          <div className="p-2 rounded-full lg:flex hidden">
            <img
              src="/Images/home_health_2.png"
              className="w-8 h-[auto]"
              alt="hospital"
            />
          </div>
          <div className="w-full">
            <div className={`flex  ${isArabic ? "flex-row-reverse " : "flex-row"} items-center space-x-2 gap-4 w-full justify-between`}>
                <h2 className={`text-lg font-semibold ${isArabic ? "text-right" : "text-start"}`}>
                {hospitalName}
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
            <p className={`text-sm text-gray-500 text-${isArabic ? "right" : "left"}`}>{notificationMessage}</p>
          </div>
        </div>

      </div>

      {isOpen && (
        <CardContent className="p-4">
          <div className={`text-${isArabic ? "right" : "left"} space-y-4`}>
            <p className="text-sm">
              <span className="font-bold">{isArabic ? "نوع الاستشارة:" : "Consultation Type:"}</span> {consultationType}
            </p>
            <p className="text-sm leading-relaxed mb-2" style={{ whiteSpace: "pre-line" }}>
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
                {/* @ts-ignore */}
                {files.map((file, index) => (
                  <FileComponent
                    key={index}
                    fileName={file.name}
                    fileUrl={file.url}
                    language={language}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      )}

      <div className={`p-4 flex justify-start ${isOpen ? "" : "mt-6"}`}>
        <button className="text-red-500 hover:text-red-600 focus:outline-none">
          <Trash2 size={20} />
        </button>
      </div>
    </Card>
  );
};

export default DropdownDetails;
