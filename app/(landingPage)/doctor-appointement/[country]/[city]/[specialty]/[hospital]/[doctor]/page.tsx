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
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [displayedDoctors, setDisplayedDoctors] = useState<Doctor[]>([]);
  const [language, setLanguage] = useState<Language>("ar");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [filtersDisabled, setFiltersDisabled] = useState(false);
  const doctorsPerPage = 5;

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  /*const totalPages = selectedCountry.length === 0 && 
                  selectedCity.length === 0 && 
                  selectedSpeciality.length === 0 && 
                  selectedHospital.length === 0 && 
                  selectedPrices.length === 0 && 
                  selectedDoctor.length === 0
    ? Math.ceil(count / doctorsPerPage)
    : Math.ceil(filteredDoctors.length / doctorsPerPage);*/
  console.log("filteredDoctors.length", filteredDoctors.length)
  console.log("thetotalPage", totalPages)
  console.log("filteredDoctors.length", filteredDoctors.length)
  console.log("thetotalPage", totalPages)

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
  const [count, setCount] = useState(0)

  useEffect(() => {
    const hasParams = country || city || specialty || hospital || doctor;
    setFiltersDisabled(!!hasParams);
  }, [country, city, specialty, hospital, doctor]);

  const updateUrlWithFilters = () => {
    const basePath = "/doctor-appointement";
    let newPath = basePath;

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

  console.log("totalPages", totalPages)

  useEffect(() => {
    console.log("URL params changed:", { country, city, specialty, hospital, doctor });
    setSelectedCountry(country && country !== "all" ? [country] : []);
    setSelectedCity(city && city !== "all" ? [city] : []);
    setSelectedSpeciality(specialty && specialty !== "all" ? [specialty] : []);
    setSelectedHospital(hospital && hospital !== "all" ? [hospital] : []);
    setSelectedDoctor(doctor && doctor !== "all" ? [doctor] : []);
    setSelectedPrices([]);
    setCurrentPage(1);
  }, [country, city, specialty, hospital, doctor]);

  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching doctors with filters:", {
          specialty: selectedSpeciality,
          country: selectedCountry,
          city: selectedCity,
          hospital: selectedHospital,
          doctor: selectedDoctor
        });

        const response = await fetch(
          `https://test-roshita.net/api/user-doctors/`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        
        const data = await response.json();
        let doctorsData = [];
        
        if (data.results?.data?.doctors) {
          doctorsData = data.results.data.doctors;
        } else if (data.doctors) {
          doctorsData = data.doctors;
        } else {
          doctorsData = data;
        }

        console.log("Raw API response:", data);
        console.log("Processed doctors data:", doctorsData);
        setCount(data.count)
        setAllDoctors(doctorsData.data.doctors);
        setTotalDoctors(doctorsData.length);
      } catch (err: any) {
        console.error("Error fetching doctors:", err);
        setError(err.message);
        setAllDoctors([]);
        setTotalDoctors(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllDoctors();
  }, []);

  useEffect(() => {
    console.log("Applying filters to", allDoctors.length, "doctors");
    console.log("Current filters:", {
      prices: selectedPrices,
      countries: selectedCountry,
      cities: selectedCity,
      specialties: selectedSpeciality,
      hospitals: selectedHospital,
      doctors: selectedDoctor
    });

    const filtered = allDoctors.filter(doctor => {
      let passed = true;
      
      // Doctor name filter
      if (selectedDoctor.length > 0 && selectedDoctor[0] !== "all") {
        const nameMatch = doctor.name.toLowerCase().includes(selectedDoctor[0].toLowerCase());
        if (!nameMatch) {
          console.log(`Doctor ${doctor.name} filtered out - name doesn't match`);
          passed = false;
        }
      }
      
      // Price filter
      if (passed && selectedPrices.length > 0 && selectedPrices[0] !== "all") {
        const priceMatch = selectedPrices.includes(doctor.price);
        if (!priceMatch) {
          console.log(`Doctor ${doctor.name} filtered out - price doesn't match`);
          passed = false;
        }
      }
      
      // Specialty filter
      if (passed && selectedSpeciality.length > 0 && selectedSpeciality[0] !== "all") {
        const specialtyMatch = selectedSpeciality.includes(doctor.specialization);
        if (!specialtyMatch) {
          console.log(`Doctor ${doctor.name} filtered out - specialty doesn't match`);
          passed = false;
        }
      }
      
      // Hospital filter
      if (passed && selectedHospital.length > 0 && selectedHospital[0] !== "all") {
        const hospitalMatch = doctor.medical_organizations?.some(org => {
          const orgName = org.name.toLowerCase();
          const orgForeignName = org.foreign_name?.toLowerCase() || '';
          
          return selectedHospital.some(hospital => {
            const selectedHospitalName = hospital.toLowerCase();
            return orgName.includes(selectedHospitalName) || 
                   orgForeignName.includes(selectedHospitalName) ||
                   selectedHospitalName.includes(orgName) ||
                   selectedHospitalName.includes(orgForeignName);
          });
        });
        
        if (!hospitalMatch) {
          console.log(`Doctor ${doctor.name} filtered out - hospital doesn't match`);
          passed = false;
        }
      }
      
      // Country filter
      if (passed && selectedCountry.length > 0 && selectedCountry[0] !== "all") {
        const countryMatch = doctor.medical_organizations?.some(org => {
          if (!org.city || !org.city.country) return false;
          
          const countryName = org.city.country.name?.toLowerCase() || '';
          const countryForeignName = org.city.country.foreign_name?.toLowerCase() || '';
          
          return selectedCountry.some(country => {
            const selectedCountryName = country.toLowerCase();
            return countryName.includes(selectedCountryName) || 
                   countryForeignName.includes(selectedCountryName);
          });
        });
        
        if (!countryMatch) {
          console.log(`Doctor ${doctor.name} filtered out - country doesn't match`);
          passed = false;
        }
      }
      
      // City filter
      if (passed && selectedCity.length > 0 && selectedCity[0] !== "all") {
        const cityMatch = selectedCity.some(c => 
          doctor.city?.toLowerCase().includes(c.toLowerCase())
        );
        if (!cityMatch) {
          console.log(`Doctor ${doctor.name} filtered out - city doesn't match`);
          passed = false;
        }
      }
      
      return passed;
    });

    console.log("Filtered doctors:", filtered);
    setFilteredDoctors(filtered);
    setCurrentPage(1);
  }, [allDoctors, selectedPrices, selectedCountry, selectedCity, selectedSpeciality, selectedHospital, selectedDoctor]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * doctorsPerPage;
    const endIndex = startIndex + doctorsPerPage;
    setDisplayedDoctors(filteredDoctors.slice(startIndex, endIndex));
  }, [currentPage, filteredDoctors]);

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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            doctors={allDoctors}
            selectedPrices={selectedPrices}
            setSelectedPrices={setSelectedPrices}
            selectedCountries={selectedCountry}
            setSelectedCountries={setSelectedCountry}
            //selectedCities={selectedCity}
            //setSelectedCities={setSelectedCity}
            selectedSpecialties={selectedSpeciality}
            setSelectedSpecialties={setSelectedSpeciality}
            selectedHospitals={selectedHospital}
            setSelectedHospitals={setSelectedHospital}
            //@ts-ignore
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
          {displayedDoctors.length === 0 ? (
            <div className="text-center text-xl font-semibold mx-auto mt-10">
              {translations[language].noDoctors}
            </div>
          ) : (
            <>
              {displayedDoctors.map((doctor) => (
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

              {totalPages >= 1 && (
                <div className="mt-8 flex justify-center">
                  <PaginationDemo
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;