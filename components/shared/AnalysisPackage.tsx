import React from "react";
import DeleteButton from "../layout/DeleteButton";


interface AnalysisPackageProps {
  title: string;
  subtitle: string;
  onEdit: () => void;
  onDelete: () => void;
}

const AnalysisPackage: React.FC<AnalysisPackageProps> = ({
  title,
  subtitle,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex lg:flex-row-reverse flex-col lg:gap-0 gap-6 items-center justify-between border rounded-lg p-4 bg-white   rtl">
      <div className="flex gap-4 flex-row-reverse">
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 bg-[#71c9f9] rounded-full">
          <div className="w-8 h-8 bg-[url('/Images/labs.png')] bg-center bg-no-repeat bg-contain"></div>
        </div>

        {/* Text Section */}
        <div className="flex-1 mr-4">
          <div className="text-lg font-bold text-gray-800">{title}</div>
          <div className="text-sm text-gray-500 text-end">{subtitle}</div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          className="px-4 py-2 text-white bg-[#71c9f9] rounded-md hover:bg-[#71c9f9] transition"
          onClick={onEdit}
        >
          تعديل
        </button>
        <DeleteButton onConfirm={onDelete} />
      </div>
    </div>
  );
};

export default AnalysisPackage;
