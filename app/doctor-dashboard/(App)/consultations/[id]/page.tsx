"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumb from "@/components/layout/app-breadcrumb";
import LoadingDoctors from "@/components/layout/LoadingDoctors";
import RequestCard from "@/components/shared/RequestCard";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import InformationCardConsultation from "@/components/shared/InformationCardConsultation";
import FileListConsultation from "@/components/shared/FileListConsultation";
import ConsultationMessage from "@/components/shared/ConsultationMessage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PatientFile {
  id: number;
  file: string;
  file_type: string;
  content_file_type: string;
  description: string;
  create_date: string;
}

interface ConsultationResponse {
  id: number;
  diagnosis_description_response: string;
  selected_medical_organization: {
    id: number;
    name: string;
    foreign_name: string;
  };
  doctor: {
    id: number;
    name: string;
    last_name: string;
    specialty: string;
  };
  doctor_appointment_date: {
    id: number;
    scheduled_date: string;
    start_time: string;
    end_time: string;
    appointment_status: string;
  };
  estimated_cost: string;
  service_type: string;
  status: string;
}

interface Consultation {
  id: number;
  diagnosis_description_request: string;
  patient: {
    id: number;
    full_name: string;
  };
  specialty: {
    id: number;
    name: string;
  };
  patient_files: PatientFile[];
  status: string;
  consultation_response: ConsultationResponse;
  create_date: string;
}

interface ApiResponse {
  consultation_request: Consultation;
  consultation_response: ConsultationResponse;
}

type Language = "ar" | "en";

export default function Page() {
  // Add error state
  const [error, setError] = useState<string | null>(null);
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [responseData, setResponseData] = useState<ConsultationResponse | null>(null);
  const [language, setLanguage] = useState<Language>("ar");
  const [loading, setLoading] = useState<boolean>(true);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [responses, setResponses] = useState<string[]>([]);
  const [serviceType, setServiceType] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");

  const fetchConsultationDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        throw new Error("Access token not found");
      }

      const response = await fetch(
        //`https://test-roshita.net/api/consultation-requests/${id}/`,
        `https://test-roshita.net/api/second-opinion-requests/${id}/`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch consultation details");
      }

      const data: ApiResponse = await response.json();
      setConsultation(data.consultation_request);
      setResponseData(data.consultation_response);
      
      // If there's an existing response, add it to the responses array
      if (data.consultation_response?.diagnosis_description_response) {
        setResponses([data.consultation_response.diagnosis_description_response]);
      }
    } catch (error) {
      console.error("Error fetching consultation details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchConsultationDetails();
    }
  }, [id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLanguage = localStorage.getItem("language") as Language | null;
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }

      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === "language") {
          setLanguage((event.newValue as Language) || "ar");
        }
      };

      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, []);

  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponseMessage(e.target.value);
  };

  const handleEstimatedPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEstimatedPrice(e.target.value);
  };

  const handleSendResponse = async () => {
    if (!responseMessage.trim()) return;
    setError(null); // Clear previous errors

    try {
      const token = localStorage.getItem("access");
      if (!token) throw new Error("Access token not found");

      const response = await fetch(
        //`https://test-roshita.net/api/doctor-response-consultation/${responseData?.id}/`,
        `https://test-roshita.net/api/doctor-response-second-opinion/${responseData?.id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            diagnosis_description_response: responseMessage,
            //estimated_cost: estimatedPrice,
            service_type: serviceType,
          }),
        }
      );

      const data = await response.json();
      window.location.href = "/doctor-dashboard/consultations";
      if (!response.ok) {
        throw new Error(data.message || data.detail || "Failed to send response");
      }

      console.log("Response sent successfully:", data);
      setResponses([...responses, responseMessage]);
      setResponseMessage("");
      fetchConsultationDetails();
    } catch (error) {
      console.error("Error sending response:", error);
      setError(language === "ar" 
        ? `حدث خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
        : `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const items = [
    { label: language === "ar" ? "الرئيسية" : "Dashboard", href: "#" },
    {
      label: language === "ar" ? "الاستشارات" : "Consultations",
      href: `/dashboard/consultations`,
    },
    {
      label: `${id}`,
      href: `/dashboard/consultations/${id}`,
    },
  ];

  return (
    <SidebarProvider>
      <SidebarInset>
        <header
          className={`flex ${
            language === "ar" ? "justify-end" : "justify-between"
          } h-16 shrink-0 items-center border-b px-4 gap-2`}
        >
          <div
            className={`flex ${
              language === "ar" ? "flex-row" : "flex-row-reverse"
            } gap-2 items-center`}
          >
            <Breadcrumb items={items} translate={(key) => key} />
            <SidebarTrigger className="rotate-180" />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 mx-auto w-full">
          {/* Add error display */}
          {error && (
            <div 
              className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 ${
                language === "ar" ? "text-right" : "text-left"
              }`}
              role="alert"
            >

              <span className="block sm:inline">
                {error}
              </span>
              <button 
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setError(null)}
              >
                <span className="sr-only">Close</span>
                <svg 
                  className="fill-current h-6 w-6 text-red-500" 
                  role="button" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20"
                >
                  <title>Close</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
              </button>
            </div>
          )}

          {consultation && (
            <>
              <div
                className={`p-4 flex flex-col ${
                  language === "ar" ? "lg:flex-row-reverse" : "lg:flex-row"
                } gap-4`}
              >
                <div className="lg:w-[70%] w-full">
                  <InformationCardConsultation
                    key={consultation.id}
                    requestNumber={consultation.id.toString()}
                    patientName={consultation.patient.full_name}
                    requestDate={consultation.create_date.split('T')[0]}
                    speciality={consultation.specialty.name}
                    language={language}
                    userType="doctor"
                    typeConsultation={consultation.consultation_response?.service_type || ""}
                  />
                </div>
                <div className="lg:w-[30%] w-full">
                  <FileListConsultation
                    language={language}
                    files={consultation.patient_files}
                  />
                </div>
              </div>

              <div className="p-4">
                <ConsultationMessage
                  message={consultation.diagnosis_description_request}
                />
              </div>

              <div className="p-4 mt-4">
                {responses.map((response, index) => (
                  <div
                    key={index}
                    className="mb-4 p-4 bg-gray-100 rounded-md"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    <p>{response}</p>
                  </div>
                ))}
              </div>

              {consultation.status !== "Completed" && (
                <div>
                  <div className="p-4">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {language === "ar" ? "نوع الخدمة" : "Service Type"}
                    </label>
                    <Select onValueChange={setServiceType}>
                      <SelectTrigger
                        className={
                          language === "ar"
                            ? "text-right flex-row-reverse"
                            : "text-left"
                        }
                      >
                        <SelectValue
                          placeholder={
                            language === "ar"
                              ? "اختر نوع الخدمة"
                              : "Select Service Type"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent
                        className={
                          language === "ar"
                            ? "text-right flex-row-reverse"
                            : "text-left"
                        }
                      >
                        <SelectItem value="Shelter">
                          {language === "ar" ? "مأوى" : "Shelter"}
                        </SelectItem>
                        <SelectItem value="Shelter Operation">
                          {language === "ar"
                            ? "عملية مأوى"
                            : "Shelter Operation"}
                        </SelectItem>
                        <SelectItem value="Operation">
                          {language === "ar" ? "عملية" : "Operation"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/*<div className="p-4">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {language === "ar" ? "السعر المقدر" : "Estimated Price"}
                    </label>
                    <input
                      type="text"
                      value={estimatedPrice}
                      onChange={handleEstimatedPriceChange}
                      placeholder={
                        language === "ar" ? "أدخل السعر" : "Enter price"
                      }
                      className={`w-full p-2 border border-gray-300 rounded-md ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    />
                  </div>*/}

                  <div className="p-4">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {language === "ar" ? "الرد" : "Response"}
                    </label>
                    <textarea
                      value={responseMessage}
                      onChange={handleResponseChange}
                      placeholder={
                        language === "ar"
                          ? "اكتب ردك..."
                          : "Write your response..."
                      }
                      className={`w-full p-2 border border-gray-300 rounded-md ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
                    />
                    <div className="flex justify-center w-full">
                      <button
                        onClick={handleSendResponse}
                        className="mt-4 bg-[#1588C8] text-white py-2 px-4 rounded-md w-1/4"
                      >
                        {language === "ar" ? "إرسال" : "Send"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </SidebarInset>

      <AppSidebar side="right" />
    </SidebarProvider>
  );
}