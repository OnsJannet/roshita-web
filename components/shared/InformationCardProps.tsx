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
  email?: string;
  onEmailChange?: (value: string) => void;
  address?: string;
  onAddressChange?: (value: string) => void;
  phone?: string;
  onPhoneChange?: (value: string) => void;
  whatsappNumber?: string;
  onWhatsappNumberChange?: (value: string) => void;
  licenseExpiryDate?: string;
  onLicenseExpiryDateChange?: (value: string) => void;
  medicalLicenseNumber?: string;
  onMedicalLicenseNumberChange?: (value: string) => void;
  yearsOfExperience?: number;
  onYearsOfExperienceChange?: (value: string) => void;
  payMethod?: string;
  onPayMethodChange?: (value: string) => void;
  coordinationContactName?: string;
  onCoordinationContactNameChange?: (value: string) => void;
  isConsultant?: boolean;
  onIsConsultantChange?: (value: boolean) => void;
  documents?: Array<{
    id: number;
    document_type: { id: number; name: string };
    title: string;
    document_file: string;
    issue_date: string;
    expiry_date: string;
    is_verified: boolean;
    notes: string;
  }>;
  onDocumentUpload?: (file: File, type: string) => void;
  onDocumentDelete?: (id: number) => void;
  priceReturnPercentage?: number;
  onPriceReturnPercentageChange?: (value: string) => void;
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
  email,
  onEmailChange,
  address,
  onAddressChange,
  phone,
  onPhoneChange,
  whatsappNumber,
  onWhatsappNumberChange,
  licenseExpiryDate,
  onLicenseExpiryDateChange,
  medicalLicenseNumber,
  onMedicalLicenseNumberChange,
  yearsOfExperience,
  onYearsOfExperienceChange,
  payMethod,
  onPayMethodChange,
  coordinationContactName,
  onCoordinationContactNameChange,
  isConsultant,
  onIsConsultantChange,
  documents = [],
  onDocumentUpload,
  onDocumentDelete,
  priceReturnPercentage,
  onPriceReturnPercentageChange,
}) => {
  const [editableName, setEditableName] = useState<string>(name);
  const [editableLastName, setEditableLastName] = useState<string>(lastName);
  const [editableFields, setEditableFields] = useState(fields);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingLastName, setIsEditingLastName] = useState(false);
  const [language, setLanguage] = useState<Language>("ar");
  const [additionalFields, setAdditionalFields] = useState({
    email: email || "",
    address: address || "",
    phone: phone || "",
    whatsappNumber: whatsappNumber || "",
    licenseExpiryDate: licenseExpiryDate || "",
    medicalLicenseNumber: medicalLicenseNumber || "",
    yearsOfExperience: yearsOfExperience?.toString() || "",
    payMethod: payMethod || "",
    coordinationContactName: coordinationContactName || "",
    isConsultant: isConsultant || false,
    priceReturnPercentage: priceReturnPercentage?.toString() || "",
  });
  const [documentType, setDocumentType] = useState<string>("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);

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

  useEffect(() => {
    setAdditionalFields({
      email: email || "",
      address: address || "",
      phone: phone || "",
      whatsappNumber: whatsappNumber || "",
      licenseExpiryDate: licenseExpiryDate || "",
      medicalLicenseNumber: medicalLicenseNumber || "",
      yearsOfExperience: yearsOfExperience?.toString() || "",
      payMethod: payMethod || "",
      coordinationContactName: coordinationContactName || "",
      isConsultant: isConsultant || false,
      priceReturnPercentage: priceReturnPercentage?.toString() || "",
    });
  }, [
    email,
    address,
    phone,
    whatsappNumber,
    licenseExpiryDate,
    medicalLicenseNumber,
    yearsOfExperience,
    payMethod,
    coordinationContactName,
    isConsultant,
    priceReturnPercentage,
  ]);

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
  };

  const handleAdditionalFieldChange = (
    field: keyof typeof additionalFields,
    value: string | boolean
  ) => {
    setAdditionalFields((prev) => ({
      ...prev,
      [field]: value,
    }));

    switch (field) {
      case "email":
        onEmailChange?.(value as string);
        break;
      case "address":
        onAddressChange?.(value as string);
        break;
      case "phone":
        onPhoneChange?.(value as string);
        break;
      case "whatsappNumber":
        onWhatsappNumberChange?.(value as string);
        break;
      case "licenseExpiryDate":
        onLicenseExpiryDateChange?.(value as string);
        break;
      case "medicalLicenseNumber":
        onMedicalLicenseNumberChange?.(value as string);
        break;
      case "yearsOfExperience":
        onYearsOfExperienceChange?.(value as string);
        break;
      case "payMethod":
        onPayMethodChange?.(value as string);
        break;
      case "coordinationContactName":
        onCoordinationContactNameChange?.(value as string);
        break;
      case "isConsultant":
        onIsConsultantChange?.(value as boolean);
        break;
      case "priceReturnPercentage":
        onPriceReturnPercentageChange?.(value as string);
        break;
    }
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCityId = event.target.value;
    onCityChange?.(newCityId);
    const simulatedEvent = {
      target: { value: newCityId },
    } as React.ChangeEvent<HTMLInputElement>;
    handleFieldChange(1, simulatedEvent);
  };

  const handleSpecialityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSpecialityId = event.target.value;
    onSpecialityChange?.(newSpecialityId);
    const simulatedEvent = {
      target: { value: newSpecialityId },
    } as React.ChangeEvent<HTMLInputElement>;
    handleFieldChange(2, simulatedEvent);
  };

  const handleDocumentUpload = () => {
    if (documentFile && documentType && onDocumentUpload) {
      onDocumentUpload(documentFile, documentType);
      setDocumentFile(null);
      setDocumentType("");
    }
  };

  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const getBorderClass = () => (type === "add" ? "border" : "border-0");

  const translate = (key: string) => {
    const translations: Record<
      string,
      { ar: string; en: string }
    > = {
      الإســــــم: { ar: "الإســــــم", en: "Name" },
      اللقب: { ar: "اللقب", en: "Last Name" },
      "اختر مدينة": { ar: "اختر مدينة", en: "Choose a city" },
      مكان: { ar: "مكان", en: "Place" },
      "البريد الإلكتروني": { ar: "البريد الإلكتروني", en: "Email" },
      "العنوان": { ar: "العنوان", en: "Address" },
      "رقم الهاتف": { ar: "رقم الهاتف", en: "Phone" },
      "رقم الواتساب": { ar: "رقم الواتساب", en: "WhatsApp Number" },
      "تاريخ انتهاء الرخصة": { ar: "تاريخ انتهاء الرخصة", en: "License Expiry Date" },
      "رقم الرخصة الطبية": { ar: "رقم الرخصة الطبية", en: "Medical License Number" },
      "سنوات الخبرة": { ar: "سنوات الخبرة", en: "Years of Experience" },
      "طريقة الدفع": { ar: "طريقة الدفع", en: "Payment Method" },
      "اسم منسق الاتصال": { ar: "اسم منسق الاتصال", en: "Coordination Contact Name" },
      "استشاري": { ar: "استشاري", en: "Consultant" },
      "نسبة استرجاع السعر": { ar: "نسبة استرجاع السعر", en: "Price Return Percentage" },
      "الوثائق": { ar: "الوثائق", en: "Documents" },
      "نوع الوثيقة": { ar: "نوع الوثيقة", en: "Document Type" },
      "رفع وثيقة": { ar: "رفع وثيقة", en: "Upload Document" },
      "تحميل": { ar: "تحميل", en: "Upload" },
      "حذف": { ar: "حذف", en: "Delete" },
      "تاريخ الإصدار" : {ar: "تاريخ الإصدار", en: "Issue Date"},
      "تاريخ الانتهاء": {ar: "تاريخ الانتهاء", en: "Expiration Date"}
    };
    return translations[key]?.[language] || key;
  };

  const renderAdditionalFields = () => {
    const fieldsToRender = [
      { key: "email", label: translate("البريد الإلكتروني") },
      { key: "address", label: translate("العنوان") },
      { key: "phone", label: translate("رقم الهاتف") },
      { key: "whatsappNumber", label: translate("رقم الواتساب") },
      { key: "licenseExpiryDate", label: translate("تاريخ انتهاء الرخصة") },
      { key: "medicalLicenseNumber", label: translate("رقم الرخصة الطبية") },
      { key: "yearsOfExperience", label: translate("سنوات الخبرة") },
      { key: "payMethod", label: translate("طريقة الدفع") },
      { key: "coordinationContactName", label: translate("اسم منسق الاتصال") },
      { key: "isConsultant", label: translate("استشاري"), isCheckbox: true },
      { key: "priceReturnPercentage", label: translate("نسبة استرجاع السعر") },
    ];

    return fieldsToRender.map((field) => (
      <tr key={field.key} className="border-t p-4">
        {language === "ar" ? (
          <>
            <td className="py-3 px-2 text-gray-500 p-4 text-center">
              <div className="flex justify-center">
                <MoveRight className="h-4 w-4" />
              </div>
            </td>
            <td className="py-3 px-2 text-gray-700 p-4 flex justify-end">
              {field.isCheckbox ? (
                <input
                  type="checkbox"
                  checked={additionalFields[field.key as keyof typeof additionalFields] as boolean}
                  onChange={(e) =>
                    handleAdditionalFieldChange(
                      field.key as keyof typeof additionalFields,
                      e.target.checked
                    )
                  }
                  className="mr-2"
                />
              ) : (
                <input
                  type={field.key === "licenseExpiryDate" ? "date" : "text"}
                  value={additionalFields[field.key as keyof typeof additionalFields] as string}
                  onChange={(e) =>
                    handleAdditionalFieldChange(
                      field.key as keyof typeof additionalFields,
                      e.target.value
                    )
                  }
                  className={`${
                    language === "ar" ? "text-end p-2" : "text-start"
                  } ${getBorderClass()} rounded`}
                />
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
              className={`py-3 px-2 text-gray-500 p-4 text-start`}
            >
              {field.label}
            </td>
            <td className="pl-4 py-3 px-2 text-gray-700 p-4 flex justify-start">
              {field.isCheckbox ? (
                <input
                  type="checkbox"
                  checked={additionalFields[field.key as keyof typeof additionalFields] as boolean}
                  onChange={(e) =>
                    handleAdditionalFieldChange(
                      field.key as keyof typeof additionalFields,
                      e.target.checked
                    )
                  }
                  className="ml-2"
                />
              ) : (
                <input
                  type={field.key === "licenseExpiryDate" ? "date" : "text"}
                  value={additionalFields[field.key as keyof typeof additionalFields] as string}
                  onChange={(e) =>
                    handleAdditionalFieldChange(
                      field.key as keyof typeof additionalFields,
                      e.target.value
                    )
                  }
                  className={`text-start p-2 ${getBorderClass()} rounded`}
                />
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
    ));
  };

  const renderDocumentsSection = () => {
    return (
      <div className="border-t p-4">
        <h3 className={`text-lg font-semibold mb-4 ${language === "ar" ? "text-end" : "text-start"}`}>
          {translate("الوثائق")}
        </h3>
        
        {/* Document upload form */}
        <div className={`flex ${language === "ar" ? "flex-row-reverse" : "flex-row"} gap-4 mb-6`}>
          <div className="flex-1" dir={language === "ar" ? "rtl" : "ltr"}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {translate("نوع الوثيقة")}
            </label>
            <input
              type="text"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className={`w-full p-2 ${getBorderClass()} rounded border-2 border-gray-100`}
            />
          </div>
          <div className="flex-1" dir={language === "ar" ? "rtl" : "ltr"}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {translate("رفع وثيقة")}
            </label>
            <input
              type="file"
              onChange={handleDocumentFileChange}
              className="w-full p-2"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleDocumentUpload}
              disabled={!documentFile || !documentType}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
            >
              {translate("تحميل")}
            </button>
          </div>
        </div>

        {/* Documents list */}
        {documents.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200" >
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translate("نوع الوثيقة")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translate("الوثائق")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translate("تاريخ الإصدار")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translate("تاريخ الانتهاء")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translate("حذف")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200" >
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.document_type.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a 
                        href={doc.document_file} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {doc.title}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.issue_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.expiry_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => onDocumentDelete?.(doc.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        {translate("حذف")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
                    className={`py-3 px-2 text-gray-500 p-4 text-start`}
                  >
                    {field.label}
                  </td>
                  <td className="pl-4 py-3 px-2 text-gray-700 p-4 flex justify-start">
                    {index === 3 ? (
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
          {renderAdditionalFields()}
        </tbody>
      </table>
      {renderDocumentsSection()}
    </div>
  );
};

export default InformationCard;