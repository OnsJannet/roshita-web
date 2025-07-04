'use client';

import React, { useState } from 'react';
import DoctorSearchFilters from "../shared/DoctorSearchFilters";


const Hero1Page: React.FC = () => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const content = {
    ar: {
      languageSwitch: 'English',
    },
    en: {
      languageSwitch: 'العربية',
    }
  };

  const currentContent = content[language];

  return (
    <div className="relative min-h-screen">
      {/* Background Image - Medical Professional */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/hero-page.png')`,
        }}
      />
      
      {/* Subtle Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Main Content - Centered */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="mx-auto w-full mt-[200px]">

              <DoctorSearchFilters />
          </div>
        </main>


      </div>
    </div>
  );
};

export default Hero1Page;