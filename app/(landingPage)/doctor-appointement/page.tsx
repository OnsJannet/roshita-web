'use client'

import PaginationDemo from "@/components/shared/PaginationDemo";
import DoctorCard from "@/components/unique/DorctorCard";
import FilterDoctor from "@/components/unique/FilterDoctor";
import TitleSection from "@/components/unique/TitleSection";
import { doctors } from "@/constant";
import React, { useState } from "react";

const Page = () => {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;

  // Filter State for Price and Country
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  // Filter doctors by selected prices and countries
  const filteredDoctors = doctors.filter((doctor) => {
    const priceMatch = selectedPrices.length === 0 || selectedPrices.includes(doctor.price);
    const countryMatch = selectedCountries.length === 0 || selectedCountries.includes(doctor.location);
    return priceMatch && countryMatch;
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  // Get current page doctors
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="bg-[#F9F9F9] pb-20">
      <TitleSection />
      <div className="flex lg:flex-row-reverse flex-col mt-20 p-4 lg:gap-10 gap-2 max-w-[1280px] mx-auto">
        <div className="lg:w-[20%] ">
        <FilterDoctor
        doctors={doctors}
        selectedPrices={selectedPrices}
        setSelectedPrices={setSelectedPrices}
        selectedCountries={selectedCountries}
        setSelectedCountries={setSelectedCountries}
      />
        </div>

        <div className="space-y-4 lg:w-[80%]">
          {currentDoctors.map((doctor, index) => (
            <DoctorCard
              key={index}
              name={doctor.name}
              specialty={doctor.specialty}
              rating={doctor.rating}
              reviewsCount={doctor.reviewsCount}
              price={doctor.price}
              location={doctor.location}
              imageUrl={doctor.imageUrl}
            />
          ))}

          {/* Pagination Component */}
          <PaginationDemo
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
