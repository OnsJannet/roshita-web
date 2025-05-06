"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumb from "@/components/layout/app-breadcrumb";
import LoadingDoctors from "@/components/layout/LoadingDoctors";
import PaginationDemo from "@/components/shared/PaginationDemo";
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

// Define the types for the data you're expecting from the API
interface ConsultationResponse {
  consultation_request: {
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
    patient_files: { id: number; file: string; file_type: string; content_file_type: string; description: string; create_date: string }[];
    status: string;
    consultation_response: any;
    create_date: string;
  };
  consultation_response: any;
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
  patient_files: { name: string; url: string }[];
  status: string;
  requestDate?: string; // Add this field if available in the API response
  doctor_appointment_date_id: number;
  consultation_response?: any;
}

type Language = "ar" | "en";

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = params?.id; // Get the dynamic ID from the URL
  const [userType, setUserType] = useState<string>("");
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [language, setLanguage] = useState<Language>("ar");
  const [loading, setLoading] = useState<boolean>(true);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [responses, setResponses] = useState<string[]>([]);
  const [serviceType, setServiceType] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Get user type from localStorage safely (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const storedUserType = localStorage.getItem("type");
      if (storedUserType) {
        setUserType(storedUserType);
        console.log("Setting userType from localStorage:", storedUserType);
      }
    }
  }, []);

  console.log("userType state value:", userType)

  // Fetch consultation details based on the ID
  const fetchConsultationDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        throw new Error("Access token not found");
      }

      const response = await fetch(
        //`http://www.test-roshita.net/api/consultation-requests/unreviewing_consultation/${id}/`,
        `https://test-roshita.net/api/consultation-requests/${id}/`,
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

      const responseData: ConsultationResponse = await response.json();
      
      // Extract consultation data from the nested structure
      if (responseData.consultation_request) {
        const consultationData = responseData.consultation_request;
        
        // Transform the patient_files format to match the expected format
        const formattedFiles = consultationData.patient_files.map(file => ({
          name: file.description || file.content_file_type,
          url: file.file
        }));
        
        // Create a consultation object with the expected structure
        const formattedConsultation: Consultation = {
          id: consultationData.id,
          diagnosis_description_request: consultationData.diagnosis_description_request,
          patient: consultationData.patient,
          specialty: consultationData.specialty,
          patient_files: formattedFiles,
          status: consultationData.status,
          requestDate: consultationData.create_date ? new Date(consultationData.create_date).toISOString().split('T')[0] : '',
          doctor_appointment_date_id: 0, // Default value as it might not be in the response
          consultation_response: consultationData.consultation_response
        };
        
        setConsultation(formattedConsultation);
      }
    } catch (error) {
      console.error("Error fetching consultation details:", error);
      setError(error instanceof Error ? error.message : "An error occurred while fetching consultation details");
    } finally {
      setLoading(false);
    }
  };

  // Fetch consultation details when the component mounts or the ID changes
  useEffect(() => {
    if (id) {
      fetchConsultationDetails();
    }
  }, [id]);

  // Handle language change
  useEffect(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
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
    }
  }, []);

  // Handle response message change
  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponseMessage(e.target.value);
  };

  // Handle sending a response
  /*const handleSendResponse = () => {
    if (responseMessage.trim() !== "") {
      setResponses([...responses, responseMessage]);
      setResponseMessage(""); // Clear the textarea after sending
    }
  };*/

  // Handle estimated price change
  const handleEstimatedPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEstimatedPrice(e.target.value);
  };

  // Breadcrumb items
  const items = [
    { label: language === "ar" ? "الرئسية" : "Dashboard", href: "#" },
    {
      label: language === "ar" ? "الاستشارات" : "Consultations",
      href: `/dashboard/consultations`,
    },
    {
      label: language === "ar" ? `${id}` : `${id}`,
      href: `/dashboard/consultations/${id}`,
    },
  ];

  // Handle sending a response
  const handleSendResponse = async () => {
    if (responseMessage.trim() !== "") {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          throw new Error("Access token not found");
        }

        const responseConsultationId = id;

        const response = await fetch(
          `http://www.test-roshita.net/api/doctor-response-consultation/${responseConsultationId}/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              diagnosis_description_response: responseMessage,
              estimated_cost: estimatedPrice,
              service_type: serviceType,
              doctor_appointment_date_id:
                consultation?.doctor_appointment_date_id,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to send response");
        }

        const data = await response.json();
        console.log("Response sent successfully:", data);

        // Update the state to include the new response
        setResponses([...responses, responseMessage]);
        setResponseMessage(""); // Clear the textarea after sending
      } catch (error) {
        console.error("Error sending response:", error);
      }
    }
  };


  console.log("userType", userType)

  return loading ? (
    <div className="flex items-center justify-center min-h-screen mx-auto">
      <LoadingDoctors />
    </div>
  ) : error ? (
    <div className={`text-red-500 bg-red-100 p-4 rounded ${language === "ar" ? "text-end" : "text-start"}`}>
      {language === "ar" ? "حدث خطأ ما، يرجى المحاولة مرة أخرى" : "An error occurred. Please try again."}
    </div>
  ) : (
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
            <SidebarTrigger className="rotate-180 " />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="mx-auto w-full">
            {loading ? (
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            ) : (
              <>
                {consultation && (
                  <>
                    <div
                      className={`p-4 flex flex-col ${
                        language === "ar"
                          ? "lg:flex-row-reverse"
                          : "lg:flex-row"
                      } gap-4`}
                    >
                      <div className="lg:w-[70%] w-full">
                        <InformationCardConsultation
                          key={consultation.id}
                          requestNumber={consultation.id.toString()}
                          patientName={consultation.patient.full_name}
                          requestDate={consultation.requestDate || "N/A"}
                          speciality={consultation.specialty.name}
                          language={language}
                          userType="doctor"
                          typeConsultation="نوع الاستشارة خاصة"
                        />
                      </div>
                      <div className="lg:w-[30%] w-full">
                        <FileListConsultation
                          language={language}
                          files={consultation.patient_files}
                        />
                      </div>
                    </div>

                    {/* Consultation message */}
                    <div className="p-4">
                      <ConsultationMessage
                        message={consultation.diagnosis_description_request || ""}
                      />
                    </div>

                    {/* Displaying responses */}

                    {consultation.status !== "Completed" ? (
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
                    ) : (
                      <div
                        className="mb-4 p-4 bg-gray-100 rounded-md"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        <p>
                          {
                            //@ts-ignore
                            consultation.consultation_response
                              .diagnosis_description_response
                          }
                        </p>
                      </div>
                    )}

                    {consultation.status !== "Completed" && userType !== '"Hospital"' && (
                      <div>
                        {/* Service Type Selection Dropdown */}
                        <div className="p-4">
                          <label
                            className={`block text-sm font-medium mb-2 ${
                              language === "ar" ? "text-right" : "text-left"
                            }`}
                          >
                            {language === "ar" ? "نوع الخدمة" : "Service Type"}
                          </label>
                          <Select
                            onValueChange={(value) => setServiceType(value)}
                          >
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
                              <SelectItem
                                value="Shelter"
                                className={
                                  language === "ar"
                                    ? "text-right flex-row-reverse"
                                    : "text-left"
                                }
                              >
                                {language === "ar" ? "مأوى" : "Shelter"}
                              </SelectItem>
                              <SelectItem
                                value="Shelter_Operation"
                                className={
                                  language === "ar"
                                    ? "text-right flex-row-reverse"
                                    : "text-left"
                                }
                              >
                                {language === "ar"
                                  ? "عملية مأوى"
                                  : "Shelter Operation"}
                              </SelectItem>
                              <SelectItem
                                value="Operation"
                                className={
                                  language === "ar"
                                    ? "text-right flex-row-reverse"
                                    : "text-left"
                                }
                              >
                                {language === "ar" ? "عملية" : "Operation"}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Estimated Price Input */}
                        <div className="p-4">
                          <label
                            className={`block text-sm font-medium mb-2 ${
                              language === "ar" ? "text-right" : "text-left"
                            }`}
                          >
                            {language === "ar"
                              ? "السعر المقدر"
                              : "Estimated Price"}
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
                        </div>

                        {/* Response Textarea */}

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
                            style={{
                              direction: language === "ar" ? "rtl" : "ltr",
                            }}
                          />
                          <div className="flex justify-center w-full">
                            <button
                              onClick={handleSendResponse}
                              className="mt-2 bg-[#1588C8] text-white py-2 px-4 rounded-md w-1/4 mt-4"
                            >
                              {language === "ar" ? "إرسال" : "Send"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </SidebarInset>

      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
