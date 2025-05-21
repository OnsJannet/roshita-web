import { useState } from "react";
import { ConsultationTransfer } from "../ui/ConsultationTransfer";

interface RequestCardProps {
  requestNumber: string;
  patientName: string;
  requestDate: string;
  speciality: string;
  userType: string;
  status: string;
  doctorMsg: string;
  typeOfService: string;
  language: "ar" | "en";
  diagnosisDescription?: string;
  consultationResponseId: string;
  consultationResponse?: {
    id?: string | number;
    diagnosis_description_response?: string;
    service_type?: string;
  };
}

const RequestCard: React.FC<RequestCardProps> = ({
  requestNumber,
  patientName,
  requestDate,
  language,
  speciality,
  userType,
  status,
  diagnosisDescription,
  consultationResponse,
  doctorMsg,
  typeOfService,
  consultationResponseId
}) => {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hospitalDescription, setHospitalDescription] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);

  const translateStatus = (statusKey: string, lang: "ar" | "en"): string => {
    const translations = {
      en: {
        "Pending": "Pending",
        "Reviewing": "Reviewing",
        "Hospital Reviewing": "Reviewing from hospital",
        "Reviewing from doctor": "Reviewing from doctor",
        "Completed": "Completed",
        "Reviewed": "Reviewed",
        "Accepted": "Accepted",
        "Rejected": "Rejected",
        // Add other statuses as needed
      },
      ar: {
        "Pending": "قيد الانتظار",
        "Reviewing": "قيد المراجعة",
        "Hospital Reviewing": "قيد المراجعة من المستشفى",
        "Reviewing from doctor": "قيد المراجعة من الطبيب",
        "Completed": "مكتمل",
        "Reviewed": "تمت المراجعة",
        "Accepted": "مقبول",
        "Rejected": "مرفوض",
        // Add other statuses as needed
      },
    };
    return translations[lang][statusKey as keyof typeof translations[typeof lang]] || statusKey;
  };

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

      window.location.reload();
    } catch (error) {
      console.error('Error hiding consultation:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  console.log("userType", userType)

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
    statusLabel: language === "ar"? "الحالة" : "Status", // Changed from content.status to content.statusLabel for clarity
    hospitalResponseTitle: language === "ar" ? "رد المستشفى" : "Hospital Response",
    doctorDiagnosisLabel: language === "ar" ? "وصف التشخيص (من الطبيب)" : "Diagnosis Description (from Doctor)",
    serviceTypeLabel: language === "ar" ? "نوع الخدمة" : "Service Type",
    submitYourResponseTitle: language === "ar" ? "إضافة رد" : "Submit Your Response",
    hospitalDescriptionLabel: language === "ar" ? "وصف المستشفى" : "Hospital Description",
    estimatedCostLabel: language === "ar" ? "التكلفة التقديرية" : "Estimated Cost",
    submitResponseButton: language === "ar" ? "إرسال الرد" : "Submit Response",
    submittingResponseButton: language === "ar" ? "جاري الإرسال..." : "Submitting...",
    initialDiagnosisDescriptionLabel: language === "ar" ? "وصف التشخيص" : "Diagnosis Description",
    noDescriptionProvidedLabel: language === "ar" ? "لا يوجد وصف" : "No description provided",
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

  const handleSendHospitalResponse = async () => {
    if (!requestNumber) {
      console.error("Consultation response ID is missing");
      alert(language === "ar" ? "معرف رد الاستشارة مفقود." : "Consultation response ID is missing.");
      return;
    }
    if (!hospitalDescription.trim() || !estimatedCost.trim()) {
      console.error("Hospital description and estimated cost are required");
      alert(language === "ar" ? "وصف المستشفى والتكلفة التقديرية مطلوبان." : "Hospital description and estimated cost are required.");
      return;
    }

    setIsSubmittingResponse(true);
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        console.error('No access token found');
        alert(language === "ar" ? "لم يتم العثور على رمز الوصول." : "No access token found.");
        setIsSubmittingResponse(false);
        return;
      }

      const response = await fetch(
        `https://test-roshita.net/api/hospital-response-second-opinion/${consultationResponseId}/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            hospital_description_response: hospitalDescription,
            estimated_cost: estimatedCost,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send hospital response');
      }
      window.location.reload(); 
    } catch (error) {
      console.error('Error sending hospital response:', error);
      alert(`${language === "ar" ? "خطأ في إرسال رد المستشفى: " : "Error sending hospital response: "}${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSubmittingResponse(false);
    }
  };

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
  onClick={() => userType === "doctor" ? handleDetailsClick() : setIsExpanded(!isExpanded)}
>
  {userType === "doctor" 
    ? (language === "ar" ? "عرض التفاصيل" : "View Details")
    : isExpanded 
      ? (language === "ar" ? "إخفاء التفاصيل" : "Hide Details") 
      : content.detailsButton
  }
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
        <div className={`text-gray-700 text-base flex lg:w-[60%] ${
          language === "ar" ? "lg:flex-row-reverse" : "lg:flex-row"
        } flex-col gap-4`}> {/* Modified: Unified gap to gap-4 */}
          <div className="flex flex-col gap-1 lg:flex-1"> {/* Added lg:flex-1 */}
            <p><strong>{content.requestNumberLabel}</strong></p>
            <p>{requestNumber}</p>
          </div>
          <div className="flex flex-col gap-1 lg:flex-1"> {/* Added lg:flex-1 */}
            <p><strong>{content.patientNameLabel}</strong></p>
            <p>{patientName}</p>
          </div>
          <div className="flex flex-col gap-1 lg:flex-1"> {/* Added lg:flex-1 */}
            <p><strong>{content.requestDateLabel}</strong></p>
            <p>{formattedDate}</p>
          </div>
          <div className="flex flex-col gap-1 lg:flex-1"> {/* Added lg:flex-1 */}
            <p><strong>{content.statusLabel}</strong></p> {/* Corrected: Was content.specialityLabel and an extra strong tag, now uses content.statusLabel */}
            <p>{translateStatus(status, language)}</p>
          </div>
        </div>

      </div>

      {/* Expanded content - appears below everything */}
      {isExpanded && (
        <div className="w-full mt-4 bg-transparent rounded-lg p-4 border-t border-gray-200">
          {userType !== "doctor" && status !== "Hospital Reviewing" && (
            <>
              <strong>{content.initialDiagnosisDescriptionLabel}</strong>
              <p className="mt-2">{diagnosisDescription || content.noDescriptionProvidedLabel}</p>
            </>
          )}

{userType === "hospital" && status === "Hospital Reviewing" && doctorMsg && (
  <div className="w-full" dir={language === "ar" ? "rtl" : "ltr"}>
    <h3 className="text-lg font-semibold mb-2">
      {content.hospitalResponseTitle}
    </h3>
    {diagnosisDescription !== "" && (
      <div className="mb-3">
        <strong>{content.initialDiagnosisDescriptionLabel}:</strong>
        <p className="mt-1">{diagnosisDescription}</p>
      </div>
    )}
    {doctorMsg !== "" && (
      <div className="mb-3">
        <strong>{content.doctorDiagnosisLabel}:</strong>
        <p className="mt-1">{doctorMsg}</p>
      </div>
    )}
    {typeOfService !== "" && (
      <div className="mb-3">
        <strong>{content.serviceTypeLabel}:</strong>
        <p className="mt-1">{typeOfService}</p>
      </div>
    )}

    <div className="mt-4">
      <h4 className="text-md font-semibold mb-2">
        {content.submitYourResponseTitle}
      </h4>
      <div className="mb-3">
        <label htmlFor={`hospitalDescription-${requestNumber}`} className="block text-sm font-medium text-gray-700">
          {content.hospitalDescriptionLabel}
        </label>
        <textarea
          id={`hospitalDescription-${requestNumber}`}
          rows={3}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 ${language === "ar" ? "text-right" : "text-left"}`}
          value={hospitalDescription}
          onChange={(e) => setHospitalDescription(e.target.value)}
          dir={language === "ar" ? "rtl" : "ltr"}
        />
      </div>
      <div className="mb-3">
        <label htmlFor={`estimatedCost-${requestNumber}`} className="block text-sm font-medium text-gray-700">
          {content.estimatedCostLabel}
        </label>
        <input
          type="text"
          id={`estimatedCost-${requestNumber}`}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 ${language === "ar" ? "text-right" : "text-left"}`}
          value={estimatedCost}
          onChange={(e) => setEstimatedCost(e.target.value)}
          dir={language === "ar" ? "rtl" : "ltr"}
        />
      </div>
      <button
        onClick={handleSendHospitalResponse}
        disabled={isSubmittingResponse}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {isSubmittingResponse
          ? content.submittingResponseButton
          : content.submitResponseButton}
      </button>
    </div>
  </div>
)}
           {userType === "patient" && diagnosisDescription && ( // Show initial diagnosis for patient if available
            <>
              <strong>{content.initialDiagnosisDescriptionLabel}</strong>
              <p className="mt-2">{diagnosisDescription || content.noDescriptionProvidedLabel}</p>
            </>
          )}
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