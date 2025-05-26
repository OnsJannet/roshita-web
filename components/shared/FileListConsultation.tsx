import { Download } from "lucide-react";
import React from "react";

/* @ts-ignore */
const FileListConsultation = ({ files, language }) => {
  /* @ts-ignore */
  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  const texts = {
    en: { title: "Files", download: "Download", noFiles: "No files available" },
    ar: { title: "ملفات", download: "تحميل", noFiles: "لا توجد ملفات متاحة" },
  };

  /* @ts-ignore */
  const langTexts = texts[language] || texts.en;

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toUpperCase() || '';
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3
        className={`text-lg font-semibold mb-3 ${
          language === "ar"
            ? "text-right lg:flex-row-reverse flex-col"
            : "text-left lg:flex-row flex-col"
        }`}
      >
        {langTexts.title}
      </h3>
      <ul className="space-y-3 h-40 overflow-y-auto">
        {files.length > 0 ? (
          /* @ts-ignore */
          files.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-white p-2 rounded-lg border"
            >
              <span className="text-gray-600 font-medium flex items-center">
                <span className="bg-gray-50 text-sm px-2 py-[1px] rounded mr-2">
                  {getFileExtension(file.file)}
                </span>
                {file.description}
              </span>
              <button
                onClick={() => handleDownload(file.file, file.description)}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                <Download className="h-4 w-4" />
              </button>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500 py-4">
            {langTexts.noFiles}
          </li>
        )}
      </ul>
    </div>
  );
};

export default FileListConsultation;