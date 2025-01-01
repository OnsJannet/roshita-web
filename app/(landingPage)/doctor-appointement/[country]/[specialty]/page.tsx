"use client";

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
  },
  en: {
    resetFilters: "Reset Filters",
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
  hospital: string; // Assuming this comes from medical_organizations
  city: string;
  address: string | null;
  image: string;
  price: string;
  rating: number | null;
  appointment_dates: string[];
  medical_organizations: MedicalOrganization[];
}

/**
 * This page is responsible for displaying a list of doctors with the ability to filter them by price,
 * country, and specialty. It also supports pagination to navigate through a large list of doctors.
 * 
 * Key Features:
 * - Fetches a list of doctors from an external API.
 * - Allows users to filter doctors by price, country, and specialty.
 * - Implements pagination for a smoother user experience when browsing doctors.
 * - Supports dynamic language switching (Arabic and English) for the UI.
 * - Provides a "Reset Filters" button to clear all active filters.
 * - Displays doctor details in a card format with essential information such as name, specialization,
 *   rating, price, and location.
 * 
 * The page dynamically adjusts the doctor list based on the selected filters, and it ensures that
 * users are able to navigate through the results easily using pagination.
 */


const Page = () => {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]); // Explicitly define the type for doctors
  const doctorsPerPage = 5;
  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
    // Sync the language state with the localStorage value
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage as Language); // Cast stored value to 'Language'
    } else {
      setLanguage("ar"); // Default to 'ar' (Arabic) if no language is set
    }

    // Listen for changes in localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "language") {
        setLanguage((event.newValue as Language) || "ar"); // Cast newValue to 'Language'
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Run only once on mount

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

  // Fetch doctors data
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        //const response = await fetch("https://test-roshita.net/api/doctors-list/", {
        const response = await fetch(
          "https://test-roshita.net/api/user-doctors",
          {
            method: "GET",
            headers: {
              accept: "application/json",
              "X-CSRFToken": process.env.NEXT_PUBLIC_CSRF_TOKEN || "", // Replace with actual CSRF token
            },
          }
        );

        const result = await response.json();

        if (response.ok) {
          // Access doctors from the correct structure
          setDoctors(result.results.data.doctors);
        } else {
          console.error("Failed to fetch doctors", result);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  // Filter State for Price, Country, and Specialty
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  // Decode URL parameters and set filter states
  useEffect(() => {
    if (country) {
      setSelectedCountries([country]);
    }
    if (specialty) {
      setSelectedSpecialties([specialty]);
    }
  }, [country, specialty]);

  // Handle resetting all filters
  const resetFilters = () => {
    setSelectedPrices([]); // Clear prices
    setSelectedCountries([]); // Clear countries
    setSelectedSpecialties([]); // Clear specialties
    setCurrentPage(1); // Reset pagination to the first page
  };

  // Filter doctors by selected prices, countries, and specialties
  const filteredDoctors = doctors.filter((doctor) => {

    // Check if doctor object and properties are defined before applying logic
    const priceMatch =
      selectedPrices.length === 0 || selectedPrices.includes(doctor.price);

    // Match country if the doctor's location (city) includes the selected country (partial match)
    const countryMatch =
      selectedCountries.length === 0 ||
      selectedCountries.some((selectedCountry) =>
        doctor.medical_organizations[0]?.city?.name.includes(selectedCountry)
      );

    // Match specialty if selected specialties contain the doctor's specialization
    const specialtyMatch =
      selectedSpecialties.length === 0 ||
      selectedSpecialties.includes(doctor.specialization);

    return priceMatch && countryMatch && specialtyMatch;
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  // Get current page doctors
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="bg-[#F9F9F9] pb-20">
      <TitleSection />
      <div className="flex lg:flex-row-reverse flex-col mt-20 p-4 lg:gap-10 gap-2 max-w-[1280px] mx-auto">
        <div className="lg:w-[20%]">
          {/* Filter Component */}
          <FilterDoctor
            doctors={doctors}
            selectedPrices={selectedPrices}
            setSelectedPrices={setSelectedPrices}
            selectedCountries={selectedCountries}
            setSelectedCountries={setSelectedCountries}
            selectedSpecialties={selectedSpecialties}
            setSelectedSpecialties={setSelectedSpecialties}
          />

          {/* Reset Filters Button */}
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full"
            onClick={resetFilters}
          >
            {translations[language].resetFilters}
          </button>
        </div>

        <div className="space-y-4 lg:w-[80%]">
          {currentDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.doctor_id}
              id={doctor.doctor_id}
              name={doctor.name}
              specialty={doctor.specialization}
              rating={doctor.rating}
              reviewsCount={0}
              price={doctor.price}
              location={doctor.city}
              imageUrl={doctor.image}
            />
          ))}

          {/* Pagination Component */}
          <PaginationDemo
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
