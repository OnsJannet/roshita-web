"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Input } from "../ui/input";

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void;
  language?: "en" | "ar"; // Make it optional with a default value
  idPrefix: string; // Add an idPrefix prop to ensure unique ids
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesChange, language = "en", idPrefix }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Ensure language is either "en" or "ar"
  const validatedLanguage = language === "en" || language === "ar" ? language : "en";

  // Translations based on language
  const translations = {
    en: {
      dragAndDrop: "Drag 'n' drop files here, or",
      clickToSelect: "click to select files",
      fileLimit: "You can upload up to 4 files (up to 4 MB each)",
      removeFile: "Remove file",
    },
    ar: {
      dragAndDrop: "اسحب وأسقط الملفات هنا، أو",
      clickToSelect: "انقر لتحديد الملفات",
      fileLimit: "يمكنك تحميل ما يصل إلى 4 ملفات (بحد أقصى 4 ميجابايت لكل ملف)",
      removeFile: "إزالة الملف",
    },
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      addFiles(Array.from(selectedFiles));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles) {
      addFiles(Array.from(droppedFiles));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => file.size <= 4 * 1024 * 1024); // 4 MB limit

    // Prevent exceeding the file limit
    if (files.length + validFiles.length > 4) {
      alert(
        validatedLanguage === "en"
          ? "You can only upload up to 4 files."
          : "يمكنك تحميل ما يصل إلى 4 ملفات فقط."
      );
      return;
    }

    // Update files state properly
    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles); // Notify parent about the updated files
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles); // Notify parent about the updated files
  };

  return (
    <div className="space-y-4 w-full mx-auto p-6 border rounded-lg shadow-sm bg-white">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ direction: validatedLanguage === "ar" ? "rtl" : "ltr" }} // Set text direction based on language
      >
        <Label htmlFor={`${idPrefix}-file-upload`} className="cursor-pointer">
          <p className="text-gray-600">
            {translations[validatedLanguage].dragAndDrop}{" "}
            <span className="text-blue-600 hover:text-blue-500">
              {translations[validatedLanguage].clickToSelect}
            </span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {translations[validatedLanguage].fileLimit}
          </p>
        </Label>
        <Input
          id={`${idPrefix}-file-upload`}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border rounded-lg"
              style={{ direction: validatedLanguage === "ar" ? "rtl" : "ltr" }} // Set text direction based on language
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{file.name}</span>
                <span className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-500 hover:text-red-500"
                aria-label={translations[validatedLanguage].removeFile}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
