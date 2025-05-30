import React, { useState, useEffect } from "react";
import UploadButton from "../unique/UploadButton";
import { MoveRight } from "lucide-react";

interface InformationCardProps {
  title: string;
  name: string;
  lastName: string;
  picture: string;
  fields: { isDropdown?: boolean; label: string; value: string }[];
  photoUploadHandler?: (file: File | string) => void;
  onFieldChange?: (index: number, value: string) => void;
  onNameChange?: (value: string) => void;
  onLastNameChange?: (value: string) => void;
  cities?: { id: number; name?: string; foreign_name: string }[];
  onCityChange?: (newCityId: string) => void;
  specialities?: { id: number; name?: string; foreign_name: string }[];
  onSpecialityChange?: (speciality: string) => void;
  type?: string;
}

type Language = "ar" | "en";

const InformationCard: React.FC<InformationCardProps> = ({
  title,
  fields,
  name,
  lastName,
  photoUploadHandler,
  picture,
  onFieldChange,
  onNameChange,
  onLastNameChange,
  cities,
  onCityChange,
  specialities,
  onSpecialityChange,

  type,
}) => {
  const [editableName, setEditableName] = useState<string>(name);
  const [editableLastName, setEditableLastName] = useState<string>(lastName);
  const [editableFields, setEditableFields] = useState(fields);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingLastName, setIsEditingLastName] = useState(false);
  const [language, setLanguage] = useState<Language>("ar");

  console.log("specialities", specialities);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage as Language);
    } else {
      setLanguage("ar");
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "language") {
        setLanguage((event.newValue as Language) || "ar");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!isEditingName) {
      setEditableName(name);
    }
  }, [name, isEditingName]);

  useEffect(() => {
    if (!isEditingLastName) {
      setEditableLastName(lastName);
    }
  }, [lastName, isEditingLastName]);

  useEffect(() => {
    setEditableFields(fields);
  }, [fields]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setEditableName(newName);
    onNameChange?.(newName);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setEditableLastName(newName);
    onLastNameChange?.(newName);
  };

  const handleFieldChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newFields = [...editableFields];
    newFields[index].value = event.target.value;
    setEditableFields(newFields);
    onFieldChange?.(index, event.target.value);
  
    // Log the updated fields
    console.log("Updated editableFields:", newFields);
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCityId = event.target.value;

    if (onCityChange) {
      console.log("onSpecialityChange function exists, calling it...");
      onCityChange(newCityId);
    } else {
      console.log("onSpecialityChange function is not defined.");
    }

    // Simulate a field change and log it
    const simulatedEvent = {
      target: { value: newCityId },
    } as React.ChangeEvent<HTMLInputElement>;

    console.log("Simulated Event for handleFieldChange:", simulatedEvent);

    handleFieldChange(1, simulatedEvent);
  };

  const handleSpecialityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSpecialityId = event.target.value;

    // Log the event and new speciality ID
    console.log("Event:", event);
    console.log("New Speciality ID:", newSpecialityId);

    if (onSpecialityChange) {
      console.log("onSpecialityChange function exists, calling it...");
      onSpecialityChange(newSpecialityId);
    } else {
      console.log("onSpecialityChange function is not defined.");
    }

    // Simulate a field change and log it
    const simulatedEvent = {
      target: { value: newSpecialityId },
    } as React.ChangeEvent<HTMLInputElement>;

    console.log("Simulated Event for handleFieldChange:", simulatedEvent);

    handleFieldChange(2, simulatedEvent);
  };

  const getBorderClass = () => (type === "add" ? "border" : "border-0");

  const translate = (key: string) => {
    const translations: Record<
      "اللقب" | "الإســــــم" | "اختر مدينة" | "مكان",
      { ar: string; en: string }
    > = {
      الإســــــم: { ar: "الإســــــم", en: "Name" },
      اللقب: { ar: "اللقب", en: "Last Name" },
      "اختر مدينة": { ar: "اختر مدينة", en: "Choose a city" },
      مكان: { ar: "مكان", en: "Place" },
    };
    return (
      (translations as Record<string, { ar: string; en: string }>)?.[key]?.[
        language
      ] || key
    );
  };

  return (
    <div
      className={`flex flex-col ${getBorderClass()} rounded-lg bg-white shadow-sm max-w-[1280px] mx-auto ${
        language === "ar" ? "rtl" : "ltr"
      } `}
    >
      <h2
        className={`text-lg font-semibold text-gray-700 ${
          language === "ar" ? "text-end" : "text-start"
        } border-b p-4`}
      >
        {title}
      </h2>
      <div
        className={`flex ${
          language === "ar" ? "flex-row-reverse" : "flex-row"
        } justify-start items-center p-4 gap-4`}
      >
        <UploadButton
          onUpload={(file) => {
            // Call the photoUploadHandler from props
            photoUploadHandler?.(file); // eslint-disable-line
          }}
          picture={picture}
        />
        <div className="flex flex-col">
          <h4 className={`${language === "ar" ? "text-end" : "text-start"}`}>
            {translate("الإســــــم")}
          </h4>
          <input
            type="text"
            value={editableName}
            onChange={handleNameChange}
            onFocus={() => setIsEditingName(true)}
            onBlur={() => setIsEditingName(false)}
            className={`${
              language === "ar" ? "text-end p-2" : "text-start"
            } ${getBorderClass()}  rounded`}
          />
        </div>
        <div className="flex flex-col">
          <h4 className={`${language === "ar" ? "text-end" : "text-start"}`}>
            {translate("اللقب")}
          </h4>
          <input
            type="text"
            value={editableLastName}
            onChange={handleLastNameChange}
            onFocus={() => setIsEditingLastName(true)}
            onBlur={() => setIsEditingLastName(false)}
            className={`${
              language === "ar" ? "text-end p-2" : "text-start"
            } ${getBorderClass()}  rounded`}
          />
        </div>
      </div>
      <table className="w-full text-right p-4">
        <tbody>
          {editableFields.map((field, index) => (
            <tr key={index} className="border-t p-4">
              {language === "ar" ? (
                <>
                  <td className="py-3 px-2 text-gray-500 p-4 text-center">
                    <div className="flex justify-center">
                      <MoveRight className="h-4 w-4" />
                    </div>
                  </td>
                  <td className="py-3 px-2 text-gray-700 p-4 flex justify-end">
                    {index === 3 ? (
                      // Editable input for phone number (index 0) or booking price (index 3)
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={field.value}
                          onChange={(event) => handleFieldChange(index, event)}
                          className={`${
                            language === "ar" ? "text-end p-2" : "text-start"
                          } ${getBorderClass()} rounded`}
                        />
                        {index === 3 && <span>{language === "ar" ? "د.ل" : "DL"}</span>}
                      </div>
                    ) : field.isDropdown ? (
                      // Dropdown for city or specialty
                      <select
                        value={field.value}
                        onChange={(event) =>
                          index === 1
                            ? handleCityChange(event)
                            : handleSpecialityChange(event)
                        }
                        className={`${
                          language === "ar" ? "text-end" : "text-start"
                        } p-2 rounded`}
                      >
                        {(index === 1 ? cities : specialities)?.map(
                          (option) => (
                            <option key={option.id} value={option.name}>
                              {option.name}
                            </option>
                          )
                        )}
                      </select>
                    ) : (
                      // Display the field value if it's not editable or a dropdown
                      <div className="flex items-center gap-1">
                        {field.value}
                        {field.label.toLowerCase().includes("price") && (
                          <span>{language === "ar" ? "د.ل" : "DL"}</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td
                    className={`py-3 px-2 text-gray-500 p-4 ${
                      language === "ar" ? "text-end" : "text-start"
                    }`}
                  >
                    {field.label}
                  </td>
                </>
              ) : (
                <>
                  <td
                    className={`py-3 px-2 text-gray-500 p-4 
                       text-start
                    `}
                  >
                    {field.label}
                  </td>
                  <td className="pl-4 py-3 px-2 text-gray-700 p-4 flex justify-start">
                    {index === 3 ? (
                      // Editable phone number input
                      <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={field.value}
                        onChange={(event) => handleFieldChange(index, event)}
                        className={`text-start p-2 ${getBorderClass()} rounded`}
                      />
                      <span>DL</span>
                    </div>
                    ) : field.isDropdown ? (
                      <select
                        value={field.value}
                        onChange={(event) =>
                          index === 1
                            ? handleCityChange(event)
                            : handleSpecialityChange(event)
                        }
                        className={`text-start p-2 rounded `}
                      >
                        {(index === 1 ? cities : specialities)?.map(
                          (option) => (
                            <option key={option.id} value={option.foreign_name}>
                              {option.foreign_name}
                            </option>
                          )
                        )}
                      </select>
                    ) : (
                      <p className="pl-4">{field.value} </p>
                    )}
                  </td>
                  <td className="py-3 px-2 text-gray-500 p-4 text-center">
                    <div className="flex justify-center">
                      <MoveRight className="h-4 w-4" />
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InformationCard;
