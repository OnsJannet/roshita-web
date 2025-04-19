"use client";

import LoadingDoctors from "@/components/layout/LoadingDoctors";
import PaginationDemo from "@/components/shared/PaginationDemo";
import DoctorCard from "@/components/unique/DorctorCard";
import FilterDoctor from "@/components/unique/FilterDoctor";
import TitleSection from "@/components/unique/TitleSection";
import { useParams, useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [language, setLanguage] = useState<Language>("ar");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorCount, setDoctorCount] = useState(0);
  const [filtersDisabled, setFiltersDisabled] = useState(false);
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
  const [selectedCountry, setSelectedCountry] = useState<string[]>([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string[]>([]);
  const [selectedHospitals, setSelectedHospitals] = useState<string[]>([]);

  // Check if filters came from URL params
  useEffect(() => {
    const hasParams = country || specialty || state || hospital;
    setFiltersDisabled(!!hasParams);
  }, [country, specialty, state, hospital]);

  // Update URL when filters change
  const updateUrlWithFilters = () => {
    const queryParams = new URLSearchParams();
    
    if (selectedSpeciality.length > 0 && selectedSpeciality[0] !== "all") {
      queryParams.set("specialty", selectedSpeciality[0]);
    }
    if (selectedCountry.length > 0 && selectedCountry[0] !== "all") {
      queryParams.set("country", selectedCountry[0]);
    }
    if (selectedState.length > 0 && selectedState[0] !== "all") {
      queryParams.set("state", selectedState[0]);
    }
    if (selectedHospitals.length > 0 && selectedHospitals[0] !== "all") {
      queryParams.set("hospital", selectedHospitals[0]);
    }

    const newUrl = `${pathname}?${queryParams.toString()}`;
    router.push(newUrl);
  };

  // Automatic filter reset when URL params change
  useEffect(() => {
    setSelectedCountry(country ? [country] : []);
    setSelectedSpeciality(specialty ? [specialty] : []);
    setSelectedState(state ? [state] : []);
    setSelectedHospitals(hospital ? [hospital] : []);
    setSelectedPrices([]);
    setCurrentPage(1);
  }, [country, specialty, state, hospital]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        
        const queryParams = new URLSearchParams();
        queryParams.append("page", currentPage.toString());
        
        if (selectedSpeciality.length > 0 && selectedSpeciality[0] !== "all") {
          queryParams.append("specialty", selectedSpeciality[0]);
        }
        if (selectedCountry.length > 0 && selectedCountry[0] !== "all") {
          queryParams.append("country", selectedCountry[0]);
        }
        if (selectedState.length > 0 && selectedState[0] !== "all") {
          queryParams.append("city", selectedState[0]);
        }
        if (selectedHospitals.length > 0 && selectedHospitals[0] !== "all") {
          queryParams.append("medical_organization", selectedHospitals[0]);
        }
        
        const response = await fetch(
          `http://test-roshita.net/api/user-doctors/?${queryParams.toString()}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        
        const data = await response.json();
        
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

  // Update URL when filters change (except price)
  useEffect(() => {
    if (selectedCountry.length > 0 || selectedSpeciality.length > 0 || 
        selectedState.length > 0 || selectedHospitals.length > 0) {
      updateUrlWithFilters();
    }
  }, [selectedCountry, selectedSpeciality, selectedState, selectedHospitals]);

  const resetFilters = () => {
    setSelectedPrices([]);
    setSelectedCountry([]);
    setSelectedSpeciality([]);
    setSelectedState([]);
    setSelectedHospitals([]);
    setCurrentPage(1);
    setFiltersDisabled(false);
    //@ts-ignore
    router.push(pathname);
  };

  const totalPages = Math.ceil(doctorCount / doctorsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const filteredDoctors = doctors.filter(doctor => {
    if (selectedPrices.length > 0 && selectedPrices[0] !== "all" && !selectedPrices.includes(doctor.price)) {
      return false;
    }
    
    if (selectedSpeciality.length > 0 && selectedSpeciality[0] !== "all" && 
        !selectedSpeciality.includes(doctor.specialization)) {
      return false;
    }
    
    if (selectedHospitals.length > 0 && selectedHospitals[0] !== "all") {
      const hospitalMatch = doctor.medical_organizations.some(org => 
        selectedHospitals.includes(org.name) || selectedHospitals.includes(org.foreign_name)
      );
      if (!hospitalMatch) return false;
    }
    
    if (selectedCountry.length > 0 && selectedCountry[0] !== "all") {
      const countryMatch = doctor.medical_organizations.some(org => 
        selectedCountry.includes(org.city.country.name) || 
        selectedCountry.includes(org.city.country.foreign_name)
      );
      if (!countryMatch) return false;
    }
    
    if (selectedState.length > 0 && selectedState[0] !== "all" && 
        !selectedState.includes(doctor.city)) {
      return false;
    }
    
    return true;
  });

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
            setSelectedCountries={(values) => {
              setSelectedCountry(values);
            }}
            selectedSpecialties={selectedSpeciality}
            setSelectedSpecialties={(values) => {
              setSelectedSpeciality(values);
            }}
            selectedHospitals={selectedHospitals}
            setSelectedHospitals={(values) => {
              setSelectedHospitals(values);
            }}
            disabled={filtersDisabled}
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