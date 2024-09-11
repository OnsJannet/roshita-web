"use client";
import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { HeartPulse, MapPin, Search } from "lucide-react";
import { countries, specialities } from "@/constant";

const Filters = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    null
  );

  const handleCountryChange = (value: string | undefined) => {
    setSelectedCountry(value ?? null);
  };

  const handleSpecialtyChange = (value: string | undefined) => {
    setSelectedSpecialty(value ?? null);
  };

  const handleSearch = () => {
    if (selectedCountry && selectedSpecialty) {
      window.location.href = `/doctor-appointement/${encodeURIComponent(
        selectedCountry
      )}/${encodeURIComponent(selectedSpecialty)}`;
    }
  };

  return (
    <div
      className="lg:-mt-[80px] xl:-mt-[40px] mt-[180px] rounded-2xl p-6 max-w-[1280px] mx-auto !bg-white relative"
      style={{ boxShadow: "0 8px 26.6px rgba(0, 0, 0, 0.09)", zIndex: 9999 }}
    >
      <p className="text-end mb-4 font-medium">
        حجـــز موعد طبي ، تقديم استشارات
      </p>
      <div className="flex justify-between gap-4">
        <Button
          variant="register"
          className="rounded-xl h-[52px] w-[440px] gap-1 font-bold text-[18px]"
          onClick={handleSearch}
        >
          بحث
          <Search className="h-4 w-4" />
        </Button>

        {/* Country Select */}
        <Select
          onValueChange={handleCountryChange}
          value={selectedCountry ?? undefined}
        >
          <SelectTrigger className="h-[52px] flex-row-reverse ">
            <div className="flex flex-row-reverse gap-2 items-center">
              <MapPin className="h-[20px] w-[20px] text-roshitaDarkBlue" />
              <SelectValue placeholder="البلد" />
            </div>
          </SelectTrigger>
          <SelectContent className="z-[999999]">
            {countries.flat().map((country) => (
              <SelectItem key={country.id} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Specialty Select */}
        <Select
          onValueChange={handleSpecialtyChange}
          value={selectedSpecialty ?? undefined}
        >
          <SelectTrigger className="h-[52px] flex-row-reverse">
            <div className="flex flex-row-reverse gap-2 items-center">
              <HeartPulse className="h-[20px] w-[20px] text-roshitaDarkBlue"  />
              <SelectValue placeholder="التخصص" />
            </div>
          </SelectTrigger>
          <SelectContent className="z-[999999]">
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

export default Filters;
