import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Trash2 } from "lucide-react";
import { DoctorData } from "@/constant";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

type Language = "ar" | "en";

interface DoctorStaff {
  first_name: string;
  last_name: string;
  staff_avatar: string;
  medical_organization: string;
  city: string;
  address: string;
}
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

// Translations object
const translations = {
  en: {
    delete: "Delete",
    confirmMessage:
      "Are you sure you want to delete this item? This action cannot be undone.",
    title: "Delete Confirmation",
    lastDoctors: "Last Added Doctors",
    addDoctor: "Add Doctor",
    cancel: "Cancel",
  },
  ar: {
    delete: "حذف",
    confirmMessage:
      "هل أنت متأكد أنك تريد حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.",
    title: "تأكيد الحذف",
    lastDoctors: "اخر الدكاترة",
    addDoctor: "إضافة",
    cancel: "إلغاء",
  },
};

const AddDoctorCard = () => {
  const [language, setLanguage] = useState<Language>("ar");
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Payment[]>([]);

  // Fetch function
  const fetchData = async () => {
    try {
      // Retrieve the access token from localStorage
      const accessToken = localStorage.getItem("access");

      if (!accessToken) {
        throw new Error("Access token not found");
      }

      // Make the fetch request with the Authorization header
      const response = await fetch("/api/doctors/getDoctors?page=1&limit=10", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`, // Send the token in the Authorization header
        },
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const result: APIResponse = await response.json();

      console.log("result", result);

      // Map Doctor[] to Payment[]
      const paymentData: Payment[] = result.data.map((doctor) => ({
        img: doctor.staff.staff_avatar,
        id: doctor.id.toString(),
        دكاترة: `دكتور ${doctor.staff.first_name} ${doctor.staff.last_name}`,
        "تاريخ الانضمام": new Date(doctor.create_date), // Adjust this field as needed
        التقييم: doctor.rating || 0,
      }));

      setTableData(paymentData); // Set the transformed data
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const accessToken = localStorage.getItem("access"); // Get the token from localStorage
      const response = await fetch(
        `/api/doctors/removeDoctor?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`, // Add the Authorization header with the token
          },
        }
      );
      if (response.ok) {
        console.log(`Deleted doctor with ID: ${id}`);
        // Refresh the page or update the list to reflect the changes
        //window.location.reload();
      } else {
        console.error("Failed to delete doctor");
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
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

  // Get the translated text based on the selected language
  const buttonText = translations[language].delete;
  const confirmMessage = translations[language].confirmMessage;
  const title = translations[language].title;
  const lastDoctorsText = translations[language].lastDoctors;
  const addDoctorText = translations[language].addDoctor;
  const cancelText = translations[language].cancel;

  const onConfirm = (id: number) => {
    console.log("entered on confirm with ID:", id);
    handleDelete(id);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-0 flex flex-col justify-start">
        <CardTitle className={language === "ar" ? "text-end" : ""}>
          {lastDoctorsText}
        </CardTitle>
        <CardDescription
          className={`flex ${
            language === "ar" ? "flex-row-reverse" : "flex-row"
          } justify-between items-center w-full`}
        >
          {lastDoctorsText}
          <Button
            onClick={() => (window.location.href = "/dashboard/doctors/add")}
          >
            {addDoctorText}
          </Button>
        </CardDescription>
        <CardContent
          className={`flex ${
            language === "ar" ? "flex-row-reverse" : "flex-row"
          } justify-between items-center w-full`}
        >
          <div className="w-full mt-10 ">
            {tableData.slice(0, 5).map((doctor, id) => (
              <div
                className={`flex justify-between ${
                  language === "ar" ? "flex-row-reverse" : "flex-row"
                } w-full items-center`}
                key={id}
              >
                <div
                  key={doctor.id}
                  className={`flex ${
                    language === "ar" ? "flex-row-reverse" : "flex-row"
                  } items-center gap-4  mb-2`}
                >
                  <Avatar>
                    <AvatarImage
                      src={doctor.img}
                      alt="doctors"
                      className="w-10 h-10"
                    />
                    <AvatarFallback>D</AvatarFallback>
                  </Avatar>
                  <h3>{doctor.دكاترة}</h3>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Trash2 className="w-4 h-4 cursor-pointer" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-end">
                        {title}
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-end">
                        {confirmMessage}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{cancelText}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onConfirm(parseInt(doctor.id))}
                        className="bg-red-600 hover:bg-red-400"
                      >
                        {buttonText}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </CardContent>
      </CardHeader>
      <CardContent className="flex-1 pb-0"></CardContent>
    </Card>
  );
};

export default AddDoctorCard;
