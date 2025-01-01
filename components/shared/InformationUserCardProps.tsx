import React, { useState, useEffect } from "react";
import UploadButton from "../unique/UploadButton";
import { MoveRight } from "lucide-react";

interface InformationCardProps {
  title: string;
  name: string;
  picture: string;
  fields: { label: string; value: string }[];
  photoUploadHandler?: (file: File | string) => void;
  onFieldChange?: (index: number, value: string) => void;
  onNameChange?: (value: string) => void;
  cities?: { id: number; name: string; foreign_name: string }[];
  onCityChange?: (newCityId: string) => void;
  type?: string;
}

type Language = "ar" | "en";

const InformationUserCard: React.FC<InformationCardProps> = ({
  title,
  fields,
  name,
  photoUploadHandler,
  picture,
  onFieldChange,
  onNameChange,
  cities,
  onCityChange,
  type,
}) => {
  const [editableName, setEditableName] = useState<string>(name);
  const [editableFields, setEditableFields] = useState(fields);
  const [isEditingName, setIsEditingName] = useState(false);
  const [language, setLanguage] = useState<Language>("ar");

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
      onCityChange(newCityId);
    }
    handleFieldChange(1, {
      target: { value: newCityId },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const getBorderClass = () => (type === "add" ? "border" : "border-0");



  const translate = (key: string) => {
    const translations: Record<
      "الإســــــم" | "اختر مدينة" | "مكان",
      { ar: string; en: string }
    > = {
      الإســــــم: { ar: "الإســــــم", en: "Name" },
      "اختر مدينة": { ar: "اختر اللغة", en: "Choose a language" },
      مكان: { ar: "مكان", en: "Place" },
    };
    return (
      (translations as Record<string, { ar: string; en: string }>)?.[key]?.[
        language
      ] || key
    );
  };

  const Userlanguage = [
    {
      id: 0,
      language: "Arabic",
      language_foreign: "العربية",
    },
    {
      id: 1,
      language: "English",
      language_foreign: "الانجليزية",
    },
  ];

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
            console.log("Uploaded image path:", file); // Log the file path received from UploadButton

            // Call the photoUploadHandler from props
            photoUploadHandler?.(file);
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
                    <div className="flex justify-center items-center ">
                      <MoveRight className="h-4 w-4" />
                    </div>
                  </td>
                  <td className="py-3 px-2 text-gray-700 p-4">
                    {index === 1 && cities ? (
                      <select
                        value={field.value}
                        onChange={handleCityChange}
                        className={`text-end ${getBorderClass()} p-2 rounded`}
                      >
                        <option value="" disabled>
                          {translate("اختر مدينة")}
                        </option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {language === "ar" ? city.name : city.foreign_name}
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
                  <td className="py-3 px-2 text-gray-500 p-4">
                    {translate(field.label)}
                  </td>
                </>
              ) : (
                <>
                  <td className="py-3 px-2 text-gray-500 p-4 text-center">
                    <td className="py-3 px-2 text-gray-500 p-4">
                      {translate(field.label)}
                    </td>
                  </td>
                  <td className="py-3 px-2 text-gray-700 p-4  text-left">
                    {index === 1 && cities ? (
                      <select
                        value={field.value}
                        onChange={handleCityChange}
                        className={`text-left ${getBorderClass()} p-2 rounded `}
                      >
                        <option value="" disabled>
                          {translate("اختر مدينة")}
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
                        className={`text-left ${getBorderClass()} p-2 rounded`}
                      />
                    )}
                  </td>
                  <div className="py-3 px-2 text-gray-500 p-4 items-center ">
                    <MoveRight className="h-4 w-4 items-center " />
                  </div>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InformationUserCard;
