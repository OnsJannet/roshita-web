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

  const city = params?.city
    ? Array.isArray(params.city)
      ? decodeURIComponent(params.city[0])
      : decodeURIComponent(params.city)
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

  const doctor = params?.doctor
    ? Array.isArray(params.doctor)
      ? decodeURIComponent(params.doctor[0])
      : decodeURIComponent(params.doctor)
    : undefined;

  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string[]>([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState<string[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string[]>([]);

  // Check if filters came from URL params
  useEffect(() => {
    const hasParams = country || city || specialty || hospital || doctor;
    setFiltersDisabled(!!hasParams);
  }, [country, city, specialty, hospital, doctor]);

  // Update URL when filters change
  const updateUrlWithFilters = () => {
    const basePath = "/doctor-appointement";
    let newPath = basePath;

    // Build the path with the selected filters in the specified order
    const countryPath = selectedCountry.length > 0 && selectedCountry[0] !== "all" 
      ? `/${encodeURIComponent(selectedCountry[0])}` 
      : "/all";
    
    const cityPath = selectedCity.length > 0 && selectedCity[0] !== "all" 
      ? `/${encodeURIComponent(selectedCity[0])}` 
      : "/all";
    
    const specialtyPath = selectedSpeciality.length > 0 && selectedSpeciality[0] !== "all" 
      ? `/${encodeURIComponent(selectedSpeciality[0])}` 
      : "/all";
    
    const hospitalPath = selectedHospital.length > 0 && selectedHospital[0] !== "all" 
      ? `/${encodeURIComponent(selectedHospital[0])}` 
      : "/all";
    
    const doctorPath = selectedDoctor.length > 0 && selectedDoctor[0] !== "all" 
      ? `/${encodeURIComponent(selectedDoctor[0])}` 
      : "/all";

    newPath += `${countryPath}${cityPath}${specialtyPath}${hospitalPath}${doctorPath}`;
    
    router.push(newPath);
  };

  // Automatic filter reset when URL params change
  useEffect(() => {
    setSelectedCountry(country && country !== "all" ? [country] : []);
    setSelectedCity(city && city !== "all" ? [city] : []);
    setSelectedSpeciality(specialty && specialty !== "all" ? [specialty] : []);
    setSelectedHospital(hospital && hospital !== "all" ? [hospital] : []);
    setSelectedDoctor(doctor && doctor !== "all" ? [doctor] : []);
    setSelectedPrices([]);
    setCurrentPage(1);
  }, [country, city, specialty, hospital, doctor]);

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
        if (selectedCity.length > 0 && selectedCity[0] !== "all") {
          queryParams.append("city", selectedCity[0]);
        }
        if (selectedHospital.length > 0 && selectedHospital[0] !== "all") {
          queryParams.append("medical_organization", selectedHospital[0]);
        }
        if (selectedDoctor.length > 0 && selectedDoctor[0] !== "all") {
          queryParams.append("doctor", selectedDoctor[0]);
        }
        
        const response = await fetch(
          `https://test-roshita.net/api/user-doctors/?${queryParams.toString()}`
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
        setDoctorCount(totalCount);
      } catch (err: any) {
        setError(err.message);
        setDoctors([]);
        setDoctorCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [currentPage, selectedCountry, selectedCity, selectedSpeciality, selectedHospital, selectedDoctor]);

  // Update URL when filters change (except price)
  useEffect(() => {
    if (selectedCountry.length > 0 || selectedCity.length > 0 || 
        selectedSpeciality.length > 0 || selectedHospital.length > 0 || selectedDoctor.length > 0) {
      updateUrlWithFilters();
    }
  }, [selectedCountry, selectedCity, selectedSpeciality, selectedHospital, selectedDoctor]);

  const resetFilters = () => {
    setSelectedPrices([]);
    setSelectedCountry([]);
    setSelectedCity([]);
    setSelectedSpeciality([]);
    setSelectedHospital([]);
    setSelectedDoctor([]);
    setCurrentPage(1);
    setFiltersDisabled(false);
    router.push("/doctor-appointement/all/all/all/all/all");
  };

  const totalPages = Math.ceil(doctorCount / doctorsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const filteredDoctors = doctors.filter(doctor => {
    // Filter by doctor name if selected
    if (selectedDoctor.length > 0 && selectedDoctor[0] !== "all" && 
        !doctor.name.toLowerCase().includes(selectedDoctor[0].toLowerCase())) {
      return false;
    }
    
    if (selectedPrices.length > 0 && selectedPrices[0] !== "all" && !selectedPrices.includes(doctor.price)) {
      return false;
    }
    
    if (selectedSpeciality.length > 0 && selectedSpeciality[0] !== "all" && 
        !selectedSpeciality.includes(doctor.specialization)) {
      return false;
    }
    
    if (selectedHospital.length > 0 && selectedHospital[0] !== "all") {
      const hospitalMatch = doctor.medical_organizations.some(org => {
        const orgName = org.name.toLowerCase();
        const orgForeignName = org.foreign_name ? org.foreign_name.toLowerCase() : '';
        
        return selectedHospital.some(hospital => {
          const selectedHospitalName = hospital.toLowerCase();
          return orgName.includes(selectedHospitalName) || 
                 orgForeignName.includes(selectedHospitalName) ||
                 selectedHospitalName.includes(orgName) ||
                 selectedHospitalName.includes(orgForeignName);
        });
      });
      
      if (!hospitalMatch) return false;
    }
    
    if (selectedCountry.length > 0 && selectedCountry[0] !== "all") {
      const countryMatch = doctor.medical_organizations.some(org => {
        if (!org.city || !org.city.country) return false;
        
        const countryName = org.city.country.name ? org.city.country.name.toLowerCase() : '';
        const countryForeignName = org.city.country.foreign_name ? org.city.country.foreign_name.toLowerCase() : '';
        
        return selectedCountry.some(country => {
          const selectedCountryName = country.toLowerCase();
          return countryName.includes(selectedCountryName) || countryForeignName.includes(selectedCountryName);
        });
      });
      
      if (!countryMatch) return false;
    }
    
    if (selectedCity.length > 0 && selectedCity[0] !== "all" && 
        !selectedCity.some(c => doctor.city && doctor.city.toLowerCase().includes(c.toLowerCase()))) {
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
            setSelectedCountries={setSelectedCountry}
            selectedCities={selectedCity}
            setSelectedCities={setSelectedCity}
            selectedSpecialties={selectedSpeciality}
            setSelectedSpecialties={setSelectedSpeciality}
            selectedHospitals={selectedHospital}
            setSelectedHospitals={setSelectedHospital}
            selectedDoctors={selectedDoctor}
            setSelectedDoctors={setSelectedDoctor}
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
                  price={`${doctor.price} ${language === 'ar' ? 'د.ل' : 'DL'}`}
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