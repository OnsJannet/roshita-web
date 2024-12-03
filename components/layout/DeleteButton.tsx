"use client";

import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";


interface DeleteButtonProps {
  onConfirm: () => void;
  buttonText?: string;
  confirmMessage?: string;
  title?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onConfirm,
  buttonText = "حذف",
  confirmMessage = "هل أنت متأكد أنك تريد حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.",
  title = "تأكيد الحذف",
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition">
          {buttonText}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-end">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-end">{confirmMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-400">حذف</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
