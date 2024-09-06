'use client'

import PaginationDemo from "@/components/shared/PaginationDemo";
import DoctorCard from "@/components/unique/DorctorCard";
import FilterDoctor from "@/components/unique/FilterDoctor";
import TitleSection from "@/components/unique/TitleSection";
import { doctors } from "@/constant";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;

  const params = useParams();
  const country = params?.country 
  ? Array.isArray(params.country) 
    ? decodeURIComponent(params.country[0]) 
    : decodeURIComponent(params.country)  
  : undefined;

const specialty = params?.specialty 
  ? Array.isArray(params.specialty) 
    ? decodeURIComponent(params.specialty[0]) 
    : decodeURIComponent(params.specialty)
  : undefined;


  // Filter State for Price, Country, and Specialty
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  // Decode URL parameters and set filter states
  useEffect(() => {
    if (country) {
      setSelectedCountries([country]);
    }
    if (specialty) {
      setSelectedSpecialties([specialty]);
    }
  }, [country, specialty]);

  // Handle resetting all filters
  const resetFilters = () => {
    setSelectedPrices([]); // Clear prices
    setSelectedCountries([]); // Clear countries
    setSelectedSpecialties([]); // Clear specialties
    setCurrentPage(1); // Reset pagination to the first page
  };

  // Filter doctors by selected prices, countries, and specialties
  const filteredDoctors = doctors.filter((doctor) => {
    const priceMatch = selectedPrices.length === 0 || selectedPrices.includes(doctor.price);
    
    // Match country if the doctor's location includes the selected country (partial match)
    const countryMatch = selectedCountries.length === 0 || selectedCountries.some(selectedCountry => doctor.location.includes(selectedCountry));
    
    const specialtyMatch = selectedSpecialties.length === 0 || selectedSpecialties.includes(doctor.specialty);

    return priceMatch && countryMatch && specialtyMatch;
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
        <div className="lg:w-[20%]">
          {/* Filter Component */}
          <FilterDoctor
            doctors={doctors}
            selectedPrices={selectedPrices}
            setSelectedPrices={setSelectedPrices}
            selectedCountries={selectedCountries}
            setSelectedCountries={setSelectedCountries}
            selectedSpecialties={selectedSpecialties}
            setSelectedSpecialties={setSelectedSpecialties}
          />

          {/* Reset Filters Button */}
          <button 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full"
            onClick={resetFilters}
          >
            إعادة ضبط الفلاتر
          </button>
        </div>

        <div className="space-y-4 lg:w-[80%]">
          {currentDoctors.map((doctor, index) => (

            <DoctorCard
              key={doctor.doctor_id}
              id={doctor.doctor_id}
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
