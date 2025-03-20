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
  consultation_response_id: number;
  patient_files: { name: string; url: string }[];
  status: string;
  requestDate?: string; // Add this field if available in the API response
  doctor_appointment_date_id: number;
}

type Language = "ar" | "en";

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = params?.id; // Get the dynamic ID from the URL

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [language, setLanguage] = useState<Language>("ar");
  const [loading, setLoading] = useState<boolean>(true);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [responses, setResponses] = useState<string[]>([]);
  const [serviceType, setServiceType] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch consultation details based on the ID
  const fetchConsultationDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        throw new Error("Access token not found");
      }

      const response = await fetch(
        //`https://www.test-roshita.net/api/consultation-requests/by_doctor/${id}/`,
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

      const data: Consultation = await response.json();
      setConsultation(data);
    } catch (error) {
      console.error("Error fetching consultation details:", error);
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

      const responseConsultationId = consultation?.consultation_response_id; // Assuming `id` is the response-consultation-id

      const response = await fetch(
        `https://www.test-roshita.net/api/doctor-response-consultation/${responseConsultationId}/`,
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
            //doctor_appointment_date_id: consultation?.doctor_appointment_date_id
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

  return loading ? (
    <div className="flex items-center justify-center min-h-screen mx-auto">
      <LoadingDoctors />
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
                        message={consultation.diagnosis_description_request}
                      />
                    </div>

                    {/* Displaying responses */}
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


                    {consultation.status !== "Reviewed" && (

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
                          <Select onValueChange={(value) => setServiceType(value)}>
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
                            style={{ direction: language === "ar" ? "rtl" : "ltr" }}
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