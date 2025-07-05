'use client';

import React, { useEffect, useState } from 'react';

interface ServiceData {
  title: string;
  description: string;
}

interface ServicesContent {
  heading: string;
  services: ServiceData[];
}

interface LanguageContent {
  ar: ServicesContent;
  en: ServicesContent;
}

const ServicesComponent: React.FC = () => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

    useEffect(() => {
      // Get language from localStorage
      const storedLanguage = localStorage.getItem("language") || "ar";
      //@ts-ignore
      setLanguage(storedLanguage);
    }, []);

  const content: LanguageContent = {
    ar: {
      heading: '<span class="text-[#1588C8]">خدمات</span> روشيــــتا',
      services: [
                {
          title: 'شفافية تقييمات الأطباء قبل',
          description: 'الحجز هذه الشفافية تعطي المرضى فرصـــــــة أفضل وتخفيف من القلق تجاه الاختبـــــــار الطبي، مما يمكنهم من اتخاذ قرار واثق ومبني على تجارب حقيقية.'
        },
        {
          title: 'مقــــــــارنة عادلة بين الجودة والسعر',
          description: 'تتيح للمستخدمـــــــين اختيار الأطبــــــــاء الأفضل من حيث التـــــــــيمة المالية والخدمة الطبيعة دون دفع مبالغ زائدة أو التضحية في الجودة.'
        },
        {
          title: 'بوابة حجز ومتابعة صحية شاملة',
          description: 'توفر هذه المنصة الشاملة للمستخدم رحلة سلسة بدون انقطاع للحصول على الرعاية والحجوزات الطبية وفترة انتظار الاعتماد على الخدمات الرقمية بعد توسيعها في تونس وليبيا.'
        }
      ]
    },
    en: {
      heading: 'Roshita Services',
      services: [
        {
          title: 'Comprehensive Health Booking and Tracking Portal',
          description: 'This comprehensive platform provides users with a seamless, uninterrupted journey to access medical care and bookings, with digital services expansion planned for Tunisia and Libya.'
        },
        {
          title: 'Fair Comparison Between Quality and Price',
          description: 'Allows users to choose the best doctors in terms of financial value and natural service without paying extra amounts or sacrificing quality.'
        },
        {
          title: 'Transparent Doctor Reviews Before Booking',
          description: 'This transparency gives patients a better opportunity and reduces anxiety towards medical testing, enabling them to make confident decisions based on real experiences.'
        }
      ]
    }
  };

  const currentContent = content[language];
  const iconImages = [
    '/images/vector.png',
    '/images/percentage.png',
    '/images/computer.png'
  ];

  return (
    <div className={`min-h-screen bg-[#f6f9fc] py-16 px-12 ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-[#dbf0e5] text-[#81CD96] px-10 py-2 rounded-full text-[16px] font-medium mb-6">
            {language === 'ar' ? 'مانقدمه' : 'Our Services'}
          </div>
          <h1 
            className="text-[48px] md:text-5xl font-[500] text-gray-900 mb-4"
            dangerouslySetInnerHTML={{ __html: currentContent.heading }}
          />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentContent.services.map((service, index) => (
            <div
              key={index}
              className="bg-transparent rounded-2xl p-8 duration-300"
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center">
                  <img 
                    src={iconImages[index]} 
                    alt={service.title} 
                    className="w-14 h-14 object-contain"
                  />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-16 h-1 bg-[#70C168] rounded-full mx-auto mb-6"></div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight lg:text-start text-center">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm lg:text-start text-center">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesComponent;