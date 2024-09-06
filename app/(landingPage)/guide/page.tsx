"use client";
import React, { useState } from "react";
import GuideTitleSection from "@/components/unique/GuideTitleSection";
import PaginationDemo from "@/components/shared/PaginationDemo";
import FilterDoctor from "@/components/unique/FilterDoctor";
import { doctors, hospitals, labs } from "@/constant";
import HospitalCard from "@/components/unique/HospitalCard";
import LabsCard from "@/components/unique/LabsCard";
import DoctorCard from "@/components/unique/DorctorCard";

const Page = () => {
  // Pagination State for Doctors and Hospitals
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;
  const hospitalsPerPage = 5;

  // Filter State for Price, Country, and Specialty
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [countryTerm, setCountryTerm] = useState<string>("");
  const [specialtyTerm, setSpecialtyTerm] = useState<string>("");

  // Handle resetting all filters
  const resetFilters = () => {
    setSelectedPrices([]);
    setSelectedCountries([]);
    setSelectedSpecialties([]);
    setCountryTerm(""); // Reset country term
    setSpecialtyTerm(""); // Reset specialty term
    setCurrentPage(1);
  };

  console.log('selectedCountries guide', selectedCountries)

// Filter doctors by country term and specialty term
const filteredDoctors = doctors.filter((doctor) => {
    const countryMatch =
      doctor.location.toLowerCase().includes(countryTerm.toLowerCase());
  
    const specialtyMatch =
      doctor.specialty.toLowerCase().includes(specialtyTerm.toLowerCase());
  
    return countryMatch && specialtyMatch;
  });
  
  // Filter hospitals by country term and specialty term
  const filteredHospitals = hospitals.filter((hospital) => {
    const countryMatch =
      hospital.doctors[1].city.toLowerCase().includes(countryTerm.toLowerCase());
  
    const specialtyMatch =
      hospital.specialities.some((speciality) =>
        speciality.name.toLowerCase().includes(specialtyTerm.toLowerCase())
      );
  
    return countryMatch && specialtyMatch;
  });
  
  // Filter labs by country term
  const filteredLabs = labs.filter((lab) => {
    const countryMatch =
      lab.city.toLowerCase().includes(countryTerm.toLowerCase());
  
    // Assuming labs might not have specialty filtering, adjust if necessary
    return countryMatch;
  });

  // Pagination logic for doctors
  const totalDoctorPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  // Pagination logic for hospitals
  const totalHospitalPages = Math.ceil(
    filteredHospitals.length / hospitalsPerPage
  );
  const indexOfLastHospital = currentPage * hospitalsPerPage;
  const indexOfFirstHospital = indexOfLastHospital - hospitalsPerPage;
  const currentHospitals = filteredHospitals.slice(
    indexOfFirstHospital,
    indexOfLastHospital
  );

  // Pagination logic for labs
  const totalLabPages = Math.ceil(filteredLabs.length / hospitalsPerPage); // Reuse hospitalsPerPage for labs
  const indexOfLastLab = currentPage * hospitalsPerPage;
  const indexOfFirstLab = indexOfLastLab - hospitalsPerPage;
  const currentLabs = filteredLabs.slice(indexOfFirstLab, indexOfLastLab);

  // Handle page change for both doctors and hospitals
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Handle search update
  const handleSearchUpdate = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset pagination when a new search term is entered
  };

  const handleCountryUpdate = (term: string) => {
    setCountryTerm(term);
  };

  const handleSpecialtyUpdate = (term: string) => {
    setSpecialtyTerm(term);
  };

  return (
    <div className="bg-[#F9F9F9] pb-20">
      <GuideTitleSection
        onSearchChange={handleSearchUpdate}
        onCountryChange={handleCountryUpdate}
        onSpecialtyChange={handleSpecialtyUpdate}
      />
      <div className="flex lg:flex-row-reverse flex-col mt-20 p-4 lg:gap-10 gap-2 max-w-[1280px] mx-auto">
        {/*<div className="lg:w-[20%]">
           Filter Component 
          <FilterDoctor
            doctors={doctors}
            selectedPrices={selectedPrices}
            setSelectedPrices={setSelectedPrices}
            selectedCountries={selectedCountries}
            setSelectedCountries={setSelectedCountries}
            selectedSpecialties={selectedSpecialties}
            setSelectedSpecialties={setSelectedSpecialties}
          />*/}

        {/* Reset Filters Button 
          <button 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full"
            onClick={resetFilters}
          >
            إعادة ضبط الفلاتر
          </button>
        </div>*/}

        {searchTerm === "doctorsSearch" ? (
          <div className="space-y-4 lg:w-full">
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
            <PaginationDemo
              currentPage={currentPage}
              totalPages={totalDoctorPages}
              onPageChange={handlePageChange}
            />
          </div>
        ) : searchTerm === "hospitalsSearch" ? (
          <div className="space-y-4 lg:w-full">
            {currentHospitals.map((hospital, index) => (
              <HospitalCard
                key={index}
                name={hospital.name}
                city={hospital.doctors[1].city}
                specialities={hospital.specialities.length}
                doctorCount={hospital.doctors.length}
              />
            ))}
            <PaginationDemo
              currentPage={currentPage}
              totalPages={totalHospitalPages}
              onPageChange={handlePageChange}
            />
          </div>
        ) : searchTerm === "pharmaciesSearch" ? (
          <p className="text-center text-xl font-semibold mx-auto">
            لا توجد صيدليات متاحة حاليًا
          </p>
        ) : (
          <div className="space-y-4 lg:w-full">
            {currentLabs.map((lab, index) => (
              <LabsCard
                key={index}
                name={lab.name}
                city={lab.city}
                tests={lab.services.length}
              />
            ))}
            <PaginationDemo
              currentPage={currentPage}
              totalPages={totalLabPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
