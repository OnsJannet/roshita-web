import React, { useState, useEffect } from "react";
import UploadButton from "../unique/UploadButton";
import { MoveRight } from "lucide-react";

interface InformationCardProps {
  title: string;
  name: string;
  lastName: string;
  picture: string;
  fields: { label: string; value: string }[];
  photoUploadHandler?: (file: File | string) => void;
  onFieldChange?: (index: number, value: string) => void;
  onNameChange?: (value: string) => void;
  onLastNameChange?: (value: string) => void;
  cities?: { id: number; name: string; foreign_name: string }[];
  onCityChange?: (newCityId: string) => void;
  type?: string;
}

type Language = "ar" | "en";

const InformationUserCard: React.FC<InformationCardProps> = ({
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
  type,
}) => {
  const [editableName, setEditableName] = useState<string>(name);
  const [editableLastName, setEditableLastName] = useState<string>(lastName);
  const [editableFields, setEditableFields] = useState(fields);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingLastName, setIsEditingLastName] = useState(false);
  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) setLanguage(storedLanguage as Language);
    else setLanguage("ar");

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
    if (!isEditingName) setEditableName(name);
  }, [name, isEditingName]);

  useEffect(() => {
    if (!isEditingLastName) setEditableLastName(lastName);
  }, [lastName, isEditingLastName]);

  useEffect(() => {
    const formatted = fields.map((field) => ({
      ...field,
      value: formatDateIfNeeded(field.value),
    }));
    setEditableFields(formatted);
  }, [fields]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEditableName(val);
    onNameChange?.(val);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEditableLastName(val);
    onLastNameChange?.(val);
  };

  const handleFieldChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newFields = [...editableFields];
    const newValue = formatDateIfNeeded(event.target.value);
    newFields[index].value = newValue;
    setEditableFields(newFields);
    onFieldChange?.(index, newValue);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;
    onCityChange?.(cityId);
    handleFieldChange(1, { target: { value: cityId } } as any);
  };

  const getBorderClass = () => (type === "add" ? "border" : "border-0");

  const translate = (key: string) => {
    const translations: Record<string, { ar: string; en: string }> = {
      الإســــــم: { ar: "الإســــــم", en: "Name" },
      "اختر مدينة": { ar: "اختر المدينة", en: "Choose city" },
      مكان: { ar: "مكان", en: "Place" },
      اللقب: { ar: "اللقب", en: "Last Name" },
    };
    return translations[key]?.[language] || key;
  };

  const formatDateIfNeeded = (value: string) => {
    const parts = value.split(/[\/\-\.]/);
    let date: Date | null = null;

    if (parts.length === 3) {
      const [a, b, c] = parts;
      // Try DD/MM/YYYY
      if (+a <= 31 && +b <= 12 && +c.length === 4)
        date = new Date(`${c}-${b}-${a}`);
      // Try MM/DD/YYYY
      else if (+a <= 12 && +b <= 31 && +c.length === 4)
        date = new Date(`${c}-${a}-${b}`);
      // Try YYYY-MM-DD (already correct)
      else if (+a.length === 4) return value;
    }

    return date instanceof Date && !isNaN(date.getTime())
      ? date.toISOString().slice(0, 10)
      : value;
  };

  return (
    <div
      className={`flex flex-col ${getBorderClass()} rounded-lg bg-white shadow-sm max-w-[1280px] mx-auto ${
        language === "ar" ? "rtl" : "ltr"
      }`}
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
            console.log("Uploaded image path:", file);
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
            } ${getBorderClass()} rounded`}
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
            } ${getBorderClass()} rounded`}
          />
        </div>
      </div>
      <table className="w-full text-right p-4">
        <tbody>
          {editableFields.map((field, index) => (
            <tr key={index} className="border-t p-4">
              {language === "ar" ? (
                <>
                  <td className="py-3 px-2 text-gray-500 text-center">
                    <MoveRight className="h-4 w-4" />
                  </td>
                  <td className="py-3 px-2 text-gray-700">
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
                  <td className="py-3 px-2 text-gray-500">
                    {translate(field.label)}
                  </td>
                </>
              ) : (
                <>
                  <td className="py-3 px-2 text-gray-500">
                    {translate(field.label)}
                  </td>
                  <td className="py-3 px-2 text-gray-700 text-left">
                    {index === 1 && cities ? (
                      <select
                        value={field.value}
                        onChange={handleCityChange}
                        className={`text-left ${getBorderClass()} p-2 rounded`}
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
                  <td className="py-3 px-2 text-gray-500 text-center">
                    <MoveRight className="h-4 w-4" />
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

export default InformationUserCard;
