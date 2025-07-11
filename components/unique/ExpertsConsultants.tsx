'use client';

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

const ExpertsConsultants = () => {
  const [language, setLanguage] = useState<string>("");

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

  return (
    <div className="w-full relative py-16 overflow-hidden bg-white">
      <div className={`max-w-[1200px] mx-auto flex flex-row-reverse items-center justify-between relative z-10 px-6 gap-10`}>
        {/* Text content - on the left in Arabic */}
        <div className={`lg:w-1/2 w-full px-6 lg:order-2 text-right lg:mt-0 mt-8`}>
          <h2 className="text-3xl font-bold text-roshitaBlue mb-6">خبراء واستشاريين</h2>
          <p className="text-gray-700 mb-8 leading-relaxed text-lg">
            في مهمتنا توفير الوصول إلى أرقى الخدمات الطبية، نؤمن بأن الوصول إلى الرأي الطبي الموثوق يجب أن يكون سهلاً وسريعاً. لذلك، وفرنا لك إمكانية الحصول على استشارات مباشرة مع نخبة من الأطباء والخبراء في مختلف التخصصات الطبية في تونس وليبيا، في مختلف التخصصات الطبية، سواء كنت بحاجة إلى تشخيص أولي، متابعة حالة صحية، أو رأي ثان، فريقنا مستعد لمساعدتك بكل احترافية وخصوصية
          </p>
          <Button
            variant="register"
            className="rounded-2xl h-[52px] w-[140px] bg-blue-500 hover:bg-blue-600 text-white font-medium"
          >
            اكتشف
          </Button>
        </div>
        
        {/* Images - on the right in Arabic */}
        <div className={`lg:w-1/2 w-full lg:order-1`}>
          <div className="flex flex-col gap-4 h-[600px]">
            {/* Top row - Right side positioned at top */}
            <div className="flex gap-4 h-[55%] justify-end">
              <div className="w-[60%] h-full">
                <img 
                  src="/Images/image-2.png" 
                  alt="طبيب مختص" 
                  className="rounded-3xl w-full h-full object-cover "
                />
              </div>
              <div className="w-[35%] h-full">
                <img 
                  src="/Images/image-1.png" 
                  alt="طبيب مع مريض" 
                  className="rounded-3xl w-full h-full object-cover shadow-lg"
                />
              </div>
            </div>
            
            {/* Bottom row - Left side positioned at bottom */}
            <div className="flex gap-4 h-[40%] justify-start">
              <div className="w-[35%] h-full">
                <img 
                  src="/Images/image-3.png" 
                  alt="طبيب" 
                  className="rounded-3xl w-full h-full object-cover "
                />
              </div>
              <div className="w-[60%] h-full">
                <img 
                  src="/Images/image-4.png" 
                  alt="استشارة طبية" 
                  className="rounded-3xl w-full h-full object-cover shadow-lg"
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