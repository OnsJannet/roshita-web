'use client';

import React, { useEffect, useState } from 'react';

interface PolicySection {
  title: string;
  content: string[];
}

interface PrivacyContent {
  heading: string;
  lastUpdated: string;
  introduction: string;
  sections: PolicySection[];
  contactTitle: string;
}

interface LanguagePrivacyContent {
  ar: PrivacyContent;
  en: PrivacyContent;
}

const PrivacyPolicy: React.FC = () => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    // Get language from localStorage
    const storedLanguage = localStorage.getItem("language") || "ar";
    //@ts-ignore
    setLanguage(storedLanguage);
  }, []);

  const content: LanguagePrivacyContent = {
    ar: {
      heading: '<span class="text-[#1588C8]">سياسة الخصوصية</span> لمنصة روشيتا الصحية',
      lastUpdated: 'آخر تحديث: 31 يوليو 2025',
      introduction: 'تلتزم روشيتا بحماية خصوصيتك وسرية معلوماتك الطبية. توضح هذه السياسة كيفية جمع ومعالجة وتخزين ومشاركة بياناتك عند استخدام المنصة لحجز المواعيد أو طلب استشارة طبية ثانية.',
      sections: [
        {
          title: 'المعلومات التي نجمعها',
          content: [
            'بيانات شخصية: الاسم، تاريخ الميلاد، الجنسية، رقم الهاتف، البريد الإلكتروني',
            'بيانات طبية: الأعراض، التشخيص، نتائج التحاليل، الوصفات، التاريخ الطبي',
            'بيانات تقنية: نوع الجهاز، عنوان IP، بيانات الاستخدام، الموقع الجغرافي (إذا تم تفعيله)',
            'يتم جمع هذه البيانات بموافقة صريحة من المستخدم'
          ]
        },
        {
          title: 'استخدام البيانات',
          content: [
            'تسهيل حجز المواعيد والاستشارات',
            'مشاركة المعلومات الطبية مع مقدمي الخدمة الذين تختارهم',
            'تحسين أداء التطبيق وتجربة المستخدم',
            'الامتثال للمتطلبات القانونية والصحية إن وجدت',
            'لا نقوم ببيع بياناتك لأي طرف ثالث'
          ]
        },
        {
          title: 'الأساس القانوني والموافقة',
          content: [
            'الموافقة الصريحة لمعالجة البيانات',
            'ضرورة التعاقد لتقديم الخدمات',
            'المصلحة المشروعة لتحسين المنصة ومنع التلاعب',
            'يمكنك سحب موافقتك في أي وقت'
          ]
        },
        {
          title: 'مشاركة البيانات',
          content: [
            'مقدمي الرعاية الصحية المعتمدين والذين تختارهم بنفسك',
            'جهات دعم فني تعمل بموجب اتفاقيات سرية',
            'الجهات الحكومية فقط إذا تطلب القانون ذلك',
            'نقل البيانات خارج الحدود يتم بتشفير قوي وبموافقة مكتوبة من المستخدم'
          ]
        },
        {
          title: 'أمن المعلومات',
          content: [
            'تشفير شامل للبيانات الطبية',
            'صلاحيات وصول محددة حسب الدور',
            'خوادم مؤمنة وفق معايير الأمن السيبراني الدولية',
            'نجري تدقيقات دورية وخطط استجابة لحالات اختراق البيانات'
          ]
        },
        {
          title: 'حقوق المستخدم',
          content: [
            'الوصول إلى بياناتك الشخصية ومراجعتها',
            'طلب تعديل أو حذف البيانات',
            'سحب الموافقة على معالجة البيانات',
            'تقديم شكوى للجهات المختصة إن وجدت',
            'نلتزم بالرد على الطلبات خلال 30 يومًا'
          ]
        }
      ],
      contactTitle: 'التواصل معنا'
    },
    en: {
      heading: 'Roshita Healthcare Platform <span class="text-[#1588C8]">Privacy Policy</span>',
      lastUpdated: 'Last Updated: July 31, 2025',
      introduction: 'Roshita is committed to safeguarding your personal and medical information. This Privacy Policy outlines how we collect, use, store, and protect your data when you use our platform to book appointments, request second opinions, or access healthcare services.',
      sections: [
        {
          title: 'Data We Collect',
          content: [
            'Personal Information: Name, contact details, nationality, date of birth',
            'Medical Information: Symptoms, diagnoses, prescriptions, lab results, medical history',
            'Technical Data: Device type, IP address, usage logs, location (if enabled)',
            'All data is collected with your explicit consent'
          ]
        },
        {
          title: 'Purpose of Data Use',
          content: [
            'Book medical appointments and consultations',
            'Share relevant medical information with selected clinics and doctors',
            'Improve platform functionality and user experience',
            'Comply with legal obligations and public health reporting (if applicable)',
            'We do not sell your data to third parties'
          ]
        },
        {
          title: 'Legal Basis and Consent',
          content: [
            'Explicit, informed consent for all personal and medical data processing',
            'Contractual necessity for delivering requested services',
            'Legitimate interest for platform improvement and fraud prevention',
            'You may withdraw your consent at any time'
          ]
        },
        {
          title: 'Data Sharing',
          content: [
            'Licensed healthcare providers you choose to engage with',
            'Technical service providers under strict confidentiality',
            'Government authorities only if legally required',
            'Cross-border data transfers are encrypted and require your consent'
          ]
        },
        {
          title: 'Data Security',
          content: [
            'End-to-end encryption for medical records',
            'Role-based access controls for healthcare providers',
            'Secure servers hosted in compliance with international cybersecurity standards',
            'Regular audits and breach protocols are in place'
          ]
        },
        {
          title: 'Your Rights',
          content: [
            'Access and review your personal data',
            'Request corrections or deletions',
            'Withdraw consent for data processing',
            'File a complaint with relevant authorities',
            'We aim to respond to all requests within 30 days'
          ]
        }
      ],
      contactTitle: 'Contact Us'
    }
  };

  const currentContent = content[language];

  return (
    <div className={`min-h-screen bg-[#f6f9fc] py-16 px-4 sm:px-8 ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full mx-auto bg-white rounded-xl  overflow-hidden p-8">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-block bg-[#dbf0e5] text-[#81CD96] px-6 py-1 rounded-full text-sm font-medium mb-4">
            {language === 'ar' ? 'الخصوصية والأمان' : 'Privacy & Security'}
          </div>
          <h1 
            className="text-3xl md:text-4xl font-[500] text-gray-900 mb-2"
            dangerouslySetInnerHTML={{ __html: currentContent.heading }}
          />
          <p className="text-gray-500 text-sm">{currentContent.lastUpdated}</p>
        </div>

        {/* Introduction */}
        <div className="mb-12">
          <p className="text-gray-700 leading-relaxed mb-8">{currentContent.introduction}</p>
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-12">
          {currentContent.sections.map((section, index) => (
            <div key={index} className="group">
              <h2 className="text-xl font-bold text-[#1588C8] mb-4 flex items-center">
                <span className="w-2 h-2 bg-[#1588C8] rounded-full mr-3 group-rtl:ml-3 group-rtl:mr-0"></span>
                {section.title}
              </h2>
              <ul className="space-y-3 pl-7 rtl:pl-0 rtl:pr-7">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-700 leading-relaxed flex">
                    <span className="text-[#1588C8] font-bold mr-2 rtl:ml-2 rtl:mr-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-[#1588C8] mb-6">{currentContent.contactTitle}</h3>
          <p className="text-gray-700 mb-4">
            {language === 'ar' ? 
              'للاستفسار أو تقديم الملاحظات:' : 
              'For questions or concerns:'}
          </p>
          <div className="flex items-center text-gray-700 mb-2">
            <span className="mr-2 rtl:ml-2 rtl:mr-0">📧</span>
            <a href="mailto:info@roshiata.net" className="hover:text-[#1588C8]">info@roshiata.net</a>
          </div>
          <div className="flex items-center text-gray-700">
            <span className="mr-2 rtl:ml-2 rtl:mr-0">🌐</span>
            <a href="https://www.roshiata.net" target="_blank" rel="noopener noreferrer" className="hover:text-[#1588C8]">www.roshiata.net</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;