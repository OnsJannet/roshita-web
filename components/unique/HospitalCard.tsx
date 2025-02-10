import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface HospitalCardProps {
  name: string;
  city: string;
  specialities: number;
  doctorCount: number;
  href?: string;
}

type Language = 'ar' | 'en';

const HospitalCard: React.FC<HospitalCardProps> = ({ name, city, specialities, doctorCount, href }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage as Language);
    } else {
      setLanguage('ar');
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'language') {
        setLanguage((event.newValue as Language) || 'ar');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleClick = () => {
    if (href) {
      window.location.href = href;
    }
  };

  return (
    <div
    onClick={handleClick}
    className={`cursor-pointer flex justify-start ${language === 'ar' ? 'lg:flex-row-reverse flex-row-reverse' : 'lg:flex-row flex-row'} bg-[#fbfbfdff]  rounded-lg p-6 max-w-4xl mx-auto`}
  >
      <div className="ml-4 h-20 w-20 rounded-full bg-blue-500 flex justify-center lg:flex-row-reverse flex-col items-center overflow-hidden">
        <img
          src="/Images/home_health.png"
          alt="hospital logo"
          className="h-10 w-10 object-contain mx-auto"
        />
      </div>
      <div className={`flex-1 ${language === 'ar' ? 'text-right' : 'text-left pl-4'}`}>

        <h2 className="text-lg font-bold">{name}</h2>
        <p className="text-sm text-gray-500">{city}</p>
        <div className={`flex ${language === 'ar' ? 'justify-end' : 'justify-start'} items-center mt-2 text-gray-700 gap-10`}>

          <div className="flex gap-10">
            <p>{specialities} {language === 'ar' ? 'تخصص' : 'specialties'}</p>
            <p>{doctorCount} {language === 'ar' ? 'دكتور' : 'doctors'}</p>
          </div>
          <div className={`flex items-center ${language === 'en' ? 'flex-row-reverse gap-2' : ''}`}>

            <span>{city}</span>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Tunisia.svg"
              alt="Tunisia flag"
              className="h-5 w-5 ml-2 rounded-full contain"
            />
          </div>
        </div>
      </div>
      <div>
        {language === 'ar' ? <ChevronLeft /> : <ChevronRight /> }
      </div>
    </div>
  );
};

export default HospitalCard;
