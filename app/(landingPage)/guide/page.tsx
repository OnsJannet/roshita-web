"use client";
import React, { useEffect, useState } from "react";
import GuideTitleSection from "@/components/unique/GuideTitleSection";
import PaginationDemo from "@/components/shared/PaginationDemo";
import FilterDoctor from "@/components/unique/FilterDoctor";
import HospitalCard from "@/components/unique/HospitalCard";
import LabsCard from "@/components/unique/LabsCard";
import DoctorCard from "@/components/unique/DorctorCard";

type Language = "ar" | "en";

interface MedicalServicesCategory {
  full_path: string;
}

interface Service {
  medical_services_category: MedicalServicesCategory;
  price: string;
}

interface Lab {
  name: string;
  city: string;
  services: Service[];
}

interface LabsData {
  Laboratory: Lab[];
  Radiologic: Lab[];
}

interface Doctor {
  doctor_id: number;
  name: string;
  specialization: string;
  rating: number;
  reviewsCount: number;
  price: string;
  city: string;
  imageUrl: string;
}

interface Hospital {
  id: number;
  name: string;
  foreign_name: string;
  doctors: { city: string }[];
  specialities: { name: string }[];
}

const translations = {
  en: {
    resetFilters: "Reset Filters",
    noHospitals: "No hospitals available currently",
    noDoctors: "No doctors available currently", // Fixed this key
    noLabs: "No labs available currently",
  },
  ar: {
    resetFilters: "إعادة ضبط الفلاتر",
    noHospitals: "لا توجد مستشفيات متاحة حاليًا",
    noDoctors: "لا توجد أطباء متاحين حاليًا", // Fixed this key
    noLabs: "لا توجد مختبرات متاحة حاليًا",
  },
};

/**
 * This React component serves as a client-side page that displays and manages
 * a searchable and filterable list of medical services, including doctors,
 * hospitals, and labs. It allows users to filter by country, specialty, and
 * price, and supports pagination for navigating through results.
 *
 * Key functionalities include:
 * - Fetching data for doctors, hospitals, and labs from backend APIs.
 * - Providing search and filter options with reset functionality.
 * - Language support for English and Arabic, stored in localStorage.
 * - Dynamic rendering of components such as DoctorCard, HospitalCard, and LabsCard.
 * - Pagination for doctors, hospitals, and labs.
 *
 * Dependencies:
 * - Custom components (GuideTitleSection, PaginationDemo, DoctorCard, etc.)
 * - React hooks (useState, useEffect) for state management and side effects.
 */

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;
  const hospitalsPerPage = 5;
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [radiology, setRadiology] = useState<Lab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [countryTerm, setCountryTerm] = useState<string>("");
  const [specialtyTerm, setSpecialtyTerm] = useState<string>("");
  const [language, setLanguage] = useState<Language>("ar");
  const [doctorCount, setDoctorCount] = useState(0)

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
    // Fetch hospitals from the backend
    const fetchHospitals = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/userHospital/getHospital");
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Failed to fetch hospitals");
        setHospitals(data.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch doctors from the backend
    const fetchDoctors = async (page: number) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/userDoctor/getDoctor?page=${page}`);
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Failed to fetch doctors");
        setDoctors(data.data || []);
        setDoctorCount(data.total);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch labs from the backend
    const fetchLabs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/userLab/getLab");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch labs");
        setLabs(data.data.Laboratory || []);
        setRadiology(data.data.Radiologic || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitals();
    fetchDoctors(currentPage);
    fetchLabs();
  }, [currentPage]);

  const resetFilters = () => {
    setSelectedPrices([]);
    setSelectedCountries([]);
    setSelectedSpecialties([]);
    setCountryTerm("");
    setSpecialtyTerm("");
    setCurrentPage(1);
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const countryMatch = doctor?.city
      ?.toLowerCase()
      .includes(countryTerm.toLowerCase());
    const specialtyMatch = doctor.specialization
      .toLowerCase()
      .includes(specialtyTerm.toLowerCase());
    return countryMatch && specialtyMatch;
  });

  const filteredHospitals = hospitals.filter((hospital) => {
    const countryMatch = hospital.doctors[1]?.city
      .toLowerCase()
      .includes(countryTerm.toLowerCase());
    const specialtyMatch = hospital.specialities.some((speciality) =>
      speciality.name.toLowerCase().includes(specialtyTerm.toLowerCase())
    );
    return countryMatch && specialtyMatch;
  });

  const filteredLabs = labs.filter((lab) => {
    return lab.services.some((service) => {
      return service.medical_services_category.full_path
        .toLowerCase()
        .includes(countryTerm.toLowerCase());
    });
  });

  const totalDoctorPages = Math.ceil(doctorCount / doctorsPerPage);
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  /*const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );*/

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
    if (newPage > 0 && newPage <= totalDoctorPages) {
      setCurrentPage(newPage);
    }
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
            {doctors.length === 0 ? (
              <p className="text-center text-xl font-semibold mx-auto">
                {translations[language].noDoctors}
              </p>
            ) : (
              doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.doctor_id}
                  id={doctor.doctor_id}
                  name={doctor.name}
                  specialty={doctor.specialization}
                  rating={doctor.rating}
                  reviewsCount={doctor.reviewsCount}
                  price={doctor.price}
                  location={doctor.city}
                  hospital=""
                  imageUrl={doctor.imageUrl}
                />
              ))
            )}
            <PaginationDemo
              currentPage={currentPage}
              totalPages={totalDoctorPages}
              onPageChange={handlePageChange}
            />
          </div>
        ) : searchTerm === "hospitalsSearch" ? (
          <div className="space-y-4 lg:w-full">
            {currentHospitals.length === 0 ? (
              <p className="text-center text-xl font-semibold mx-auto">
                {translations[language].noHospitals}
              </p>
            ) : (
              currentHospitals.map((hospital, index) => (
                <HospitalCard
                  key={index}
                  name={hospital.name}
                  city={hospital.doctors[1].city}
                  specialities={hospital.specialities.length}
                  doctorCount={hospital.doctors.length}
                  href={`/doctor-appointement/all/all/${encodeURIComponent(
                    language === "ar" ? hospital.name : hospital.foreign_name
                  )}`}
                />
              ))
            )}
            <PaginationDemo
              currentPage={currentPage}
              totalPages={totalHospitalPages}
              onPageChange={handlePageChange}
            />
          </div>
        ) : searchTerm === "pharmaciesSearch" ? (
          <p className="text-center text-xl font-semibold mx-auto">
            {translations[language].noLabs}
          </p>
        ) : (
          <div className="space-y-4 lg:w-full">
            {currentLabs.length === 0 ? (
              <p className="text-center text-xl font-semibold mx-auto">
                {translations[language].noLabs}
              </p>
            ) : (
              currentLabs.map((lab, index) => (
                <LabsCard
                  key={index}
                  name={lab.name}
                  city={lab.city}
                  tests={lab.services.length}
                />
              ))
            )}
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
