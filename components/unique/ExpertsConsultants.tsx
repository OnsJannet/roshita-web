'use client';

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

const ExpertsConsultants = () => {
  const [language, setLanguage] = useState<string>("ar");

  useEffect(() => {
    // Sync the language state with the localStorage value
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }

    // Listen for changes in localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "language") {
        setLanguage(event.newValue || "ar");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="w-full relative py-8 md:py-16 overflow-hidden bg-white">
      <div className={`max-w-[1200px] mx-auto flex flex-col lg:flex-row-reverse items-center justify-between relative z-10 px-4 sm:px-6 lg:px-8 gap-6 lg:gap-10`}>
        {/* Text content */}
        <div className={`lg:w-1/2 w-full px-2 sm:px-6 lg:mt-0 mt-8 text-right`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-roshitaBlue mb-4 sm:mb-6">
            {language === 'ar' ? 'خبراء واستشاريين' : 'Experts and Consultants'}
          </h2>
          <p className="text-gray-700 mb-6 sm:mb-8 leading-relaxed text-base sm:text-lg">
            {language === 'ar' ? (
              'في مهمتنا توفير الوصول إلى أرقى الخدمات الطبية، نؤمن بأن الوصول إلى الرأي الطبي الموثوق يجب أن يكون سهلاً وسريعاً. لذلك، وفرنا لك إمكانية الحصول على استشارات مباشرة مع نخبة من الأطباء والخبراء في مختلف التخصصات الطبية في تونس وليبيا، في مختلف التخصصات الطبية، سواء كنت بحاجة إلى تشخيص أولي، متابعة حالة صحية، أو رأي ثان، فريقنا مستعد لمساعدتك بكل احترافية وخصوصية'
            ) : (
              'In our mission to provide access to the finest medical services, we believe that access to reliable medical opinions should be easy and fast. Therefore, we have provided you with the possibility to obtain direct consultations with elite doctors and experts in various medical specialties in Tunisia and Libya, across various medical specialties. Whether you need an initial diagnosis, follow-up on a health condition, or a second opinion, our team is ready to assist you with complete professionalism and privacy.'
            )}
          </p>
          <Button
            variant="register"
            className="rounded-2xl h-12 sm:h-[52px] w-32 sm:w-[140px] bg-blue-500 hover:bg-blue-600 text-white font-medium"
          >
            {language === 'ar' ? 'اكتشف' : 'Discover'}
          </Button>
        </div>
        
        {/* Images */}
        <div className={`lg:w-1/2 w-full`}>
          <div className="flex flex-col gap-3 sm:gap-4 h-[400px] sm:h-[500px] md:h-[600px]">
            {/* Top row */}
            <div className="flex gap-3 sm:gap-4 h-[55%] justify-end">
              <div className="w-[60%] h-full">
                <img 
                  src="/Images/image-2.png" 
                  alt={language === 'ar' ? 'طبيب مختص' : 'Specialist doctor'} 
                  className="rounded-2xl sm:rounded-3xl w-full h-full object-cover"
                />
              </div>
              <div className="w-[35%] h-full">
                <img 
                  src="/Images/image-1.png" 
                  alt={language === 'ar' ? 'طبيب مع مريض' : 'Doctor with patient'} 
                  className="rounded-2xl sm:rounded-3xl w-full h-full object-cover shadow-lg"
                />
              </div>
            </div>
            
            {/* Bottom row */}
            <div className="flex gap-3 sm:gap-4 h-[40%] justify-start">
              <div className="w-[35%] h-full">
                <img 
                  src="/Images/image-3.png" 
                  alt={language === 'ar' ? 'طبيب' : 'Doctor'} 
                  className="rounded-2xl sm:rounded-3xl w-full h-full object-cover"
                />
              </div>
              <div className="w-[60%] h-full">
                <img 
                  src="/Images/image-4.png" 
                  alt={language === 'ar' ? 'استشارة طبية' : 'Medical consultation'} 
                  className="rounded-2xl sm:rounded-3xl w-full h-full object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertsConsultants;