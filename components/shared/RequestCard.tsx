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
  //doctors: any;
}

const RequestCard: React.FC<RequestCardProps> = ({
  requestNumber,
  patientName,
  requestDate,
  language,
  speciality,
  userType,
  status
}) => {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Add state for delete operation

  // Add new handler for hide/delete operation
  const handleHideConsultation = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        console.error('No access token found');
        return;
      }

      const response = await fetch(
        `http://test-roshita.net/api/consultation-requests/${requestNumber}/hide/`,
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

      // Optionally refresh the page or update the UI
      //window.location.reload();
    } catch (error) {
      console.error('Error hiding consultation:', error);
      // You might want to show an error message to the user
    } finally {
      setIsDeleting(false);
    }
  };

  // Text content based on language
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

  // Function to open the transfer modal
  const handleTransferClick = () => {
    setIsTransferModalOpen(true);
  };

// Function to navigate to the details page
const handleDetailsClick = () => {
  const url =
    userType === "doctor"
      ? `/doctor-dashboard/consultations/${requestNumber}`
      : `/dashboard/consultations/${requestNumber}`;
  window.location.href = url;
};

  return (
    <div className={`w-full rounded-lg overflow-hidden  flex lg:justify-between items-center lg:h-40 h-full p-4 bg-gray-50 ${
      language === "ar"
        ? "text-right lg:flex-row-reverse flex-col"
        : "text-left lg:flex-row flex-col"
    }`}>
      <div
        className={`text-gray-700 text-base flex  w-[60%] lg:gap-20 gap-4 items-center ${
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
      <div
        className={`lg:mt-2 mt-4 flex gap-4 ${
          language === "ar" ? "flex-row-reverse  justify-start" : "flex-row "
        } `}
      >
        <button
          className="bg-[#1782c4] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleDetailsClick} // Navigate to details page
        >
          {content.detailsButton}
        </button>
        {userType !== "hospital" && userType !=="doctor" && (
          <button className="border bg-red-500 border-[#eb6f7d] hover:border-transparent hover:bg-gray-700 hover:text-white text-white font-bold py-2 px-4 rounded mr-2">
            {content.deleteButton}
          </button>
        )}
        {userType === "hospital" && status === "Pending" &&(
          <>
          <button
            className="bg-[#cfe187] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={handleTransferClick} // Open the modal on click
          >
            {content.transferButton}
          </button>
          <button
            className="border bg-red-500 border-[#eb6f7d] hover:border-transparent hover:bg-gray-700 hover:text-white text-white font-bold py-2 px-4 rounded mr-2"
            onClick={handleHideConsultation}
            disabled={isDeleting}
          >
            {isDeleting ? (language === "ar" ? "جاري الحذف..." : "Deleting...") : content.deleteButton}
          </button>
        </>
        )}
        {userType !== "hospital" && userType !=="doctor" && (
          <>
            <button className="bg-[#cfe187] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">
              {content.editButton}
            </button>
          </>
        )}
      </div>

      {/* Render the ConsultationTransfer modal */}
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
