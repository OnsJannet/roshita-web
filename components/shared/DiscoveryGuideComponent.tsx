'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flower2, Stethoscope, Pill, Syringe } from 'lucide-react';

interface ServiceCard {
  title: string;
  description: string;
  buttonText: string;
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
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const router = useRouter();

      useEffect(() => {
        // Get language from localStorage
        const storedLanguage = localStorage.getItem("language") || "ar";
        //@ts-ignore
        setLanguage(storedLanguage);
      }, []);

  const content: LanguageContent = {
    ar: {
      heading: 'إستكشف الدليل',
      subheading: 'مانقدمه',
      description: 'منصة شاملة تحتوي على كافة المعلومات الخاصة بالصيدليات، الأطباء، مراكز التحاليل، والمرافق الطبية في تونس وليبيا. يهدف الدليل إلى تسهيل وصول المستخدمين إلى الخدمات الصحية من خلال بيانات محدثة، دقيقة، وشاملة مما يختصر الوقت ويحسن تجربة الرعاية الصحية.',
      services: [
        {
          title: 'التحاليل',
          description: 'تقديم كافة المعلومات حول التحاليل',
          buttonText: 'إنضم إلينا'
        },
        {
          title: 'الأطباء',
          description: 'تقديم كافة المعلومات حول الأطباء',
          buttonText: 'إنضم إلينا'
        },
        {
          title: 'الصيدلية',
          description: 'تقديم كافة المعلومات حول الصيدلية',
          buttonText: 'إنضم إلينا'
        }
      ]
    },
    en: {
      heading: 'Discover the Guide',
      subheading: 'Introduction',
      description: 'A comprehensive platform containing all information about pharmacies, doctors, analysis centers, and medical facilities in Tunisia and Libya. The guide aims to facilitate user access to health services through updated, accurate, and comprehensive data. This saves time and improves the healthcare experience.',
      services: [
        {
          title: 'Laboratory Tests',
          description: 'Providing all information about laboratory tests',
          buttonText: 'Join Us'
        },
        {
          title: 'Doctors',
          description: 'Providing all information about doctors',
          buttonText: 'Join Us'
        },
        {
          title: 'Pharmacy',
          description: 'Providing all information about pharmacies',
          buttonText: 'Join Us'
        }
      ]
    }
  };

  const currentContent = content[language];
  const icons = [Syringe, Stethoscope, Pill];

  const handleButtonClick = () => {
    router.push('/guide');
  };

  return (
    <div className={`min-h-screen bg-white py-8 px-4 ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 lg:w-1/2 w-full mx-auto">
           <div className="inline-block bg-[#dbf0e5] text-[#81CD96] px-10 py-2 rounded-full text-[16px] font-medium mb-6">
            {currentContent.subheading}
          </div>
          <h1  className="text-[48px] md:text-5xl font-[500] text-gray-900 mb-4">
            {language === 'ar' ? (
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {currentContent.services.map((service, index) => {
            const IconComponent = icons[index];
            const isCenter = index === 1;
            
            return (
              <div
                key={index}
                className={`relative ${
                  isCenter 
                    ? 'bg-[#1588C8] text-white shadow-2xl' 
                    : 'bg-white text-gray-900 shadow-lg hover:shadow-xl'
                } rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className={`w-24 h-24 rounded-2xl flex items-center justify-center ${
                    isCenter 
                      ? 'bg-[#ECF6FF] backdrop-blur-sm' 
                      : 'bg-[#ECF6FF]'
                  }`}>
                    <IconComponent className={`w-8 h-8 ${
                      isCenter ? 'text-[#0086FF]' : 'text-[#0086FF]'
                    }`} />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className={`text-2xl font-bold mb-4 ${
                    isCenter ? 'text-white' : 'text-gray-900'
                  }`}>
                    {service.title}
                  </h3>
                  <p className={`mb-8 leading-relaxed ${
                    isCenter ? 'text-blue-100' : 'text-gray-600'
                  }`}>
                    {service.description}
                  </p>
                  
                  {/* Button */}
                  <button 
                    onClick={handleButtonClick}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      isCenter 
                        ? 'bg-white text-[#1588C8] hover:bg-blue-50 hover:scale-105' 
                        : 'bg-[#1588C8] text-white hover:bg-[#1588C8] hover:scale-105'
                    }`}
                  >
                    {service.buttonText}
                    <svg 
                      className={`w-4 h-4 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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