"use client";
import React, { useEffect, useState } from "react";
import GuideTitleSection from "@/components/unique/GuideTitleSection";
import PaginationDemo from "@/components/shared/PaginationDemo";
import FilterDoctor from "@/components/unique/FilterDoctor";
import { doctors, hospitals, labs } from "@/constant";
import HospitalCard from "@/components/unique/HospitalCard";
import LabsCard from "@/components/unique/LabsCard";
import DoctorCard from "@/components/unique/DorctorCard";

type Language = "ar" | "en";

const translations = {
  en: {
    resetFilters: "Reset Filters",
    noPharmacies: "No pharmacies available currently",
  },
  ar: {
    resetFilters: "إعادة ضبط الفلاتر",
    noPharmacies: "لا توجد صيدليات متاحة حاليًا",
  },
};

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;
  const hospitalsPerPage = 5;
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [countryTerm, setCountryTerm] = useState<string>("");
  const [specialtyTerm, setSpecialtyTerm] = useState<string>("");
  const [language, setLanguage] = useState<Language>("ar");

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

  const resetFilters = () => {
    setSelectedPrices([]);
    setSelectedCountries([]);
    setSelectedSpecialties([]);
    setCountryTerm("");
    setSpecialtyTerm("");
    setCurrentPage(1);
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const countryMatch = doctor.location
      .toLowerCase()
      .includes(countryTerm.toLowerCase());
    const specialtyMatch = doctor.specialty
      .toLowerCase()
      .includes(specialtyTerm.toLowerCase());
    return countryMatch && specialtyMatch;
  });

  const filteredHospitals = hospitals.filter((hospital) => {
    const countryMatch = hospital.doctors[1].city
      .toLowerCase()
      .includes(countryTerm.toLowerCase());
    const specialtyMatch = hospital.specialities.some((speciality) =>
      speciality.name.toLowerCase().includes(specialtyTerm.toLowerCase())
    );
    return countryMatch && specialtyMatch;
  });

  const filteredLabs = labs.filter((lab) => {
    const countryMatch = lab.city
      .toLowerCase()
      .includes(countryTerm.toLowerCase());
    return countryMatch;
  });

  const totalDoctorPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  const totalHospitalPages = Math.ceil(
    filteredHospitals.length / hospitalsPerPage
  );
  const indexOfLastHospital = currentPage * hospitalsPerPage;
  const indexOfFirstHospital = indexOfLastHospital - hospitalsPerPage;
  const currentHospitals = filteredHospitals.slice(
    indexOfFirstHospital,
    indexOfLastHospital
  );

  const totalLabPages = Math.ceil(filteredLabs.length / hospitalsPerPage);
  const indexOfLastLab = currentPage * hospitalsPerPage;
  const indexOfFirstLab = indexOfLastLab - hospitalsPerPage;
  const currentLabs = filteredLabs.slice(indexOfFirstLab, indexOfLastLab);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearchUpdate = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
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
        {searchTerm === "doctorsSearch" ? (
          <div className="space-y-4 lg:w-full">
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
            {translations[language].noPharmacies}
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
