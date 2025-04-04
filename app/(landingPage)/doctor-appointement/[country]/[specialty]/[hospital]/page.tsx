"use client";

import LoadingDoctors from "@/components/layout/LoadingDoctors";
import PaginationDemo from "@/components/shared/PaginationDemo";
import DoctorCard from "@/components/unique/DorctorCard";
import FilterDoctor from "@/components/unique/FilterDoctor";
import TitleSection from "@/components/unique/TitleSection";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [language, setLanguage] = useState<Language>("ar");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorCount, setDoctorCount] = useState(0);
  const doctorsPerPage = 5;

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

  const state = params?.state
    ? Array.isArray(params.state)
      ? decodeURIComponent(params.state[0])
      : decodeURIComponent(params.state)
    : undefined;

  const hospital = params?.hospital
    ? Array.isArray(params.hospital)
      ? decodeURIComponent(params.hospital[0])
      : decodeURIComponent(params.hospital)
    : undefined;

  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string[]>(country ? [country] : []);
  const [selectedSpeciality, setSelectedSpeciality] = useState<string[]>(specialty ? [specialty] : []);
  const [selectedState, setSelectedState] = useState<string[]>(state ? [state] : []);
  const [selectedHospitals, setSelectedHospitals] = useState<string[]>(hospital ? [hospital] : []);

  useEffect(() => {
    if (country) setSelectedCountry([country]);
    if (specialty) setSelectedSpeciality([specialty]);
    if (state) setSelectedState([state]);
    if (hospital) setSelectedHospitals([hospital]);
  }, [country, specialty, state, hospital]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        
        // Build query parameters
        const queryParams = new URLSearchParams();
        queryParams.append("page", currentPage.toString());
        
        // Only add filters if they're not "all" or undefined
        if (selectedSpeciality.length > 0 && selectedSpeciality[0] !== "all") {
          queryParams.append("speciality", selectedSpeciality[0]);
        }
        if (selectedCountry.length > 0 && selectedCountry[0] !== "all") {
          queryParams.append("country", selectedCountry[0]);
        }
        if (selectedState.length > 0 && selectedState[0] !== "all") {
          queryParams.append("state", selectedState[0]);
        }
        if (selectedHospitals.length > 0 && selectedHospitals[0] !== "all") {
          queryParams.append("hospital", selectedHospitals[0]);
        }
        
        const response = await fetch(
          `https://test-roshita.net/api/user-doctors/?${queryParams.toString()}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        
        const data = await response.json();
        
        // Handle different response structures
        let doctorsData = [];
        let totalCount = 0;
        
        if (data.results?.data?.doctors) {
          doctorsData = data.results.data.doctors;
          totalCount = data.results.total || data.total || 0;
        } else if (data.doctors) {
          doctorsData = data.doctors;
          totalCount = data.total || 0;
        } else {
          doctorsData = [];
          totalCount = 0;
        }
        
        setDoctors(doctorsData);
        setDoctorCount(data.count);
      } catch (err: any) {
        setError(err.message);
        setDoctors([]);
        setDoctorCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [currentPage, selectedCountry, selectedSpeciality, selectedState, selectedHospitals]);

  const resetFilters = () => {
    setSelectedPrices([]);
    setSelectedCountry([]);
    setSelectedSpeciality([]);
    setSelectedState([]);
    setSelectedHospitals([]);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(doctorCount / doctorsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Apply client-side price filtering if needed
  const filteredDoctors = selectedPrices.length > 0 && selectedPrices[0] !== "all"
    ? doctors.filter(doctor => selectedPrices.includes(doctor.price || ""))
    : doctors;

  return isLoading ? (
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
            selectedCountries={selectedCountry}
            setSelectedCountries={setSelectedCountry}
            selectedSpecialties={selectedSpeciality}
            setSelectedSpecialties={setSelectedSpeciality}
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
          {filteredDoctors.length === 0 ? (
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
                      ? doctor.medical_organizations[0]?.name || ""
                      : doctor.medical_organizations[0]?.foreign_name || ""
                  }
                  imageUrl={doctor.image}
                />
              ))}

              <PaginationDemo
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;