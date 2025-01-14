import React, { useState, useEffect } from "react";
import UploadButton from "../unique/UploadButton";
import { MoveRight } from "lucide-react";

interface InformationCardProps {
  title: string;
  name: string;
  picture: string;
  fields: { isDropdown?: boolean; label: string; value: string }[];
  photoUploadHandler?: (file: File | string) => void;
  onFieldChange?: (index: number, value: string) => void;
  onNameChange?: (value: string) => void;
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
  photoUploadHandler,
  picture,
  onFieldChange,
  onNameChange,
  cities,
  onCityChange,
  specialities,
  onSpecialityChange,

  type,
}) => {
  const [editableName, setEditableName] = useState<string>(name);
  const [editableFields, setEditableFields] = useState(fields);
  const [isEditingName, setIsEditingName] = useState(false);
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
      "الإســــــم" | "اختر مدينة" | "مكان",
      { ar: string; en: string }
    > = {
      الإســــــم: { ar: "الإســــــم", en: "Name" },
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
                  <td className="py-3 px-2 text-gray-700 p-4">
                    {index === 0 ? (
                      // Editable phone number input
                      <input
                        type="text"
                        value={field.value}
                        onChange={(event) => handleFieldChange(index, event)}
                        className={`${
                          language === "ar" ? "text-end p-2" : "text-start"
                        } ${getBorderClass()} rounded`}
                      />
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
                      field.value
                    )}
                  </td>
                  <td className="py-3 px-2 text-gray-500 p-4">{field.label}</td>
                </>
              ) : (
                <>
                  <td className="py-3 px-2 text-gray-500 p-4">{field.label}</td>
                  <td className="py-3 px-2 text-gray-700 p-4">
                    {index === 0 ? (
                      // Editable phone number input
                      <input
                        type="text"
                        value={field.value}
                        onChange={(event) => handleFieldChange(index, event)}
                        className={`${"text-start p-2"} ${getBorderClass()} rounded`}
                      />
                    ) : field.isDropdown ? (
                      <select
                        value={field.value}
                        onChange={(event) =>
                          index === 1
                            ? handleCityChange(event)
                            : handleSpecialityChange(event)
                        }
                        className={`${"text-end"} p-2 rounded`}
                      >
                        {(index === 1 ? cities : specialities)?.map(
                          (option) => (
                            <option key={option.id} value={option.foreign_name}>
                              option.foreign_name
                            </option>
                          )
                        )}
                      </select>
                    ) : (
                      field.value
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
