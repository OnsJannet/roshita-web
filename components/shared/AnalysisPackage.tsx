import React, { useState } from "react";
import DeleteButton from "../layout/DeleteButton";
import ModifyDialog from "./ModifyDialog"; // Import the ModifyDialog component

interface AnalysisPackageProps {
  title: string;
  subtitle: string;
  onEdit: () => void;
  onDelete: () => void;
  packageData: {
    price: string;
    open_date: string;
    close_date: string;
    medical_services_id: number;
    medical_services_category_id: number;
  };
  updatedData_id: string;
}

type Language = "ar" | "en";

const AnalysisPackage: React.FC<AnalysisPackageProps> = ({
  title,
  subtitle,
  onEdit,
  onDelete,
  packageData,
  updatedData_id,
}) => {
  const [language, setLanguage] = useState<Language>("ar");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = () => {
    setIsModalOpen(true); // Open the modal when "Edit" is clicked
  };

  const handleSave = async (updatedData: {
    price: string;
    open_date: string;
    close_date: string;
    medical_services_id: number;
    medical_services_category_id: number;
  }) => {
    try {
      console.log("Data received from child:", updatedData); // Debug: Log the data received
  
      // Retrieve the Bearer token from localStorage
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('No token found in localStorage');
      }
  
      const id = updatedData_id;
      const response = await fetch(`/api/tests/updateTest?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save data');
      }
  
      const responseData = await response.json();
      console.log('Saved data:', responseData);
      setIsModalOpen(false); // Close modal after successful save
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  

  return (
    <div className={`flex flex-col lg:gap-0 gap-6 items-center justify-between border rounded-lg p-4 bg-white ${language === "ar" ? "rtl lg:flex-row-reverse" : " lg:flex-row"}`}>
      <div className={`flex gap-4 ${language === "ar" ? "flex-row-reverse" : "flex-row"}`}>
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 bg-[#71c9f9] rounded-full">
          <div className="w-8 h-8 bg-[url('/Images/labs.png')] bg-center bg-no-repeat bg-contain"></div>
        </div>

        {/* Text Section */}
        <div className=" w-[200px] mr-4">
          <div className="text-lg font-bold text-gray-800 text-end">{title}</div>
          <div className={`text-sm text-gray-500 ${language === "ar" ? "text-end" : "text-start"}`}>{subtitle}</div>
        </div>
      </div>

      {/* Price Section: Display price vertically */}
      <div className={`flex ${language === "ar" ? "flex-row-reverse" : "flex-row"} gap-2 items-center`}>

        <div className="text-lg font-bold text-gray-800 text-end">{packageData.price} </div>
        <div className="text-sm text-gray-500 text-end">{language === "ar" ? "دت" : "DT"}</div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button className="text-gray-700 px-4 py-2 rounded-md bg-white border border-gray-300" onClick={handleEdit}>
          {language === "ar" ? "تعديل" : "Edit"}
        </button>
        <DeleteButton onConfirm={onDelete} />

        {/* Modify Dialog */}
        {isModalOpen && (
          <ModifyDialog
            packageData={packageData}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            language={language}
          />
        )}
      </div>
    </div>
  );
};

export default AnalysisPackage;
