"use client";
import React, { useEffect, useState } from "react";
import GuideFiltration2 from "./GuideFiltration2";

type Language = "ar" | "en";

interface GuideTitleSectionProps {
  onSearchChange: (searchTerm: string) => void;
  onCountryChange: (countryTerm: string) => void;
  onSpecialtyChange: (specialtyTerm: string) => void;
  onCityChange: (cityTerm: string) => void;
}

interface StatsData {
  totalDoctors: number;
  totalLabs: number;
  totalHospitals: number;
}

const GuideTitleSection2: React.FC<GuideTitleSectionProps> = ({
  onSearchChange,
  onCountryChange,
  onSpecialtyChange,
  onCityChange,
}) => {
  const [language, setLanguage] = useState<Language>("ar");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage as Language);
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "language") {
        setLanguage((event.newValue as Language) || "ar");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const fetchStats = async () => {
      try {
        const response = await fetch('https://test-roshita.net/api/kpis/roshita-entity/totals');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div>
      <div className="relative w-full h-[80vh] lg:flex-row flex-col bg-cover bg-center bg-[url('/Images/doctor-with-patient.png')] z-1">
        <div className="absolute inset-0 opacity-60 z-10"></div>
        <div className="w-full relative flex lg:flex-row flex-col-reverse lg:justify-end items-center lg:py-20 lg:px-20 py-10 lg:gap-0 gap-2 z-20">
          <div className="lg:w-[80%] w-full">
            <h1 className="text-[60px] text-white text-center lg:text-end">
              {language === "ar" ? " روشـــيتــــــاالـــــدلــــيل" : "Guide Rocheta"}
            </h1>
            <p className="text-2xl text-white lg:text-end text-center">
              {language === "ar"
                ? "لتقديم الاستشارات الطبية واستفسار كافة المعلومات"
                : "Providing medical consultations and all information inquiries"}
            </p>
            <div className="flex justify-start flex-row-reverse lg:gap-10 w-[100%] mx-auto mt-8">
              {['totalDoctors', 'totalHospitals', 'totalLabs'].map((stat) => (
                <div key={stat}>
                  <h2 className="text-white text-[60px] text-semibold text-end">
                    {stats?.[stat as keyof StatsData] || 0}
                  </h2>
                  <h2 className="text-white text-[24px] text-semibold text-end">
                    {language === "ar" ? 
                      stat === "totalDoctors" ? "الأطباء" :
                      stat === "totalHospitals" ? "مستشفيات" : "مختبرات"
                    : 
                      stat === "totalDoctors" ? "Doctors" :
                      stat === "totalHospitals" ? "Hospitals" : "Labs"
                    }
                  </h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="z-30 lg:mt-0 -mt-[180px]">
        <GuideFiltration2
          onSearchChange={onSearchChange}
          onCountryChange={onCountryChange}
          onSpecialtyChange={onSpecialtyChange}
          onCityChange={onCityChange}
        />
      </div>
    </div>
  );
};

export default GuideTitleSection2;