// GuideFiltration.tsx
"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { countries, specialities } from "@/constant";

interface GuideFiltrationProps {
  onSearchChange: (searchTerm: string) => void;
  onCountryChange: (countryTerm: string) => void;
  onSpecialtyChange: (SpecialityTerm: string) => void;
}

const GuideFiltration: React.FC<GuideFiltrationProps> = ({ onSearchChange, onCountryChange, onSpecialtyChange }) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const handleClick = (term: string) => {
    setSearch(term);
    onSearchChange(term); // Call the parent callback
  };

  const handleCountryChange = (value: string | undefined) => {
    const newValue = value ?? '';
    setSelectedCountry(newValue);
    onCountryChange(newValue);
  };

  const handleSpecialtyChange = (value: string | undefined) => {
    const newValue = value ?? ''; 
    setSelectedSpecialty(newValue);
    onSpecialtyChange(newValue); 
  };

  return (
    <div className="lg:-mt-[80px] xl:-mt-[40px] mt-[180px] rounded-2xl p-6 max-w-[1280px] mx-auto relative" style={{ zIndex: 9999 }}>
      <div className="!bg-white justify-center flex lg:flex-row-reverse flex-col rounded-lg p-4" style={{ boxShadow: "0 8px 26.6px rgba(0, 0, 0, 0.09)" }}>
        <div onClick={() => handleClick('doctorsSearch')} className="lg:border-l-gray-200 border-b-gray-200 lg:border-b-transparent lg:border-l border-b p-4 flex justify-center items-center flex-row-reverse lg:w-[25%] w-full cursor-pointer">
          <img src="/images/FilterDoc.png" alt="doc" className="h-8 w-8" />
          <p className="text-[24px] font-semibold">الأطباء</p>
        </div>
        <div onClick={() => handleClick('hospitalsSearch')} className="lg:border-l-gray-200 border-b-gray-200 lg:border-l lg:border-b-transparent border-b p-4 flex justify-center items-center flex-row-reverse lg:w-[25%] w-full cursor-pointer">
          <img src="/images/FilterHos.png" alt="doc" className="h-8 w-8" />
          <p className="text-[24px] font-semibold">مستشفيات</p>
        </div>
        <div onClick={() => handleClick('pharmaciesSearch')} className="lg:border-l-gray-200 border-b-gray-200 lg:border-l lg:border-b-transparent border-b p-4 flex justify-center items-center flex-row-reverse lg:w-[25%] w-full cursor-pointer">
          <img src="/images/FilterPha.png" alt="doc" className="h-8 w-8" />
          <p className="text-[24px] font-semibold">صيدلية</p>
        </div>
        <div onClick={() => handleClick('labs')} className="p-4 flex justify-center items-center flex-row-reverse lg:border-b-transparent lg:w-[25%] w-full cursor-pointer">
          <img src="/images/FilterLab.png" alt="doc" className="h-8 w-8" />
          <p className="text-[24px] font-semibold">مختبرات</p>
        </div>
      </div>
      <div className="bg-roshitaBlue justify-center flex flex-row-reverse rounded-lg p-4 gap-4">
        {/* Country Select */}
        <Select onValueChange={handleCountryChange} value={selectedCountry ?? undefined}>
          <SelectTrigger className="h-[52px] flex-row-reverse bg-white">
            <SelectValue placeholder="البلد" />
          </SelectTrigger>
          <SelectContent className="z-[999999] bg-white">
            {countries.flat().map((country) => (
              <SelectItem key={country.id} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Specialty Select */}
        <Select onValueChange={handleSpecialtyChange} value={selectedSpecialty ?? undefined}>
          <SelectTrigger className="h-[52px] flex-row-reverse bg-white">
            <SelectValue placeholder="التخصص" />
          </SelectTrigger>
          <SelectContent className="z-[999999] bg-white">
            {specialities.flat().map((specialty) => (
              <SelectItem key={specialty.id} value={specialty.name}>
                {specialty.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default GuideFiltration;
