"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ServiceCard {
  title: string;
  description: string;
  buttonText: string;
  type: string;
}

interface Content {
  heading: string;
  subheading: string;
  description: string;
  services: ServiceCard[];
}

interface LanguageContent {
  ar: Content;
  en: Content;
}

const DiscoveryGuideComponent: React.FC = () => {
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const router = useRouter();

  useEffect(() => {
    // Get language from localStorage
    const storedLanguage = localStorage.getItem("language") || "ar";
    //@ts-ignore
    setLanguage(storedLanguage);
  }, []);

  const content: LanguageContent = {
    ar: {
      heading: "إستكشف الدليل",
      subheading: "مانقدمه",
      description:
        "منصة شاملة تحتوي على كافة المعلومات الخاصة بالصيدليات، الأطباء، مراكز التحاليل، والمرافق الطبية في تونس وليبيا. يهدف الدليل إلى تسهيل وصول المستخدمين إلى الخدمات الصحية من خلال بيانات محدثة، دقيقة، وشاملة مما يختصر الوقت ويحسن تجربة الرعاية الصحية.",
      services: [
        {
          title: "مستشفيات",
          description: "تقديم كافة المعلومات حول مستشفيات",
          buttonText: "إسكتشف ",
          type: "hospitals"
        },
        {
          title: "الأطباء",
          description: "تقديم كافة المعلومات حول الأطباء",
          buttonText: "إسكتشف",
          type: "doctors"
        },
        {
          title: "التحاليل",
          description: "تقديم كافة المعلومات حول التحاليل",
          buttonText: "إسكتشف",
          type: "labs"
        },
        {
          title: "الصيدلية",
          description: "تقديم كافة المعلومات حول الصيدلية",
          buttonText: "إسكتشف",
          type: "pharmacies"
        },
      ],
    },
    en: {
      heading: "Discover the Guide",
      subheading: "Introduction",
      description:
        "A comprehensive platform containing all information about pharmacies, doctors, analysis centers, and medical facilities in Tunisia and Libya. The guide aims to facilitate user access to health services through updated, accurate, and comprehensive data. This saves time and improves the healthcare experience.",
      services: [
        {
          title: "Hospitals",
          description: "Providing all information about Hospitals",
          buttonText: "Join Us",
          type: "hospitals"
        },
        {
          title: "Doctors",
          description: "Providing all information about doctors",
          buttonText: "Join Us",
          type: "doctors"
        },
        {
          title: "Laboratory Tests",
          description: "Providing all information about laboratory tests",
          buttonText: "Join Us",
          type: "labs"
        },
        {
          title: "Pharmacy",
          description: "Providing all information about pharmacies",
          buttonText: "Join Us",
          type: "pharmacies"
        },
      ],
    },
  };

  const currentContent = content[language];

  // Image URLs for each service
  const serviceImages = [
    "https://i.ibb.co/Q3408fv6/hosp.png", // Hospitals
    "https://i.ibb.co/b56Pj4GP/doctor.png", // Doctors
    "https://i.ibb.co/Z1W9GbMK/leb.png", // Laboratory Tests
    "https://i.ibb.co/RTWtddxV/pharmacy.png", // Pharmacy
  ];

  const handleButtonClick = (type: string) => {
    router.push(`/guide/${type}`);
  };

  return (
    <div
      className={`min-h-screen bg-white py-8 px-4 ${
        language === "ar" ? "rtl" : "ltr"
      }`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 lg:w-1/2 w-full mx-auto">
          <div className="inline-block bg-[#dbf0e5] text-[#81CD96] px-10 py-2 rounded-full text-[16px] font-medium mb-6">
            {currentContent.subheading}
          </div>
          <h1 className="text-[48px] md:text-5xl font-[500] text-gray-900 mb-4">
            {language === "ar" ? (
              <>
                <span>إستكشف </span>
                <span className="text-[#1588C8]">الدليل</span>
              </>
            ) : (
              <>
                <span>Discover the </span>
                <span className="text-[#1588C8]">Guide</span>
              </>
            )}
          </h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-600 text-lg leading-relaxed lg:text-start text-center">
              {currentContent.description}
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {currentContent.services.map((service, index) => {
            const isCenter = index === 1;
            const imageUrl = serviceImages[index];

            return (
              <div
                key={index}
                className={`relative ${
                  isCenter
                    ? "bg-white hover:bg-[#1588C8] hover:text-white text-gray-900 shadow-lg hover:shadow-xl"
                    : "bg-white hover:bg-[#1588C8] hover:text-white text-gray-900 shadow-lg hover:shadow-xl"
                } rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Image */}
                <div className="flex justify-center mb-6">
                  <div
                    className={`w-24 h-24 rounded-2xl flex items-center justify-center ${
                      isCenter ? "bg-[#ECF6FF]" : "bg-[#ECF6FF]"
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={service.title}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3
                    className={`text-2xl font-bold mb-4 ${
                      isCenter ? "text-gray-900" : "text-gray-900"
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`mb-8 leading-relaxed ${
                      isCenter ? "text-gray-600" : "text-gray-600"
                    }`}
                  >
                    {service.description}
                  </p>

                  {/* Button */}
                  <button
                    onClick={() => handleButtonClick(service.type)}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      isCenter
                        ? "bg-[#1588C8] text-white hover:bg-[#1588C8] hover:scale-105"
                        : "bg-[#1588C8] text-white hover:bg-[#1588C8] hover:scale-105"
                    }`}
                  >
                    {service.buttonText}
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        language === "ar" ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DiscoveryGuideComponent;