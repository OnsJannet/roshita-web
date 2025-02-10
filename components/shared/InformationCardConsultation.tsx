import { useState } from "react";
import { ConsultationTransfer } from "../ui/ConsultationTransfer";

interface InformationCardConsultationProps {
    requestNumber: string;
    patientName: string;
    requestDate: string;
    speciality: string;
    userType: string;
    typeConsultation: string;
    language: "ar" | "en"; // 'ar' for Arabic, 'en' for English
  }

const InformationCardConsultation: React.FC<InformationCardConsultationProps> = ({
    requestNumber,
    patientName,
    requestDate,
    language,
    speciality,
    userType,
    typeConsultation
  }) => {
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false); // State to control modal
  
    // Text content based on language
    const content = {
      title: language === "ar" ? "تفاصيل الطلب" : "Request Details",
      requestNumberLabel: language === "ar" ? "رقم الطلب" : "Request Number",
      patientNameLabel: language === "ar" ? "اسم المريض" : "Patient Name",
      requestDateLabel: language === "ar" ? "تاريخ الطلب" : "Request Date",
      editButton: language === "ar" ? "قبول" : "Accept",
      deleteButton: language === "ar" ? "حذف" : "Delete",
      specialityLabel: language === "ar" ? "التخصص" : "Speciality",
      typeConsultation: language === "ar" ? "التخصص" : "Speciality",
      detailsButton: language === "ar" ? "تفاصيل" : "Details",
      transferButton: language === "ar" ? "تحويل" : "Transfer",
    };
  
    // Function to open the transfer modal
    const handleTransferClick = () => {
      setIsTransferModalOpen(true);
    };
  
    return (
      <div
        className={`w-full rounded-lg overflow-hidden flex lg:justify-between items-center lg:h-[234px] h-full p-4 bg-gray-50 ${
          language === "ar"
            ? "text-right lg:flex-row-reverse flex-col"
            : "text-left lg:flex-row flex-col"
        }`}
      >
        <div
          className={`text-gray-700 text-base flex  w-[100%] lg:gap-20 gap-4 items-center ${
            language === "ar"
              ? "lg:flex-row-reverse flex-col justify-start"
              : "lg:flex-row flex-col"
          }`}
        >
          <div className="flex flex-col gap-4">
            <p>
              <strong>{content.requestNumberLabel}</strong>
            </p>
            <p>{requestNumber}</p>
          </div>
          <div className="flex flex-col gap-4">
            <p>
              <strong>{content.patientNameLabel}</strong>
            </p>
            <p>{patientName}</p>
          </div>
          <div className="flex flex-col gap-4">
            <p>
              <strong>{content.requestDateLabel}</strong>
            </p>
            <p>{requestDate}</p>
          </div>
          <div className="flex flex-col gap-4">
            <p>
              <strong>{content.specialityLabel}</strong>
            </p>
            <p>{speciality}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default InformationCardConsultation;