"use client";
import React, { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CircleCheck,
  LogOut,
  MonitorCheck,
  Settings,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import BackButton from "@/components/shared/backButton";

// FileUploader component with remove functionality
const FileUploader = ({
  idPrefix,
  onFilesChange,
  language,
  title,
  hasError = false,
}: {
  idPrefix: string;
  onFilesChange: (files: File[]) => void;
  language: "ar" | "en";
  title: string;
  hasError?: boolean;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ name: string; url: string }[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);

      // Create previews
      const newPreviews = newFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));
      setPreviews((prev) => [...prev, ...newPreviews]);

      onFilesChange([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index].url);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);

    onFilesChange(newFiles);
  };

  useEffect(() => {
    return () => {
      // Clean up object URLs
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  return (
    <div
      className={`border-2 rounded-lg p-4 ${
        hasError ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
    >
      <Label className="mb-2 block">{title}</Label>
      <input
        id={`${idPrefix}-file-upload`}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      <label
        htmlFor={`${idPrefix}-file-upload`}
        className="cursor-pointer flex flex-col items-center justify-center p-4"
      >
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {language === "ar"
              ? "اسحب وأسقط الملفات هنا أو انقر لاختيار الملفات"
              : "Drag & drop files here or click to select"}
          </p>
        </div>
      </label>

      {/* File previews with remove option */}
      <div className="mt-4 space-y-2">
        {previews.map((preview, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <div className="flex items-center">
              <a
                href={preview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {preview.name}
              </a>
            </div>
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="text-red-500 hover:text-red-700"
            >
              {language === "ar" ? "إزالة" : "Remove"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

type Language = "ar" | "en";

const translations = {
  en: {
    settings: "Settings",
    changePassword: "Change Password",
    appointments: "My Appointments",
    consultations: "My Consultations",
    notification: "Notifications",
    logout: "Log Out",
    next: "Next",
    previous: "Previous",
    noAppointments: "No appointments to display",
    secondOpinion: "Second Opinion Consultation",
    secondOpinionDesc:
      "A consultation tailored for individuals with prior diagnoses",
    generalConsultation: "General Consultation (Soon)",
    generalConsultationDesc: "A consultation for general medical questions",
    selectConsultationType: "Select Consultation Type",
    fillRequiredFields: "Please fill all required fields",
    xrayRequired: "X-ray images are required",
    reportRequired: "Medical report is required",
  },
  ar: {
    settings: "الإعدادات",
    changePassword: "تغير كلمة المرور",
    appointments: "مواعيدي",
    consultations: "استشارتي",
    logout: "تسجيل الخروج",
    notification: "إشعارات",
    next: "التالي",
    previous: "السابق",
    noAppointments: "لا توجد مواعيد لعرضها",
    secondOpinion: "إستشارة (خود راي تاني)",
    secondOpinionDesc: "استشارة مخصصة للأفراد الذين لديهم تشخيص سابق",
    generalConsultation: "إستشارة طبية  (قريبا)",
    generalConsultationDesc: "استشارة للأسئلة الطبية العامة",
    selectConsultationType: "اختر نوع الاستشارة",
    fillRequiredFields: "يرجى ملء جميع الحقول المطلوبة",
    xrayRequired: "صور الأشعة مطلوبة",
    reportRequired: "التقرير الطبي مطلوب",
  },
};

interface Specialty {
  id: string;
  name: string;
}

const Page = () => {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("ar");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState(0);
  const [consultationType, setConsultationType] = useState<
    "secondOpinion" | "general"
  >();
  const [type, setType] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [uploadedXRaysFiles, setUploadedXRaysFiles] = useState<File[]>([]);
  const [uploadedMedicalReportFiles, setUploadedMedicalReportFiles] = useState<
    File[]
  >([]);
  const [fieldErrors, setFieldErrors] = useState({
    xray: false,
    report: false,
  });

  const handleFilesChangeXRays = (files: File[]) => {
    setUploadedXRaysFiles(files);
    setFieldErrors((prev) => ({ ...prev, xray: false }));
  };

  const handleFilesChangeMedicalReport = (files: File[]) => {
    setUploadedMedicalReportFiles(files);
    setFieldErrors((prev) => ({ ...prev, report: false }));
  };

  const handleSendResponse = async () => {
    if (step === 1) {
      if (!selectedSpecialty || responseMessage.trim() === "") {
        setErrorMessage(
          language === "ar"
            ? "يرجى إدخال التخصص ورسالة الاستشارة"
            : "Please enter specialty and consultation message"
        );
        return;
      }
      setStep(2);
      setErrorMessage("");
    } else if (step === 2) {
      const token = localStorage.getItem("access");
      const patient_id = localStorage.getItem("patientId") || "";

      // Reset all errors first
      setFieldErrors({
        xray: false,
        report: false,
      });

      // Check for required fields
const newErrors = {
  xray: false, 
  report: uploadedMedicalReportFiles.length === 0,
};


      // If there are any errors, set them and return
      if (newErrors.xray || newErrors.report) {
        setFieldErrors(newErrors);
        setErrorMessage(translations[language].fillRequiredFields);
        return;
      }

      // Additional validation for other fields
      const missingFields = [];
      if (!selectedSpecialty) {
        missingFields.push(language === "ar" ? "التخصص" : "specialty");
      }
      if (responseMessage.trim() === "") {
        missingFields.push(
          language === "ar" ? "رسالة الاستشارة" : "response message"
        );
      }

      if (missingFields.length > 0) {
        let errorMsg = "";
        if (language === "ar") {
          errorMsg =
            missingFields.length === 1
              ? `يرجى إدخال ${missingFields[0]}.`
              : `يرجى إدخال ${missingFields.join(" و ")}.`;
        } else {
          errorMsg =
            missingFields.length === 1
              ? `Please enter ${missingFields[0]}.`
              : `Please enter ${missingFields.join(" and ")}.`;
        }
        setErrorMessage(errorMsg);
        return;
      }

      setLoading(true);
      setErrorMessage("");

      try {
        const formData = new FormData();
        formData.append("patient_id", patient_id);
        formData.append("diagnosis_description_request", responseMessage);
        formData.append("specialty_id", selectedSpecialty);
        formData.append("type", type);

        uploadedXRaysFiles.forEach((file, index) => {
          formData.append(`uploaded_files`, file);
          formData.append(
            `uploaded_files[${index}][content_file_type]`,
            "X-Ray"
          );
          formData.append(
            `uploaded_files[${index}][description]`,
            "Lung X-ray Report"
          );
        });

        uploadedMedicalReportFiles.forEach((file, index) => {
          const offsetIndex = uploadedXRaysFiles.length + index;
          formData.append(`uploaded_files`, file);
          formData.append(
            `uploaded_files[${offsetIndex}][content_file_type]`,
            "Medical Report"
          );
          formData.append(
            `uploaded_files[${offsetIndex}][description]`,
            "Blood test results"
          );
        });

        const response = await fetch(
          "https://www.test-roshita.net/api/user-second-opinion-requests/",
          {
            method: "POST",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const responseData = await response.json();

        if (!response.ok) {
          const backendError =
            responseData.detail ||
            responseData.message ||
            (language === "ar"
              ? "حدث خطأ أثناء معالجة طلبك"
              : "Something went wrong while processing your request");

          throw new Error(backendError);
        }

        setStep(3);
      } catch (error) {
        console.error("Error creating consultation request:", error);

        let errorMessage =
          language === "ar"
            ? "فشل في إنشاء طلب الاستشارة. حاول مرة أخرى."
            : "Failed to create consultation request. Please try again.";

        if (error instanceof Error) {
          errorMessage = error.message;
        }

        setErrorMessage(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

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

  // Fetch specialties exactly like in original code
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const specialtiesResponse = await fetch(
          "https://test-roshita.net/api/specialty-list/"
        );
        const specialtiesData: Specialty[] = await specialtiesResponse.json();
        if (specialtiesResponse.ok) {
          setSpecialties(specialtiesData);
        } else {
          console.error("Error fetching specialties");
        }
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };

    fetchSpecialties();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  };

  const handleSettingsClick = () => {
    router.push("/profile");
  };

  const handleAppointmentsClick = () => {
    router.push("/appointments");
  };

  const handleSettingsPasswordClick = () => {
    router.push("/password-change");
  };

  const handleConsultationsClick = () => {
    router.push("/consultations");
  };

  const handleNotificationsClick = () => {
    router.push("/notifications");
  };

  const resetForm = () => {
    setStep(0);
    setConsultationType(undefined);
    setResponseMessage("");
    setSelectedSpecialty("");
    setUploadedXRaysFiles([]);
    setUploadedMedicalReportFiles([]);
    setErrorMessage("");
    setFieldErrors({
      xray: false,
      report: false,
    });
  };

  return (
    <div className="flex justify-center flex-col p-8 bg-[#fafafa]">
      <div>
        <div
          className={`flex ${
            language === "ar" ? "lg:flex-row-reverse" : "lg:flex-row"
          } flex-col justify-start gap-10 mx-auto`}
        >
          <div className="flex lg:w-[20%] w-[100%] justify-start gap-10 mx-auto p-4 bg-white rounded flex-col">
            <div className="mx-auto flex justify-center">
              <div className="relative lg:w-60 lg:h-60 xl:w-20 xl:h-20 h-40 w-40">
                <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center overflow-hidden">
                  <UserRound className="w-1/2 h-1/2 text-roshitaBlue" />
                </div>
              </div>
            </div>
            <div>
              <div
                onClick={handleSettingsClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].settings}</p>
              </div>
              <div
                onClick={handleSettingsPasswordClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].changePassword}</p>
              </div>
              <div
                onClick={handleAppointmentsClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <MonitorCheck className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].appointments}</p>
              </div>
              <div
                onClick={handleConsultationsClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <MonitorCheck className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].consultations}</p>
              </div>
              <div
                onClick={handleNotificationsClick}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].notification}</p>
              </div>
              <div
                onClick={handleLogout}
                className="flex p-2 bg-gray-50 text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <LogOut className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>{translations[language].logout}</p>
              </div>
            </div>
          </div>
          <div className="lg:w-[80%] bg-white p-4 rounded-md h-full">
            <BackButton lang={language} />
            <div
              className="w-full h-40 sm:h-80 md:h-20 lg:h-[80px] xl:h-[280px] bg-cover bg-center bg-no-repeat rounded-lg"
              style={{
                backgroundImage: "url('/Images/fotor-ai-consultations.png')",
                backgroundPosition: "center 30%",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            >
              <div className="flex lg:flex-col items-center justify-center h-full bg-[#1a8cca] bg-opacity-50 rounded-lg lg:p-10 py-20 px-8 lg:gap-4">
                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-center ">
                  {language === "ar"
                    ? "مرحباً بك في استشارات المجانية لروشيتا"
                    : "Welcome to Rosheta's Free Consultations"}
                </h1>
              </div>
            </div>

            <div
              style={{ direction: language === "ar" ? "rtl" : "ltr" }}
              className="pt-10"
            >
              <div
                className={`flex ${
                  language === "ar" ? "flex-row" : "flex-row"
                } justify-center gap-4 sm:gap-8 md:gap-12 lg:gap-16 mb-8 overflow-x-auto px-4 py-2`}
              >
                {[0, 1, 2, 3].map((stepNumber) => {
                  const isCurrent = step === stepNumber;
                  const isCompleted = step > stepNumber;

                  return (
                    <div
                      key={stepNumber}
                      className="flex flex-col items-center min-w-[60px]"
                    >
                      {/* Step Number Box */}
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold ${
                          isCurrent
                            ? "bg-[#1588C8] text-white"
                            : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          stepNumber + 1
                        )}
                      </div>

                      {/* Step Label */}
                      <div className="mt-2 text-xs sm:text-sm text-center whitespace-nowrap">
                        <span
                          className={
                            isCurrent || isCompleted
                              ? "font-bold text-black"
                              : "text-gray-500"
                          }
                        >
                          {stepNumber === 0 &&
                            (language === "ar"
                              ? "اختر نوع الاستشارة"
                              : "Select Type")}
                          {stepNumber === 1 &&
                            (language === "ar" ? "أكتب استشارة" : "Write")}
                          {stepNumber === 2 &&
                            (language === "ar" ? "تنزيل الملفات" : "Upload")}
                          {stepNumber === 3 &&
                            (language === "ar" ? "تم إرسال" : "Success")}
                        </span>
                      </div>

                      {/* Progress Bar - Only show between steps */}
                      {stepNumber < 3 && (
                        <div
                          className={`hidden sm:block w-16 h-1 mt-2 rounded-full ${
                            step > stepNumber ? "bg-green-500" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {errorMessage && (
                <div
                  className={`text-red-500 bg-red-100 p-4 rounded ${
                    language === "ar" ? "text-start" : "text-end"
                  }`}
                >
                  {errorMessage}
                </div>
              )}

              {/* Step 0: Select Consultation Type */}
              {step === 0 && (
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-6 text-center">
                    {translations[language].selectConsultationType}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {/* Second Opinion Consultation */}
                    <div
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        consultationType === "secondOpinion"
                          ? "border-[#1588C8] bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        setConsultationType("secondOpinion");
                        setType("second_opinion");
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src="/Images/consultation-1.png"
                          className="w-16 h-16"
                          alt={translations[language].secondOpinion}
                        />
                        <div>
                          <h3 className="font-bold text-lg">
                            {translations[language].secondOpinion}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {translations[language].secondOpinionDesc}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <div
                          className={`rounded-full h-5 w-5 border-2 flex items-center justify-center ${
                            consultationType === "secondOpinion"
                              ? "bg-[#1588C8] border-[#1588C8]"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          {consultationType === "secondOpinion" && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* General Consultation - Disabled */}
                    <div className="border-2 rounded-lg p-6 transition-all border-gray-200 bg-gray-50 opacity-75">
                      <div className="flex items-center gap-4">
                        <img
                          src="/Images/consultation-2.png"
                          className="w-16 h-16 grayscale"
                          alt={translations[language].generalConsultation}
                        />
                        <div>
                          <h3 className="font-bold text-lg text-gray-500">
                            {translations[language].generalConsultation}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {translations[language].generalConsultationDesc}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <div className="rounded-full h-5 w-5 border-2 flex items-center justify-center bg-gray-200 border-gray-300">
                          <svg
                            className="h-3 w-3 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={() => {
                        if (!consultationType) {
                          setErrorMessage(
                            language === "ar"
                              ? "يرجى اختيار نوع الاستشارة"
                              : "Please select a consultation type"
                          );
                          return;
                        }
                        setStep(1);
                        setErrorMessage("");
                      }}
                      className="bg-[#1588C8] text-white py-2 px-8 rounded-md"
                      disabled={!consultationType}
                    >
                      {language === "ar" ? "التالي" : "Next"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 1: Write Consultation */}
              {step === 1 && (
                <div className="p-4">
                  <div className="mt-6 mb-6">
                    <Label>
                      {language === "ar" ? "اختر التخصص" : "Select Specialty"}
                    </Label>
                    <div className="mt-4">
                      <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        style={{ direction: language === "ar" ? "rtl" : "ltr" }}
                      >
                        <option value="">
                          {language === "ar"
                            ? "اختر التخصص"
                            : "Select Specialty"}
                        </option>
                        {specialties.map((specialty) => (
                          <option key={specialty.id} value={specialty.id}>
                            {/*@ts-ignore*/}
                            {specialty
                              ? language === "en"
                              /*@ts-ignore*/
                                ? specialty.foreign_name
                                : specialty.name
                              : language === "ar"
                              ? "غير محدد"
                              : "Not specified"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder={
                      language === "ar"
                        ? "اكتب رسالتك..."
                        : "Write your message..."
                    }
                    className="w-full p-2 border border-gray-300 rounded-md h-80"
                    style={{ direction: language === "ar" ? "rtl" : "ltr" }}
                  />

                  <div className="flex justify-center gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setStep(0)}
                      className="border-[#1588C8] text-[#1588C8] py-2 px-8 rounded-md"
                    >
                      {language === "ar" ? "السابق" : "Previous"}
                    </Button>
                    <Button
                      onClick={handleSendResponse}
                      className="bg-[#1588C8] text-white py-2 px-8 rounded-md"
                    >
                      {language === "ar" ? "التالي" : "Next"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Upload Files */}
              {step === 2 && (
                <div className="p-4">
                  {consultationType === "secondOpinion" && (
                    <>
                      <div className="mb-6">
                        <FileUploader
                          idPrefix="xray-files"
                          onFilesChange={handleFilesChangeXRays}
                          language={language}
                          title={
                            language === "ar"
                              ? "تحميل صور الأشعة"
                              : "Upload X-ray Images"
                          }
                          hasError={fieldErrors.xray}
                        />
                        {fieldErrors.xray && (
                          <p className="text-red-500 text-sm mt-1">
                            {translations[language].xrayRequired}
                          </p>
                        )}
                      </div>

                      <div className="mb-6">
                        <FileUploader
                          idPrefix="medical-reports"
                          onFilesChange={handleFilesChangeMedicalReport}
                          language={language}
                          title={
                            language === "ar"
                              ? "تحميل التقرير الطبي"
                              : "Upload Medical Report"
                          }
                          hasError={fieldErrors.report}
                        />
                        {fieldErrors.report && (
                          <p className="text-red-500 text-sm mt-1">
                            {translations[language].reportRequired}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {consultationType === "general" && (
                    <div className="mb-6">
                      <FileUploader
                        idPrefix="general-files"
                        onFilesChange={handleFilesChangeMedicalReport}
                        language={language}
                        title={
                          language === "ar"
                            ? "تحميل أي ملفات ذات صلة"
                            : "Upload any relevant files"
                        }
                        hasError={fieldErrors.report}
                      />
                      {fieldErrors.report && (
                        <p className="text-red-500 text-sm mt-1">
                          {translations[language].reportRequired}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-center gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="border-[#1588C8] text-[#1588C8] py-2 px-8 rounded-md"
                    >
                      {language === "ar" ? "السابق" : "Previous"}
                    </Button>
                    <Button
                      onClick={handleSendResponse}
                      className="bg-[#1588C8] text-white py-2 px-8 rounded-md"
                      disabled={loading}
                    >
                      {loading
                        ? language === "ar"
                          ? "جاري الإرسال..."
                          : "Sending..."
                        : language === "ar"
                        ? "إرسال"
                        : "Send"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Success Message */}
              {step === 3 && (
                <div
                  className="p-4"
                  style={{ direction: language === "ar" ? "rtl" : "ltr" }}
                >
                  <div className="bg-white rounded-lg p-6 mb-6">
                    <div className="flex justify-center">
                      <div className="w-[180px] h-[180px] bg-[#d0e7f4] rounded-full flex items-center justify-center">
                        <div className="w-[150px] h-[150px] bg-[#1588C8] rounded-full flex items-center justify-center">
                          <Check className="text-white w-[70px] h-[70px]" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center mb-4 mt-4">
                      <h3 className="text-xl font-bold text-[#1588C8] text-center">
                        {language === "ar"
                          ? "تم إرسال الرسالة بنجاح"
                          : "Message sent successfully"}
                      </h3>
                    </div>

                    <p className="text-gray-600 mb-6 text-center">
                      {language === "ar"
                        ? "تم الإرسال طلبات سيتم الرد على طلبات خلال 72 ساعة"
                        : "Requests have been sent and will be responded to within 72 hours"}
                    </p>

                    {/* Display Selected Consultation Type */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">
                        {language === "ar"
                          ? "نوع الاستشارة"
                          : "Consultation Type"}
                        :
                      </h4>
                      <p className="bg-[#F1FCFF] rounded-lg p-3">
                        {consultationType === "secondOpinion"
                          ? translations[language].secondOpinion
                          : translations[language].generalConsultation}
                      </p>
                    </div>

                    {/* Display Selected Specialty */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">
                        {language === "ar"
                          ? "التخصص المختار"
                          : "Selected Specialty"}
                        :
                      </h4>
                      <p className="bg-[#F1FCFF] rounded-lg p-3">
                        {(() => {
                          const foundSpecialty = specialties.find(
                            (s) => String(s.id) === String(selectedSpecialty)
                          );
                          return (
                            foundSpecialty?.name ||
                            (language === "ar" ? "غير محدد" : "Not specified")
                          );
                        })()}
                      </p>
                    </div>

                    {/* Display Submitted Message */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">
                        {language === "ar"
                          ? "نص الاستشارة"
                          : "Consultation Message"}
                        :
                      </h4>
                      <div className="bg-[#F1FCFF] rounded-lg p-3 whitespace-pre-line h-[200px]">
                        {responseMessage ||
                          (language === "ar"
                            ? "لا يوجد نص"
                            : "No message provided")}
                      </div>
                    </div>

                    {/* Display Uploaded Files */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-700 mb-2">
                        {language === "ar"
                          ? "الملفات المرفوعة"
                          : "Uploaded Files"}
                        :
                      </h4>
                      <div className="space-y-3">
                        {/* X-Ray Files */}
                        {uploadedXRaysFiles.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium mb-1">
                              {language === "ar"
                                ? "صور الأشعة"
                                : "X-Ray Images"}
                              :
                            </h5>
                            <div className="bg-[#F1FCFF] rounded-lg p-3">
                              {uploadedXRaysFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between py-1"
                                >
                                  <span>{file.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Medical Report Files */}
                        {uploadedMedicalReportFiles.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium mb-1">
                              {language === "ar"
                                ? "التقارير الطبية"
                                : "Medical Reports"}
                              :
                            </h5>
                            <div className="bg-[#F1FCFF] rounded-lg p-3">
                              {uploadedMedicalReportFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between py-1"
                                >
                                  <span>{file.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {uploadedXRaysFiles.length === 0 &&
                          uploadedMedicalReportFiles.length === 0 && (
                            <div className="bg-white rounded-lg p-3 text-gray-500">
                              {language === "ar"
                                ? "لا توجد ملفات مرفوعة"
                                : "No files uploaded"}
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                      <Button
                        onClick={resetForm}
                        className="bg-[#1588C8] text-white py-2 px-8 rounded-md"
                      >
                        {language === "ar"
                          ? "إرسال طلب جديد"
                          : "Submit New Request"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
