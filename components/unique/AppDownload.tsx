import React, { useState, useEffect } from 'react';
import { Heart, Calendar, User, Home, FileText, Phone, Stethoscope, Users } from 'lucide-react';

const AppDownload = () => {
  const [language, setLanguage] = useState('ar');

  useEffect(() => {
    // Sync the language state with the localStorage value
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    } else {
      setLanguage("ar"); // Default to 'ar' (Arabic) if no language is set
    }

    // Listen for changes in localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "language") {
        // Update the language state when the language in localStorage changes
        setLanguage(event.newValue || "ar");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Run only once on mount

  const translations = {
    ar: {
      appName: "روشيتا",
      bookNow: "احجز الآن",
      withDoctorService: "مع خدمة دكتورة",
      tunisia: "تونس",
      libya: "ليبيا",
      whatAreYouLookingFor: "عما تبحث؟",
      medicalCheckup: "فحص طبي",
      medicalConsultation: "معايلة طبية",
      generalDoctor: "طبيب عام",
      hospitals: "مستشفيات",
      services: "الخدمات",
      bookMedicalAppointment: "حجز موعد طبي",
      medicalConsultationService: "استشارة طبية",
      downloadApp: "حمل تطبيق",
      description: "حجز وإرسال استشارات طبية مع توفر أكبر شبكة",
      betweenDoctors: "بين دكاترة ليبيا وتونس.",
      downloadButton: "تنزيل التطبيق"
    },
    en: {
      appName: "Roshita",
      bookNow: "Book Now",
      withDoctorService: "With Doctor Service",
      tunisia: "Tunisia",
      libya: "Libya",
      whatAreYouLookingFor: "What are you looking for?",
      medicalCheckup: "Medical Checkup",
      medicalConsultation: "Medical Consultation",
      generalDoctor: "General Doctor",
      hospitals: "Hospitals",
      services: "Services",
      bookMedicalAppointment: "Book Medical Appointment",
      medicalConsultationService: "Medical Consultation",
      downloadApp: "Download",
      description: "Book and send medical consultations with the largest network",
      betweenDoctors: "between doctors in Libya and Tunisia.",
      downloadButton: "Download App"
    }
  };

  const t = translations[language as keyof typeof translations];
  const isRTL = language === 'ar';

  // Function to change language and update localStorage
  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="relative">
        {/* Language Toggle Button */}
        <button
          onClick={() => changeLanguage(language === 'ar' ? 'en' : 'ar')}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors z-10"
        >
          {language === 'ar' ? 'English' : 'العربية'}
        </button>

        {/* Phone Frame */}
        <div className="w-80 h-[640px] bg-black rounded-[3rem] p-2 shadow-2xl">
          <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
            {/* Status Bar */}
            <div className="flex justify-between items-center px-6 py-2 bg-white">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">Daltita</span>
              </div>
              <div className="flex gap-1">
                <div className="w-4 h-1 bg-gray-300 rounded"></div>
                <div className="w-4 h-1 bg-gray-300 rounded"></div>
                <div className="w-4 h-1 bg-gray-800 rounded"></div>
              </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-4">
              {/* Hero Card */}
              <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl p-6 mb-6 text-white">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Phone className="w-8 h-8" />
                  </div>
                  <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-lg font-semibold">{t.bookNow}</h3>
                    <p className="text-sm opacity-90">{t.withDoctorService}</p>
                  </div>
                </div>
              </div>

              {/* Location Indicator */}
              <div className="flex justify-center gap-2 mb-6">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>

              {/* Country Selection */}
              <div className="flex justify-center gap-8 mb-8">
                <div className="text-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mb-2 mx-auto"></div>
                  <span className="text-sm text-gray-600">{t.tunisia}</span>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mb-2 mx-auto"></div>
                  <span className="text-sm text-gray-600">{t.libya}</span>
                </div>
              </div>

              {/* Search Question */}
              <div className="text-center mb-8">
                <p className="text-gray-700 font-medium">{t.whatAreYouLookingFor}</p>
              </div>

              {/* Service Categories */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="text-center">
                  <div className="bg-blue-50 p-3 rounded-xl mb-2">
                    <FileText className="w-6 h-6 text-blue-500 mx-auto" />
                  </div>
                  <span className="text-xs text-gray-600">{t.medicalCheckup}</span>
                </div>
                <div className="text-center">
                  <div className="bg-blue-50 p-3 rounded-xl mb-2">
                    <Stethoscope className="w-6 h-6 text-blue-500 mx-auto" />
                  </div>
                  <span className="text-xs text-gray-600">{t.medicalConsultation}</span>
                </div>
                <div className="text-center">
                  <div className="bg-blue-50 p-3 rounded-xl mb-2">
                    <Users className="w-6 h-6 text-blue-500 mx-auto" />
                  </div>
                  <span className="text-xs text-gray-600">{t.generalDoctor}</span>
                </div>
                <div className="text-center">
                  <div className="bg-blue-50 p-3 rounded-xl mb-2">
                    <Home className="w-6 h-6 text-blue-500 mx-auto" />
                  </div>
                  <span className="text-xs text-gray-600">{t.hospitals}</span>
                </div>
              </div>

              {/* Services Section */}
              <div className="mb-6">
                <h4 className="text-gray-800 font-semibold mb-4 text-center">{t.services}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="bg-blue-50 p-3 rounded-xl mb-3 inline-block">
                      <Calendar className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-700">{t.bookMedicalAppointment}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="bg-red-50 p-3 rounded-xl mb-3 inline-block">
                      <Heart className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-sm text-gray-700">{t.medicalConsultationService}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
              <div className="flex justify-around">
                <div className="text-center">
                  <FileText className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                </div>
                <div className="text-center">
                  <Calendar className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                </div>
                <div className="text-center">
                  <User className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                </div>
                <div className="text-center">
                  <Home className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Info Panel */}
        <div className={`absolute ${isRTL ? 'right-[-300px]' : 'left-[-300px]'} top-0 w-72 h-full flex flex-col justify-center ${isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t.downloadApp} <span className="text-blue-500">{t.appName}</span>
          </h1>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            {t.description}
          </p>
          <p className="text-gray-600 mb-8 text-lg">
            {t.betweenDoctors}
          </p>
          <button className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
            {t.downloadButton} {isRTL ? '←' : '→'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppDownload;