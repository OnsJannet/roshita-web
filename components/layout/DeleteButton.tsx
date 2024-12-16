"use client";

import React, { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

interface DeleteButtonProps {
  onConfirm: () => void;
  buttonText?: string;
  confirmMessage?: string;
  title?: string;
}

type Language = "ar" | "en";

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onConfirm,
  buttonText = "حذف", // Default to Arabic
  confirmMessage = "هل أنت متأكد أنك تريد حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.", // Default to Arabic
  title = "تأكيد الحذف", // Default to Arabic
}) => {
  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage as Language);
    } else {
      setLanguage("ar"); // Default to Arabic
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

  // Translations for English
  const translations = {
    buttonText: language === "ar" ? "حذف" : "Delete",
    confirmMessage: language === "ar" ? "هل أنت متأكد أنك تريد حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء." : "Are you sure you want to delete this item? This action cannot be undone.",
    title: language === "ar" ? "تأكيد الحذف" : "Confirm Deletion",
    cancel: language === "ar" ? "إلغاء" : "Cancel",
    action: language === "ar" ? "حذف" : "Delete",
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition">
          {translations.buttonText}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={language === "ar" ? "text-end" : "text-start"}>{translations.title}</AlertDialogTitle>
          <AlertDialogDescription className={language === "ar" ? "text-end" : "text-start"}>{translations.confirmMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={language === "ar" ? "text-end" : "text-start"}>{translations.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-400">{translations.action}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
