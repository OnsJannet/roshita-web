import React, { useState, useEffect } from "react";
import UploadButton from "../unique/UploadButton";
import { MoveRight } from "lucide-react";

interface InformationCardProps {
  title: string;
  name: string;
  picture: string;
  fields: { label: string; value: string }[]; 
  photoUploadHandler?: (file: File) => void;
  onFieldChange?: (index: number, value: string) => void;
  onNameChange?: (value: string) => void;
  cities?: { id: number; name: string; foreign_name: string }[]; // Add cities prop
  onCityChange?: (newCityId: string) => void; // Callback for city change
  type?: string;
}

const InformationCard: React.FC<InformationCardProps> = ({
  title,
  fields,
  name,
  photoUploadHandler,

  picture,
  onFieldChange,
  onNameChange,
  cities,
  onCityChange, // Receive the onCityChange callback
  type,
}) => {
  const [editableName, setEditableName] = useState<string>(name);
  const [editableFields, setEditableFields] = useState(fields);
  const [isEditingName, setIsEditingName] = useState(false); 

  useEffect(() => {
    if (!isEditingName) {
      setEditableName(name);
    }
  }, [name, isEditingName]);

  useEffect(() => {
    setEditableFields(fields);
  }, [fields]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setEditableName(newName);
    onNameChange?.(newName); 
  };

  const handleFieldChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newFields = [...editableFields];
    newFields[index].value = event.target.value;
    setEditableFields(newFields);
    onFieldChange?.(index, event.target.value);
  };

  // Handle city change for dropdown (if provided)
  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCityId = event.target.value; // Get the city ID from the dropdown
    console.log("newCityId", newCityId);
    if (onCityChange) {
      onCityChange(newCityId); // Call the parent callback to send the new city ID
    }
    handleFieldChange(1, { target: { value: newCityId } } as React.ChangeEvent<HTMLInputElement>);
  };

  const getBorderClass = () => (type === "add" ? "border" : "border-0");

  const handlePhotoUpload = (file: File) => {
    console.log("This is the file in child:", file); // Debug log to verify the file
    if (photoUploadHandler) {
      const filePath = URL.createObjectURL(file); // Generate the file path
      console.log("Generated file path in child:", filePath); // Debug log for the path
      photoUploadHandler(filePath); // Pass the file path to the parent
    } else {
      console.warn("photoUploadHandler is not defined.");
    }
  };
  
  

  return (
    <div className={`flex flex-col ${getBorderClass()} rounded-lg bg-white shadow-sm max-w-[1280px] mx-auto rtl`}>
      <h2 className="text-lg font-semibold text-gray-700 text-end border-b p-4">
        {title}
      </h2>
      <div className="flex flex-row-reverse justify-start items-center p-4 gap-4">
      <UploadButton onUpload={handlePhotoUpload} picture={picture} />
        <div className="flex flex-col">
          <h4 className="text-end">الإســــــم</h4>
          <input
            type="text"
            value={editableName}
            onChange={handleNameChange}
            onFocus={() => setIsEditingName(true)}
            onBlur={() => setIsEditingName(false)}
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
                {/* Render dropdown for the "مكان" field */}
                {index === 1 && cities ? (
                  <select
                    value={field.value}
                    onChange={handleCityChange}
                    className={`text-end ${getBorderClass()} p-2 rounded`}
                  >
                    <option value="" disabled>
                      اختر مدينة
                    </option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.foreign_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => handleFieldChange(index, e)}
                    className={`text-end ${getBorderClass()} p-2 rounded`}
                  />
                )}
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
