"use client";
import React, { useEffect, useState } from "react";
import { Bell, CircleCheck, LogOut, MonitorCheck, Settings, UserRound } from "lucide-react";
import AppointementsCard from "@/components/unique/AppointementsCard";
import { useRouter } from "next/navigation";
import { fetchProfileDetails } from "@/lib/api";
import LoadingDoctors from "@/components/layout/LoadingDoctors";
import ConsultationDropdown from "@/components/shared/ConsultationDropdown";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// FileUploader component with remove functionality
const FileUploader = ({ 
  idPrefix, 
  onFilesChange, 
  language 
}: { 
  idPrefix: string; 
  onFilesChange: (files: File[]) => void; 
  language: "ar" | "en" 
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{name: string, url: string}[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      
      // Create previews
      const newPreviews = newFiles.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
      }));
      setPreviews(prev => [...prev, ...newPreviews]);
      
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
      previews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
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
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
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
  },
};

interface EditProfileData {
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  gender: string;
  service_country: number;
  birthday: string;
  city: number;
  user_type: number;
  address: string;
}

interface Specialty {
  id: string;
  name: string;
}

const Page = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<"previous" | "next">("next");
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("ar");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [type, setType] = useState("with");
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [responses, setResponses] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [profileData, setProfileData] = useState<EditProfileData>({
    user: {
      first_name: "",
      last_name: "",
      email: "",
    },
    gender: "",
    service_country: 2,
    birthday: "",
    city: 1,
    user_type: 0,
    address: "",
  });

  const [uploadedXRaysFiles, setUploadedXRaysFiles] = useState<File[]>([]);
  const [uploadedMedicalReportFiles, setUploadedMedicalReportFiles] = useState<File[]>([]);

  const handleFilesChangeXRays = (files: File[]) => {
    setUploadedXRaysFiles(files);
  };

  const handleFilesChangeMedicalReport = (files: File[]) => {
    setUploadedMedicalReportFiles(files);
  };

  const handleSendResponse = async () => {
    const token = localStorage.getItem("access");
    const patient_id = localStorage.getItem("patientId") || "";
  
    const missingFields = [];
    if (!selectedSpecialty) {
      missingFields.push(language === "ar" ? "التخصص" : "specialty");
    }
    if (responseMessage.trim() === "") {
      missingFields.push(language === "ar" ? "رسالة الاستشارة" : "response message");
    }
    if (uploadedMedicalReportFiles.length === 0) {
      missingFields.push(language === "ar" ? "التقارير الطبية" : "medical reports");
    }
  
    if (missingFields.length > 0) {
      let errorMsg = "";
      if (language === "ar") {
        errorMsg = missingFields.length === 1 
          ? `يرجى إدخال ${missingFields[0]}.`
          : `يرجى إدخال ${missingFields.join(" و ")}.`;
      } else {
        errorMsg = missingFields.length === 1
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
        formData.append(`uploaded_files[${index}][content_file_type]`, "X-Ray");
        formData.append(`uploaded_files[${index}][description]`, "Lung X-ray Report");
      });
  
      uploadedMedicalReportFiles.forEach((file, index) => {
        const offsetIndex = uploadedXRaysFiles.length + index;
        formData.append(`uploaded_files`, file);
        formData.append(`uploaded_files[${offsetIndex}][content_file_type]`, "Medical Report");
        formData.append(`uploaded_files[${offsetIndex}][description]`, "Blood test results");
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
        const backendError = responseData.detail || 
                            responseData.message || 
                            (language === "ar" 
                              ? "حدث خطأ أثناء معالجة طلبك" 
                              : "Something went wrong while processing your request");
        
        throw new Error(backendError);
      }
  
      setResponses([...responses, responseMessage]);
      setResponseMessage("");
      setUploadedXRaysFiles([]);
      setUploadedMedicalReportFiles([]);
      setStep(1);
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error("Error creating consultation request:", error);
      
      let errorMessage = language === "ar" 
        ? "فشل في إنشاء طلب الاستشارة. حاول مرة أخرى." 
        : "Failed to create consultation request. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
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

  return (
    <div className="flex justify-center flex-col p-8 bg-[#fafafa]">
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md max-w-md w-full">
            <div className="text-center">
              <div className="flex justify-center">
                <CircleCheck className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                {language === "ar"
                  ? "تم الإرسـال بنجاح"
                  : "Successfully Sent"}
              </h3>
              <div className="mt-2 text-sm text-gray-500">
                {language === "ar"
                  ? "تم الإرسـال طلبك سيتم الرد طلبك خلال 72 ساعة"
                  : "Your request has been sent. Your request will be responded to within 72 hours."}
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  onClick={() => setShowSuccessModal(false)}
                >
                  {language === "ar" ? "حسنا" : "OK"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              {step === 1 ? (
                <div className="flex gap-4 flex-col">
                  <div
                    className="bg-gray-50 w-full p-4 rounded-md flex h-20 items-center justify-between cursor-pointer"
                    onClick={() => {
                      setType("without");
                      setStep(2);
                    }}
                  >
                    <div className="flex gap-4">
                      <img
                        src="/Images/consultation-1.png"
                        className="w-10 h-10"
                      />
                      <div>
                        {language === "en" ? (
                          <>
                            <p>Second Opinion Consultation</p>
                            <p className="text-gray-500">
                              A consultation tailored for individuals with prior
                              diagnoses
                            </p>
                          </>
                        ) : (
                          <>
                            <p>إستشارة (خود راي تاني)</p>
                            <p className="text-gray-500">
                              استشارة مخصصة للأفراد الذين لديهم تشخيص سابق
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <div
                        className={`rounded-full ${
                          type === "without" ? "bg-[#1a8cca]" : "bg-white"
                        } h-2 w-2`}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {errorMessage && (
                    <div
                      className={`text-red-500 bg-red-100 p-4 rounded ${
                        language === "ar" ? "text-start" : "text-end"
                      }`}
                    >
                      {errorMessage}
                    </div>
                  )}
                  {type === "without" ? (
                    <div
                      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
                    >
                      <p className="font-bold p-2 text-xl">
                        {language === "ar"
                          ? "شروط الخـــدمة"
                          : "Terms of Service"}
                      </p>
                      <ul className="list-disc px-5 py-2 marker:text-[#1584c6] text-lg">
                        {language === "ar" ? (
                          <>
                            <li className="text-gray-500">
                              أن يكون لديه تحاليل طبية مسبقا.
                            </li>
                            <li className="text-gray-500">
                              أن يكون لديه تقارير طبية مسبقا.
                            </li>
                            <li className="text-gray-500">
                              أن يكون لديه تشخيص طبي مسبقا.
                            </li>
                          </>
                        ) : (
                          <>
                            <li className="text-gray-500">
                              Must have previous medical tests.
                            </li>
                            <li className="text-gray-500">
                              Must have previous medical reports.
                            </li>
                            <li className="text-gray-500">
                              Must have a previous medical diagnosis.
                            </li>
                          </>
                        )}
                      </ul>
                      <p className="font-bold p-2 text-xl">
                        {language === "ar"
                          ? "عبئ في خانة الاستشارات ماتريد ونزل ملفات الخاصة بك."
                          : "Fill in the consultation box what you want and upload your files."}
                      </p>

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
                                {language === "ar" ? "اختر التخصص" : "Select Specialty"}
                              </option>
                              {specialties.map((specialty) => (
                                <option key={specialty.id} value={specialty.id}>
                                  {specialty.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <textarea
                          value={responseMessage}
                          onChange={(e) => setResponseMessage(e.target.value)}
                          placeholder={
                            language === "ar" ? "اكتب رسالتك..." : "Write your message..."
                          }
                          className="w-full p-2 border border-gray-300 rounded-md h-80"
                          style={{ direction: language === "ar" ? "rtl" : "ltr" }}
                        />

                        <div className="mt-6 mb-6">
                          <Label className="mt-4 mb-4">
                            {language === "ar" ? "تحميل صور الأشعة" : "Upload X-ray Images"}
                          </Label>
                          <div className="mt-4">
                            <FileUploader
                              idPrefix="uploader1"
                              onFilesChange={handleFilesChangeXRays}
                              language={language}
                            />
                          </div>
                        </div>

                        <div className="mt-6 mb-6">
                          <Label>
                            {language === "ar" ? "تحميل التقرير الطبي" : "Upload Medical Report"}
                          </Label>
                          <div className="mt-4">
                            <FileUploader
                              idPrefix="uploader2"
                              onFilesChange={handleFilesChangeMedicalReport}
                              language={language}
                            />
                          </div>
                        </div>

                        <div className="flex justify-center w-full gap-2">
                          <button
                            onClick={handleSendResponse}
                            className="mt-2 bg-[#1588C8] text-white py-2 px-4 rounded-md w-1/4 "
                            disabled={loading}
                          >
                            {loading
                              ? language === "ar"
                                ? "جاري الإرسال..."
                                : "Sending..."
                              : language === "ar"
                              ? "إرسال"
                              : "Send"}
                          </button>
                          <button
                            className="mt-2 bg-white text-[#1588C8] border border-[#1588C8] py-2 px-4 rounded-md w-1/4 "
                            onClick={() => setStep(1)}
                          >
                            {language === "ar" ? "سابق" : "Previous"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
                    >
                      <p className="font-bold p-2 text-xl">
                        {language === "ar"
                          ? "عبئ في خانة الاستشارات ماتريد "
                          : "Fill in the consultation box what you want"}
                      </p>

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
                                {language === "ar" ? "اختر التخصص" : "Select Specialty"}
                              </option>
                              {specialties.map((specialty) => (
                                <option key={specialty.id} value={specialty.id}>
                                  {specialty.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <textarea
                          value={responseMessage}
                          onChange={(e) => setResponseMessage(e.target.value)}
                          placeholder={
                            language === "ar" ? " اكتب رسالتك..." : "Write your message..."
                          }
                          className="w-full p-2 border border-gray-300 rounded-md h-80"
                          style={{ direction: language === "ar" ? "rtl" : "ltr" }}
                        />

                        {errorMessage && (
                          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                        )}
                        <div className="flex justify-center w-full gap-2">
                          <button
                            onClick={handleSendResponse}
                            className="mt-2 bg-[#1588C8] text-white py-2 px-4 rounded-md w-1/4 "
                            disabled={loading}
                          >
                            {loading
                              ? language === "ar"
                                ? "جاري الإرسال..."
                                : "Sending..."
                              : language === "ar"
                              ? "إرسال"
                              : "Send"}
                          </button>
                          <button
                            className="mt-2 bg-white text-[#1588C8] border border-[#1588C8] py-2 px-4 rounded-md w-1/4 "
                            onClick={() => setStep(1)}
                          >
                            {language === "ar" ? "سابق" : "Previous"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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