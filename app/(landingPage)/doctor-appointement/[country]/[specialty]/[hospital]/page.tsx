"use client";

import LoadingDoctors from "@/components/layout/LoadingDoctors";
import PaginationDemo from "@/components/shared/PaginationDemo";
import DoctorCard from "@/components/unique/DorctorCard";
import FilterDoctor from "@/components/unique/FilterDoctor";
import TitleSection from "@/components/unique/TitleSection";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type Language = "ar" | "en";

const translations = {
  ar: {
    resetFilters: "إعادة ضبط الفلاتر",
    noDoctors: "لا يوجد أطباء متاحون",
  },
  en: {
    resetFilters: "Reset Filters",
    noDoctors: "No doctors available",
  },
};

// Define the Doctor type
interface MedicalOrganization {
  id: number;
  name: string;
  foreign_name: string;
  phone: string;
  email: string;
  city: {
    id: number;
    country: {
      id: number;
      name: string;
      foreign_name: string;
    };
    name: string;
    foreign_name: string;
  };
  address: string;
  Latitude: number;
  Longitude: number;
}

interface Doctor {
  doctor_id: number;
  name: string;
  specialization: string;
  hospital: string;
  city: string;
  address: string | null;
  image: string;
  price: string;
  rating: number | null;
  appointment_dates: string[];
  medical_organizations: MedicalOrganization[];
}

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [language, setLanguage] = useState<Language>("ar");
  const [loading, setLoading] = useState(false);
  const [noDoctors, setNoDoctors] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const doctorsPerPage = 5;
  const [doctorCount, setDoctorCount] = useState(0);

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

  const hospital = params?.hospital
    ? Array.isArray(params.hospital)
      ? decodeURIComponent(params.hospital[0])
      : decodeURIComponent(params.hospital)
    : undefined;

  useEffect(() => {
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

    fetchDoctors(currentPage);
  }, [currentPage]);

  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedHospitals, setSelectedHospitals] = useState<string[]>([]);

  useEffect(() => {
    if (country) {
      setSelectedCountries([country]);
    }
    if (specialty) {
      setSelectedSpecialties([specialty]);
    }
    if (hospital) {
      setSelectedHospitals([hospital]);
    }
  }, [country, specialty, hospital]);

  const resetFilters = () => {
    setSelectedPrices([]);
    setSelectedCountries([]);
    setSelectedSpecialties([]);
    setSelectedHospitals([]);
    setCurrentPage(1);
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const priceMatch =
      selectedPrices.length === 0 ||
      selectedPrices.includes("all") ||
      selectedPrices.includes(doctor.price);

    const countryMatch =
      selectedCountries.length === 0 ||
      selectedCountries.includes("all") ||
      selectedCountries.some((selectedCountry) => {
        return doctor.medical_organizations[0]?.city?.country?.name.includes(
          selectedCountry
        );
      });

    const specialtyMatch =
      selectedSpecialties.length === 0 ||
      selectedSpecialties.includes("all") ||
      selectedSpecialties.includes(doctor.specialization);

    const hospitalMatch =
      selectedHospitals.length === 0 ||
      selectedHospitals.includes("all") ||
      selectedHospitals.includes(
        language === "ar"
          ? doctor.medical_organizations[0]?.name
          : doctor.medical_organizations[0]?.foreign_name
      );

    return priceMatch && countryMatch && specialtyMatch && hospitalMatch;
  });

  useEffect(() => {
    setNoDoctors(filteredDoctors.length === 0);
  }, [filteredDoctors]);

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const totalDoctorPages = Math.ceil(doctorCount / doctorsPerPage);
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;

  /*const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );*/

  //bg-[#F9F9F9]

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    isLoading ? (
      <div className="bg-white flex items-center justify-center min-h-screen">
        <LoadingDoctors />
      </div>

    ) : (
    <div className="bg-white pb-20">
      <TitleSection />
      <div className="flex lg:flex-row-reverse flex-col mt-20 p-4 lg:gap-10 gap-2 max-w-[1280px] mx-auto">
        <div className="lg:w-[20%]">
          <FilterDoctor
            doctors={doctors}
            selectedPrices={selectedPrices}
            setSelectedPrices={setSelectedPrices}
            selectedCountries={selectedCountries}
            setSelectedCountries={setSelectedCountries}
            selectedSpecialties={selectedSpecialties}
            setSelectedSpecialties={setSelectedSpecialties}
            selectedHospitals={selectedHospitals}
            setSelectedHospitals={setSelectedHospitals}
          />

          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full"
            onClick={resetFilters}
          >
            {translations[language].resetFilters}
          </button>
        </div>

        <div className="space-y-4 lg:w-[80%]">
          {noDoctors ? (
            <div className="text-center text-xl font-semibold mx-auto mt-10">
              {translations[language].noDoctors}
            </div>
          ) : (
            <>
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.doctor_id}
                  id={doctor.doctor_id}
                  name={doctor.name}
                  specialty={doctor.specialization}
                  rating={doctor.rating}
                  reviewsCount={0}
                  price={doctor.price}
                  location={doctor.city}
                  hospital={
                    language === "ar"
                      ? doctor.medical_organizations[0]?.name
                      : doctor.medical_organizations[0]?.foreign_name
                  }
                  imageUrl={doctor.image}
                />
              ))}

              <PaginationDemo
                currentPage={currentPage}
                totalPages={totalDoctorPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
    )
  );
};

export default Page;
