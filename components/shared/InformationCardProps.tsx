"use client";

import React, { useState } from "react";
import UploadButton from "../unique/UploadButton";
import { MoveRight } from "lucide-react";

interface InformationCardProps {
  title: string;
  name: string;
  picture: string;
  fields: { label: string; value: string }[];
  photoUploadHandler?: (file: File) => void;
  onFieldChange?: (index: number, value: string) => void; // Optional handler for field changes
  onNameChange?: (value: string) => void; // Optional handler for name change
  type?: string; // Optional type prop
}

const InformationCard: React.FC<InformationCardProps> = ({
  title,
  fields,
  name,
  photoUploadHandler,
  picture,
  onFieldChange,
  onNameChange,
  type,
}) => {
  const [editableName, setEditableName] = useState<string>(name);
  const [editableFields, setEditableFields] = useState(fields);

  // Handle name change
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setEditableName(newName);
    onNameChange?.(newName); // Call the parent handler if provided
  };

  // Handle field value change
  const handleFieldChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newFields = [...editableFields];
    newFields[index].value = event.target.value;
    setEditableFields(newFields);
    onFieldChange?.(index, event.target.value); // Call the parent handler if provided
  };

  // Determine border style based on 'type'
  const getBorderClass = () => (type === "add" ? "border" : "border-0");

  return (
    <div className={`flex flex-col ${getBorderClass()} rounded-lg bg-white shadow-sm max-w-[1280px] mx-auto rtl`}>
      <h2 className="text-lg font-semibold text-gray-700 text-end border-b p-4">{title}</h2>
      <div className="flex flex-row-reverse justify-start items-center p-4 gap-4">
        <UploadButton onUpload={photoUploadHandler} picture={picture} />
        <div className="flex flex-col">
          <h4 className="text-end">الإســــــم</h4>
          {/* Editable Name */}
          <input
            type="text"
            value={editableName}
            onChange={handleNameChange}
            className={`text-end ${getBorderClass()} p-2 rounded`}
          />
        </div>
      </div>
      <table className="w-full text-right p-4">
        <tbody>
          {editableFields.map((field, index) => (
            <tr key={index} className="border-t p-4">
              <td className="py-3 px-2 text-gray-500 p-4 text-center">
                <div className="flex justify-center">
                  <MoveRight className="h-4 w-4" />
                </div>
              </td>

              <td className="py-3 px-2 text-gray-700 p-4">
                {/* Editable Field Value */}
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => handleFieldChange(index, e)}
                  className={`text-end ${getBorderClass()} p-2 rounded`}
                />
              </td>
              <td className="py-3 px-2 text-gray-500 p-4">{field.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InformationCard;
