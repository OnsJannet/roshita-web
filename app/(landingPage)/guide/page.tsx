"use client";
import React, { useEffect, useState } from "react";
import GuideTitleSection2 from "@/components/unique/GuideTitleSection2";
import PaginationDemo from "@/components/shared/PaginationDemo";
import DoctorCard from "@/components/unique/DorctorCard";
import HospitalCard from "@/components/unique/HospitalCard";
import LabsCard from "@/components/unique/LabsCard";

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

interface Doctor {
  doctor_id: number;
  name: string;
  specialization: string;
  rating: number;
  reviewsCount: number;
  price: string;
  city: string;
  image: string;
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
    noDoctors: "No doctors available currently",
    noLabs: "No labs available currently",
  },
  ar: {
    resetFilters: "إعادة ضبط الفلاتر",
    noHospitals: "لا توجد مستشفيات متاحة حاليًا",
    noDoctors: "لا توجد أطباء متاحين حاليًا",
    noLabs: "لا توجد مختبرات متاحة حاليًا",
  },
};

const Page = () => {
  // Pagination states
  const [doctorPage, setDoctorPage] = useState(1);
  const [hospitalPage, setHospitalPage] = useState(1);
  const [labPage, setLabPage] = useState(1);
  
  // Data states
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("ar");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [countryTerm, setCountryTerm] = useState("");
  const [specialtyTerm, setSpecialtyTerm] = useState("");
  const [cityTerm, setCityTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"doctorsSearch" | "hospitalsSearch" | "labs">("doctorsSearch");
  
  // Count states
  const [doctorCount, setDoctorCount] = useState(0);

  // Constants
  const itemsPerPage = 5;

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage as Language);
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
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch doctors with pagination (server-side)
        const doctorsRes = await fetch(`/api/userDoctor/getDoctor?page=${doctorPage}`);
        const doctorsData = await doctorsRes.json();
        
        if (!doctorsRes.ok) throw new Error("Failed to fetch doctors");
        
        setDoctors(doctorsData.data || []);
        setDoctorCount(doctorsData.total || 0);

        // Fetch hospitals (client-side pagination)
        if (hospitals.length === 0) {
          const hospitalsRes = await fetch("/api/userHospital/getHospital");
          const hospitalsData = await hospitalsRes.json();
          
          if (!hospitalsRes.ok) throw new Error("Failed to fetch hospitals");
          
          setHospitals(hospitalsData.data || []);
        }

        // Fetch labs (client-side pagination)
        if (labs.length === 0) {
          const labsRes = await fetch("/api/userLab/getLab");
          const labsData = await labsRes.json();
          
          if (!labsRes.ok) throw new Error("Failed to fetch labs");
          
          setLabs(labsData.data?.Laboratory || []);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [doctorPage]); // Only refetch when doctorPage changes

  const handleSearchUpdate = (term: string) => {
    if (term === "doctorsSearch" || term === "hospitalsSearch" || term === "labs") {
      setActiveFilter(term);
      // Reset to first page when changing filter
      if (term === "doctorsSearch") setDoctorPage(1);
      if (term === "hospitalsSearch") setHospitalPage(1);
      if (term === "labs") setLabPage(1);
    } else {
      setSearchTerm(term);
    }
  };

  const handleCountryUpdate = (term: string) => {
    setCountryTerm(term);
  };

  const handleSpecialtyUpdate = (term: string) => {
    setSpecialtyTerm(term);
  };

  const handleCityUpdate = (term: string) => {
    setCityTerm(term);
  };

  // Filter functions
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = searchTerm 
      ? doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
      
    const matchesCountry = countryTerm 
      ? doctor.city?.toLowerCase().includes(countryTerm.toLowerCase())
      : true;
      
    const matchesSpecialty = specialtyTerm 
      ? doctor.specialization.toLowerCase().includes(specialtyTerm.toLowerCase())
      : true;
      
    const matchesCity = cityTerm 
      ? doctor.city?.toLowerCase().includes(cityTerm.toLowerCase())
      : true;
      
    return matchesSearch && matchesCountry && matchesSpecialty && matchesCity;
  });

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch = searchTerm 
      ? hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        hospital.foreign_name?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
      
    const matchesCountry = countryTerm 
      ? hospital.doctors.some(d => d.city.toLowerCase().includes(countryTerm.toLowerCase()))
      : true;
      
    const matchesCity = cityTerm 
      ? hospital.doctors.some(d => d.city.toLowerCase().includes(cityTerm.toLowerCase()))
      : true;
      
    return matchesSearch && matchesCountry && matchesCity;
  });

  const filteredLabs = labs.filter((lab) => {
    const matchesSearch = searchTerm 
      ? lab.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
      
    return matchesSearch;
  });

  // Pagination calculations
  const totalDoctorPages = Math.ceil(doctorCount / itemsPerPage);
  const totalHospitalPages = Math.ceil(filteredHospitals.length / itemsPerPage);
  const totalLabPages = Math.ceil(filteredLabs.length / itemsPerPage);

  // Get current items for client-side pagination
  const getPaginatedItems = (items: any[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <div className="bg-white pb-20">
      <GuideTitleSection2
        onSearchChange={handleSearchUpdate}
        onCountryChange={handleCountryUpdate}
        onSpecialtyChange={handleSpecialtyUpdate}
        onCityChange={handleCityUpdate}
      />
      
      <div className="flex lg:flex-row-reverse flex-col mt-20 p-4 lg:gap-10 gap-2 max-w-[1280px] mx-auto">
        {/* Doctors Section */}
        {activeFilter === "doctorsSearch" && (
          <div className="space-y-4 lg:w-full">
            {filteredDoctors.length === 0 ? (
              <p className="text-center text-xl font-semibold mx-auto">
                {translations[language].noDoctors}
              </p>
            ) : (
              <>
                {filteredDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.doctor_id}
                    id={doctor.doctor_id}
                    name={doctor.name}
                    specialty={doctor.specialization}
                    rating={doctor.rating}
                    reviewsCount={doctor.reviewsCount}
                    price={`${doctor.price} ${language === 'ar' ? 'د.ل' : 'DL'}`}
                    location={doctor.city}
                    hospital=""
                    imageUrl={doctor.image}
                  />
                ))}
                <PaginationDemo
                  currentPage={doctorPage}
                  totalPages={totalDoctorPages}
                  onPageChange={setDoctorPage}
                />
              </>
            )}
          </div>
        )}

        {/* Hospitals Section */}
        {activeFilter === "hospitalsSearch" && (
          <div className="space-y-4 lg:w-full">
            {filteredHospitals.length === 0 ? (
              <p className="text-center text-xl font-semibold mx-auto">
                {translations[language].noHospitals}
              </p>
            ) : (
              <>
                {getPaginatedItems(filteredHospitals, hospitalPage).map((hospital) => (
                  <HospitalCard
                    key={hospital.id}
                    name={hospital.name}
                    city={hospital.doctors[0]?.city || ""}
                    specialities={hospital.specialities.length}
                    doctorCount={hospital.doctors.length}
                    href=""
                  />
                ))}
                <PaginationDemo
                  currentPage={hospitalPage}
                  totalPages={totalHospitalPages}
                  onPageChange={setHospitalPage}
                />
              </>
            )}
          </div>
        )}

        {/* Labs Section */}
        {activeFilter === "labs" && (
          <div className="space-y-4 lg:w-full">
            {filteredLabs.length === 0 ? (
              <p className="text-center text-xl font-semibold mx-auto">
                {translations[language].noLabs}
              </p>
            ) : (
              <>
                {getPaginatedItems(filteredLabs, labPage).map((lab, index) => (
                  <LabsCard
                    key={index}
                    name={lab.name}
                    city={lab.city}
                    tests={lab.services.length}
                  />
                ))}
                <PaginationDemo
                  currentPage={labPage}
                  totalPages={totalLabPages}
                  onPageChange={setLabPage}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;