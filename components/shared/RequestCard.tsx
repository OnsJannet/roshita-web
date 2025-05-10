import { useState } from "react";
import { ConsultationTransfer } from "../ui/ConsultationTransfer";

interface RequestCardProps {
  requestNumber: string;
  patientName: string;
  requestDate: string;
  speciality: string;
  userType: string;
  status: string;
  language: "ar" | "en";
  diagnosisDescription?: string;
}

const RequestCard: React.FC<RequestCardProps> = ({
  requestNumber,
  patientName,
  requestDate,
  language,
  speciality,
  userType,
  status,
  diagnosisDescription
}) => {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleHideConsultation = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        console.error('No access token found');
        return;
      }

      const response = await fetch(
        `https://test-roshita.net/api/consultation-requests/${requestNumber}/hide/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to hide consultation');
      }
    } catch (error) {
      console.error('Error hiding consultation:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const content = {
    title: language === "ar" ? "تفاصيل الطلب" : "Request Details",
    requestNumberLabel: language === "ar" ? "رقم الطلب" : "Request Number",
    patientNameLabel: language === "ar" ? "اسم المريض" : "Patient Name",
    requestDateLabel: language === "ar" ? "تاريخ الطلب" : "Request Date",
    editButton: language === "ar" ? "قبول" : "Accept",
    deleteButton: language === "ar" ? "حذف" : "Delete",
    specialityLabel: language === "ar" ? "التخصص" : "Speciality",
    detailsButton: language === "ar" ? "تفاصيل" : "Details",
    transferButton: language === "ar" ? "تحويل" : "Transfer",
  };

  const handleTransferClick = () => {
    setIsTransferModalOpen(true);
  };

  const handleDetailsClick = () => {
    const url =
      userType === "doctor"
        ? `/doctor-dashboard/consultations/${requestNumber}`
        : `/dashboard/consultations/${requestNumber}`;
    window.location.href = url;
  };

  // Fixed date formatting
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      
      return date.toLocaleDateString(language === "ar" ? "en-GB" : "en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return language === "ar" ? "تاريخ غير صالح" : "Invalid date";
    }
  };

  const formattedDate = formatDate(requestDate);
  console.log("requestDate", requestDate)
  console.log("formattedDate", formattedDate)

  return (
    <div className={`w-full rounded-lg overflow-hidden flex flex-col p-4 transition-all duration-300 ${
      isExpanded ? "h-auto" : "h-40"
    } bg-gray-50 ${language === "ar" ? "text-right" : "text-left"}`}>
      
      {/* Main content row */}
      <div className={`flex flex-col lg:flex-${language === "en" ? "row-reverse" : "row"} lg:justify-between lg:items-center gap-4`}>
        
        {/* Buttons section */}
        <div className={`flex gap-4 ${language === "ar" ? "flex-row justify-start order-first lg:order-none" : "flex-row-reverse justify-end"}`}>
          <button
            className="bg-[#1782c4] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (language === "ar" ? "إخفاء التفاصيل" : "Hide Details") : content.detailsButton}
          </button>
          
          {userType !== "hospital" && userType !== "doctor" && (
            <button className="border bg-red-500 border-[#eb6f7d] hover:border-transparent hover:bg-gray-700 hover:text-white text-white font-bold py-2 px-4 rounded">
              {content.deleteButton}
            </button>
          )}
          
          {userType === "hospital" && status === "Pending" && (
            <>
              <button
                className="bg-[#cfe187] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleTransferClick}
              >
                {content.transferButton}
              </button>
              <button
                className="border bg-red-500 border-[#eb6f7d] hover:border-transparent hover:bg-gray-700 hover:text-white text-white font-bold py-2 px-4 rounded"
                onClick={handleHideConsultation}
                disabled={isDeleting}
              >
                {isDeleting ? (language === "ar" ? "جاري الحذف..." : "Deleting...") : content.deleteButton}
              </button>
            </>
          )}
          
          {userType !== "hospital" && userType !== "doctor" && (
            <button className="bg-[#cfe187] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              {content.editButton}
            </button>
          )}
        </div>
        
        {/* Information section */}
        <div className={`text-gray-700 text-base flex lg:w-[60%] gap-4 lg:gap-20 ${
          language === "ar" ? "lg:flex-row-reverse" : "lg:flex-row"
        } flex-col`}>
          <div className="flex flex-col gap-1">
            <p><strong>{content.requestNumberLabel}</strong></p>
            <p>{requestNumber}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p><strong>{content.patientNameLabel}</strong></p>
            <p>{patientName}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p><strong>{content.requestDateLabel}</strong></p>
            <p>{formattedDate}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p><strong>{content.specialityLabel}</strong></p>
            <p>{speciality}</p>
          </div>
        </div>

      </div>

      {/* Expanded content - appears below everything */}
      {isExpanded && (
        <div className="w-full mt-4 bg-transparent rounded-lg p-4">
          <strong>{language === "ar" ? "وصف التشخيص" : "Diagnosis Description"}</strong>
          <p className="mt-2">{diagnosisDescription || (language === "ar" ? "لا يوجد وصف" : "No description provided")}</p>
        </div>
      )}

      <ConsultationTransfer
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        language={language}
        consultationID={requestNumber}
      />
    </div>
  );
};

export default RequestCard;