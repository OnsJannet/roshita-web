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

  const onConfirm = () => {
    console.log("Delete clicked");
  };

  return (
    <Card className="flex flex-col pb-[30px] h-[410px]">
      <CardHeader className=" pb-0 flex flex-col justify-start">
      <CardTitle className={language === "ar" ? "text-end" : ""}>{lastDoctorsText}</CardTitle>
        <CardDescription
          className={`flex ${
            language === "ar" ? "flex-row-reverse" : "flex-row"
          } justify-between items-center w-full`}
        >
          {lastDoctorsText}
          <Button>{addDoctorText}</Button>
        </CardDescription>
        <CardContent className="flex flex-row-reverse justify-between items-center w-full ">
          <div className="w-full mt-10 ">
            {DoctorData.slice(0, 5).map((doctor) => (
              <div className="flex justify-between flex-row-reverse w-full items-center">
                <div
                  key={doctor.id}
                  className="flex flex-row-reverse items-center gap-4  mb-2"
                >
                  <Avatar>
                    <AvatarImage
                      src={doctor.img}
                      alt="doctors"
                      className="w-10 h-10"
                    />
                    <AvatarFallback>CN</AvatarFallback>
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
                        onClick={onConfirm}
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
