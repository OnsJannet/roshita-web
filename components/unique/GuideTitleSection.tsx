// GuideTitleSection.tsx
'use client';
import React, { useState } from "react";
import GuideFiltration from "./GuideFiltration";

interface GuideTitleSectionProps {
  onSearchChange: (searchTerm: string) => void;
}

const GuideTitleSection: React.FC<GuideTitleSectionProps> = ({ onSearchChange }) => {
  const [search, setSearch] = useState('');

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    onSearchChange(newSearch); // Call the parent callback
  };

  return (
    <div>
      <div className="relative w-full h-[80vh] lg:flex-row flex-col bg-cover bg-center bg-[url('/Images/medicalBanner.png')]">
        <div className="absolute inset-0 bg-blue-500 opacity-60 z-10"></div>
        <div className="max-w-[1280px] relative flex lg:flex-row flex-col-reverse lg:justify-end justify-center items-center lg:py-20 py-10 lg:gap-0 gap-2 lg:w-[50%] w-full mx-auto z-20">
          <div className="lg:w-1/2 w-full">
            <h1 className="text-[60px] text-white text-center lg:text-end">الـــــدلــــيل</h1>
            <h1 className="text-[60px] text-white text-center lg:text-end font-bold">روشـــيتــــــا</h1>
            <p className="text-2xl text-white lg:text-end text-center">لتقديم الاستشارات الطبية واستفسار كافة المعلومات</p>
            <div className="flex justify-between flex-row-reverse lg:gap-10 w-[80%] mx-auto mt-8">
              <div>
                <h2 className="text-white text-[60px] text-semibold text-end">263</h2>
                <h2 className="text-white text-[24px] text-semibold text-end">الأطباء</h2>
              </div>
              <div>
                <h2 className="text-white text-[60px] text-semibold text-end">891</h2>
                <h2 className="text-white text-[24px] text-semibold text-end">مستشفيات</h2>
              </div>
              <div>
                <h2 className="text-white text-[60px] text-semibold text-end">10+</h2>
                <h2 className="text-white text-[24px] text-semibold text-end">مختبرات</h2>
              </div>
            </div>
          </div>
          <div className="h-full w-1/2"></div>
        </div>
      </div>

      <div className="z-30 lg:mt-0 -mt-[180px]">
        <GuideFiltration onSearchChange={handleSearchChange} />
      </div>
    </div>
  );
};

export default GuideTitleSection;
