"use client";
import React, { useEffect, useState } from "react";
import GuideTitleSection2 from "@/components/unique/GuideTitleSection2";
import PaginationDemo from "@/components/shared/PaginationDemo";
import DoctorCard from "@/components/unique/DorctorCard";
import HospitalCard from "@/components/unique/HospitalCard";
import LabsCard from "@/components/unique/LabsCard";
import { useParams } from "next/navigation";
import LoadingDoctors from "@/components/layout/LoadingDoctors";

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
  medical_organizations?: {
    city: {
      country: {
        name: string;
        foreign_name: string;
      };
      name: string;
      foreign_name: string;
    };
  }[];
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
  const params = useParams();
  const type = params?.type as string;
  
  const [activeFilter, setActiveFilter] = useState<"doctorsSearch" | "hospitalsSearch" | "labs">(
    type === "hospitals" ? "hospitalsSearch" :
    type === "doctors" ? "doctorsSearch" :
    type === "labs" || type === "pharmacies" ? "labs" : "doctorsSearch"
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [displayedDoctors, setDisplayedDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [language, setLanguage] = useState<Language>("ar");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [countryTerm, setCountryTerm] = useState("");
  const [specialtyTerm, setSpecialtyTerm] = useState("");
  const [cityTerm, setCityTerm] = useState("");

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

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all doctors at once
        if (activeFilter === "doctorsSearch") {
          const doctorsRes = await fetch(`https://test-roshita.net/api/user-doctors/`);
          const doctorsData = await doctorsRes.json();
          if (!doctorsRes.ok) throw new Error("Failed to fetch doctors");
          setAllDoctors(doctorsData.data.doctors || []);
        }

        // Fetch hospitals if needed
        if (activeFilter === "hospitalsSearch" || hospitals.length === 0) {
          const hospitalsRes = await fetch("/api/userHospital/getHospital");
          const hospitalsData = await hospitalsRes.json();
          if (!hospitalsRes.ok) throw new Error("Failed to fetch hospitals");
          setHospitals(hospitalsData.data || []);
        }

        // Fetch labs if needed
        if (activeFilter === "labs" || labs.length === 0) {
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
  }, [activeFilter]);

  // Update active filter when URL changes
  useEffect(() => {
    if (type === "hospitals") {
      setActiveFilter("hospitalsSearch");
    } else if (type === "doctors") {
      setActiveFilter("doctorsSearch");
    } else if (type === "labs" || type === "pharmacies") {
      setActiveFilter("labs");
    }
  }, [type]);

  // Filter doctors based on search and filter terms
  useEffect(() => {
    if (activeFilter !== "doctorsSearch") return;

    const filtered = allDoctors.filter((doctor) => {
      // Search term matching
      const matchesSearch = searchTerm 
        ? doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      
      // Country matching
      const matchesCountry = countryTerm 
        ? (doctor.medical_organizations?.some(org => 
            org.city.country.name.toLowerCase().includes(countryTerm.toLowerCase()) ||
            org.city.country.foreign_name?.toLowerCase().includes(countryTerm.toLowerCase())
          ) || 
          doctor.city?.toLowerCase().includes(countryTerm.toLowerCase()))
        : true;
      
      // Specialty matching
      const matchesSpecialty = specialtyTerm 
        ? doctor.specialization.toLowerCase().includes(specialtyTerm.toLowerCase())
        : true;
      
      // City matching
      const matchesCity = cityTerm 
        ? (doctor.medical_organizations?.some(org => 
            org.city.name.toLowerCase().includes(cityTerm.toLowerCase()) ||
            org.city.foreign_name?.toLowerCase().includes(cityTerm.toLowerCase())
          ) || 
          doctor.city?.toLowerCase().includes(cityTerm.toLowerCase()))
        : true;
      
      return matchesSearch && matchesCountry && matchesSpecialty && matchesCity;
    });

    setFilteredDoctors(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [allDoctors, searchTerm, countryTerm, specialtyTerm, cityTerm, activeFilter]);

  // Paginate doctors
  useEffect(() => {
    if (activeFilter !== "doctorsSearch") return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    setDisplayedDoctors(filteredDoctors.slice(startIndex, startIndex + itemsPerPage));
  }, [currentPage, filteredDoctors, activeFilter]);

  // Filter hospitals
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

  // Filter labs
  const filteredLabs = labs.filter((lab) => {
    const matchesSearch = searchTerm 
      ? lab.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
      
    return matchesSearch;
  });

  // Pagination calculations
  const totalDoctorPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const totalHospitalPages = Math.ceil(filteredHospitals.length / itemsPerPage);
  const totalLabPages = Math.ceil(filteredLabs.length / itemsPerPage);

  // Get current items for client-side pagination (hospitals and labs)
  const getPaginatedItems = (items: any[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  // Handler functions
  const handleSearchUpdate = (term: string) => {
    if (term === "doctorsSearch" || term === "hospitalsSearch" || term === "labs") {
      setActiveFilter(term);
      setCurrentPage(1);
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        <LoadingDoctors />
      </div>
    );
  }

  return (
    <div className="bg-white pb-20">
      <GuideTitleSection2
        onSearchChange={handleSearchUpdate}
        onCountryChange={handleCountryUpdate}
        onSpecialtyChange={handleSpecialtyUpdate}
        onCityChange={handleCityUpdate}
        initialFilter={activeFilter}
      />
      
      <div className="flex lg:flex-row-reverse flex-col mt-20 p-4 lg:gap-10 gap-2 max-w-[1280px] mx-auto">
        {/* Doctors Section */}
        {activeFilter === "doctorsSearch" && (
          <div className="space-y-4 lg:w-full">
            {displayedDoctors.length === 0 ? (
              <p className="text-center text-xl font-semibold mx-auto">
                {translations[language].noDoctors}
              </p>
            ) : (
              <>
                {displayedDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.doctor_id}
                    id={doctor.doctor_id}
                    name={doctor.name}
                    specialty={doctor.specialization}
                    rating={doctor.rating}
                    reviewsCount={doctor.reviewsCount}
                    price={`${doctor.price} ${language === 'ar' ? 'د.ل' : 'DL'}`}
                    location={doctor.city}
                    hospital={doctor.medical_organizations?.[0]?.city?.name || ""}
                    imageUrl={doctor.image}
                  />
                ))}
                {totalDoctorPages > 1 && (
                  <PaginationDemo
                    currentPage={currentPage}
                    totalPages={totalDoctorPages}
                    onPageChange={handlePageChange}
                  />
                )}
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
                {getPaginatedItems(filteredHospitals, currentPage).map((hospital) => (
                  <HospitalCard
                    key={hospital.id}
                    name={hospital.name}
                    city={hospital.doctors[0]?.city || ""}
                    specialities={hospital.specialities.length}
                    doctorCount={hospital.doctors.length}
                    href=""
                  />
                ))}
                {totalHospitalPages > 1 && (
                  <PaginationDemo
                    currentPage={currentPage}
                    totalPages={totalHospitalPages}
                    onPageChange={handlePageChange}
                  />
                )}
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
                {getPaginatedItems(filteredLabs, currentPage).map((lab, index) => (
                  <LabsCard
                    key={index}
                    name={lab.name}
                    city={lab.city}
                    tests={lab.services.length}
                  />
                ))}
                {totalLabPages > 1 && (
                  <PaginationDemo
                    currentPage={currentPage}
                    totalPages={totalLabPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;