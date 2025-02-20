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
import successModal from "../../../../../components/shared/successModal";
import SuccessModal from "../../../../../components/shared/successModal";

// Define the types for the data you're expecting from the API
interface DoctorStaff {
  first_name: string;
  last_name: string;
  staff_avatar: string;
  medical_organization: string;
  city: string;
  address: string;
}

type Params = {
  id: string;
};

interface Doctor {
  id: number;
  staff: DoctorStaff;
  specialty?: number;
  fixed_price?: string;
  rating?: number;
  is_consultant: boolean;
  create_date: Date;
}

interface APIResponse {
  success: boolean;
  data: Doctor[]; // The correct property is `data`, not `results`
  total: number;
  nextPage: string | null;
  previousPage: string | null;
}

// Define the Payment type
export type Payment = {
  img: string;
  id: string;
  دكاترة: string;
  "تاريخ الانضمام": Date;
  التقييم: number;
};

type Language = "ar" | "en";

export default function Page() {
  const params = useParams<Params>();
  const id = params?.id;

  const [tableData, setTableData] = useState<Payment[]>([]); // Now using Payment[] type
  const [language, setLanguage] = useState<Language>("ar");
  const [lengthData, setLengthData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(10); // Number of requests to display per page
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // State for date filter
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(""); // State for specialty filter

  const message = `مرحباً دكتور،\n  
  أرغب في استشارتك بخصوص بعض الأعراض التي أعاني منها منذ حوالي شهر. أشعر بإرهاق دائم، حتى بعد الحصول على نوم كافٍ، وأعاني من صداع متكرر، خاصة في منطقة الجبهة وحول العينين. أحياناً أشعر بصعوبة في التنفس، خاصة في الليل، مع احتقان دائم في الأنف، وأحياناً ترتفع درجة حرارتي بشكل طفيف.\n  
  \n  
  أنا أعاني من حساسية موسمية منذ سنوات، وأستخدم بخاخاً أنفياً عند الحاجة، لكن هذه الأعراض مختلفة ومستمرة بشكل مزعج. هل يمكن أن تكون مرتبطة بالتهاب الجيوب الأنفية؟ وهل أحتاج إلى إجراء فحوصات أو تغيير العلاج؟\n  
  \n  
  شكراً جزيلاً لوقتك، وأنتظر نصيحتك.\n  
  مع التحية،\n  
  أحمد`;

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

  const files = [
    { name: "Diagnosis", url: "/Images/drahmed.png" },
    { name: "Treatment", url: "/Images/drahmed.png" },
    { name: "Therapy Images", url: "/Images/drahmed.png" },
  ];

  const [loading, setLoading] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [responses, setResponses] = useState<string[]>([]); // Store responses
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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

  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponseMessage(e.target.value);
  };

  const handleSendResponse = () => {
    if (responseMessage.trim() !== "") {
      setResponses([...responses, responseMessage]);
      setResponseMessage(""); // Clear the textarea after sending
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
                <div
                  className={`p-4 flex flex-col ${
                    language === "ar" ? "lg:flex-row-reverse" : "lg:flex-row"
                  } gap-4`}
                >
                  <div className="lg:w-[70%] w-full">
                    <InformationCardConsultation
                      key={1}
                      requestNumber={"1222233"}
                      patientName={"علي احمد"}
                      requestDate={"2025-10-01"}
                      speciality={"Cardiology"}
                      language={language}
                      userType="hospital"
                      typeConsultation="نوع الاستشارة خاصة"
                    />
                  </div>
                  <div className="lg:w-[30%] w-full">
                    <FileListConsultation language={language} files={files} />
                  </div>
                </div>

                {/* Consultation message */}
                <div className="p-4">
                  <ConsultationMessage message={message} />
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

                {/* Textarea for user response */}
                <div className="p-4">
                  <textarea
                    value={responseMessage}
                    onChange={handleResponseChange}
                    placeholder={
                      language === "ar"
                        ? "اكتب ردك..."
                        : "Write your response..."
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
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

                {/*<div>
                  <button onClick={openModal}>Open Modal</button>

                  <SuccessModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    message="This is a success message!"
                  />
                </div>*/}
              </>
            )}
          </div>
        </div>
      </SidebarInset>

      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
