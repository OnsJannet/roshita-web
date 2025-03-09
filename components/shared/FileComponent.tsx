import React from "react";
import { Download } from "lucide-react";

interface FileComponentProps {
  fileName: string;
  fileUrl: string;
  language: string;
}

const FileComponent: React.FC<FileComponentProps> = ({ fileName, fileUrl, language }) => {
    const isArabic = language === "ar";
  return (
    <div className={`flex ${isArabic ? "flex-row-reverse" : "flex-row-reverse"} justify-between items-center bg-gray-50 rounded-lg p-4 w-full shadow-sm`}>
      <span className={`text-sm ${isArabic ? "text-right" : "text-left"} text-gray-700`}>{fileName}</span>
      <a
        //download={fileName}
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700"
        aria-label="Download file"
      >
        <Download size={20} />
      </a>
    </div>
  );
};

export default FileComponent;
