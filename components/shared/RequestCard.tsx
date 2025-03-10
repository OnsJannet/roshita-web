import { useState } from "react";
import { ConsultationTransfer } from "../ui/ConsultationTransfer";

interface RequestCardProps {
  requestNumber: string;
  patientName: string;
  requestDate: string;
  speciality: string;
  userType: string;
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
  //doctors,
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
    detailsButton: language === "ar" ? "تفاصيل" : "Details",
    transferButton: language === "ar" ? "تحويل" : "Transfer",
  };

  // Function to open the transfer modal
  const handleTransferClick = () => {
    setIsTransferModalOpen(true);
  };

    // Function to navigate to the details page
    const handleDetailsClick = () => {
      window.location.href=`/dashboard/consultations/${requestNumber}`;
    };

  return (
    <div
      className={`w-full rounded-lg overflow-hidden  flex lg:justify-between items-center lg:h-40 h-full p-4 bg-gray-50 ${
        language === "ar"
          ? "text-right lg:flex-row-reverse flex-col"
          : "text-left lg:flex-row flex-col"
      }`}
    >
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
        <button className="border bg-red-500 border-[#eb6f7d] hover:border-transparent hover:bg-gray-700 hover:text-white text-white font-bold py-2 px-4 rounded mr-2">
          {content.deleteButton}
        </button>
        {userType === "hospital" && (
          <button
            className="bg-[#cfe187] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={handleTransferClick} // Open the modal on click
          >
            {content.transferButton}
          </button>
        )}
        {userType !== "hospital" && (
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
