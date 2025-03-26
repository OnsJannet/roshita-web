"use client";

import { ReactNode } from "react";

type Language = "ar" | "en";

interface MessageAlertProps {
  type: "success" | "error";
  children: ReactNode;
  language?: Language;
  className?: string;
}

export const MessageAlert = ({ type, children, language = "en", className = "" }: MessageAlertProps) => {
  const baseClasses = `p-4 rounded ${language === "ar" ? "text-end" : "text-start"} ${className}`;
  
  if (type === "success") {
    return (
      <div className={`text-green-500 bg-green-100 ${baseClasses}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`text-red-500 bg-red-100 ${baseClasses}`}>
      {children}
    </div>
  );
};