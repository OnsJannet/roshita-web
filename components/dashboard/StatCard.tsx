import React, { useEffect, useState } from 'react';

type Language = "ar" | "en";

interface StatsData {
  totalDoctors: number;
  totalLabs: number;
  totalHospitals: number;
  totalPatients: number;
  totalSpecialties: number;
}

const StatCard = () => {
  const [language, setLanguage] = useState<Language>("ar");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage as Language);
    } else {
      setLanguage("ar");
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "language") {
        setLanguage((event.newValue as Language) || "ar");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://test-roshita.net/api/kpis/roshita-entity/totals');
        
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const data: StatsData = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-[1280px] bg-dashboard-gradient rounded-[26px] h-auto lg:h-[282px] px-4 lg:px-16 py-8 lg:py-0 flex flex-col lg:flex-row justify-between items-center mx-auto">
        <div className="text-white text-center w-full">
          {language === "ar" ? "جاري التحميل..." : "Loading..."}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1280px] bg-dashboard-gradient rounded-[26px] h-auto lg:h-[282px] px-4 lg:px-16 py-8 lg:py-0 flex flex-col lg:flex-row justify-between items-center mx-auto">
        <div className="text-white text-center w-full">
          {language === "ar" ? "حدث خطأ في تحميل البيانات" : "Error loading data"}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] bg-dashboard-gradient rounded-[26px] h-auto lg:h-[282px] px-4 lg:px-16 py-8 lg:py-0 flex flex-col lg:flex-row justify-between items-center mx-auto">
      {/* Left Image Section - Hidden on mobile */}
      <div
        className="lg:w-[40%] w-full h-[200px] lg:h-full bg-cover bg-left hidden lg:block"
        style={{ backgroundImage: "url('/Images/Group-30.png')" }}
      ></div>

      {/* Right Stats Section */}
      <div className="w-full lg:w-[60%] flex flex-col lg:flex-row justify-center gap-8 lg:gap-16 px-4 lg:px-8 text-center lg:text-left">
        {/* Stat 1 - Specialties */}
        <div className="text-white">
          <div className="lg:text-[48px] text-[30px] font-bold leading-none">
            {stats?.totalSpecialties}
          </div>
          <div className="mt-2 text-sm lg:text-base">
            {language === "ar" ? "تخصص" : "Specialties"}
          </div>
        </div>

        {/* Stat 2 - Patients */}
        <div className="text-white">
          <div className="lg:text-[48px] text-[30px] font-bold leading-none">
            {stats?.totalPatients}
          </div>
          <div className="mt-2 text-sm lg:text-base">
            {language === "ar" ? "عدد المرضي" : "Number of patients"}
          </div>
        </div>

        {/* Stat 3 - Doctors */}
        <div className="text-white">
          <div className="lg:text-[48px] text-[30px] font-bold leading-none">
            {stats?.totalDoctors}
          </div>
          <div className="mt-2 text-sm lg:text-base">
            {language === "ar" ? "عدد الدكاترة" : "Number of doctors"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;