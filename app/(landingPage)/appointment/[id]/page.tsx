"use client";
import withAuth from "@/hoc/withAuth";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doctors } from "@/constant";
import DoctorCardAppointment from "@/components/unique/DoctorCardAppointment";
import LoadingDoctors from "@/components/layout/LoadingDoctors";

interface Doctor {
  doctor_id: number;
  name: string;
  specialization: string;
  rating: number | null;
  reviewsCount: number;
  price: string;
  location: string;
  image: string;
  medical_organizations: { id: number; name: string };
}

type Language = "ar" | "en";

/**
 * Appointment page allows users to view detailed information about a specific doctor
 * and manage their appointment preferences (day and time).
 *
 * Key Features:
 * - Retrieves the doctor ID from the URL parameters and finds the corresponding doctor
 *   from a predefined list (`doctors` constant).
 * - Fetches appointment day and time preferences from `localStorage` to pre-fill the appointment details.
 * - Displays detailed doctor information (name, specialty, rating, reviews, price, location, and image)
 *   using the `DoctorCardAppointment` component.
 * - If the doctor is not found based on the provided ID, it displays a "Doctor not found" message.
 * - The page is wrapped with `withAuth` higher-order component (HOC) to enforce authentication before accessing.
 *
 * This page provides a user-friendly interface for managing appointments with doctors and ensures
 * that users can only access it if they are authenticated.
 */

const Appointment = () => {
  const params = useParams();
  const router = useRouter();
  const [appointmentDay, setAppointmentDay] = useState<string>("");
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("ar");
  const [appointmentEndTime, setAppointmentEndTime] = useState<string>("");
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string>("");

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

  // Parse doctor id from URL params
  const id = parseInt(
    Array.isArray(params?.id) ? params.id[0] : params?.id ?? "",
    10
  );

  useEffect(() => {
    // Check if we're coming from a payment success
    const paymentSuccess = localStorage.getItem("paymentSuccess");
    const storedAppointmentId = localStorage.getItem("appointmentId");

    if (paymentSuccess === "true" && storedAppointmentId) {
      setShowPaymentSuccess(true);
      setAppointmentId(storedAppointmentId);
      // Clear the payment success flag
      localStorage.removeItem("paymentSuccess");
    }

    // Fetch doctors data from the API using the correct endpoint
    const fetchDoctor = async () => {
      try {
        const response = await fetch(
          `https://test-roshita.net/api/user-doctors/${id}/`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              "X-CSRFToken":
                "rquDldN5xzfxmgsqkc9SyFHxXhrzOvrkLbz03SVR3D5Fj6F8nOdG3iSrUINQgzBg", // Include CSRF token if needed
            },
            redirect: "follow", // Automatically follow redirects
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch doctor data");
        }

        const data = await response.json();
        console.log("Doctor data:", data.data.doctors[0]);

        // Find the doctor by ID
        const selectedDoctor = data.data.doctors[0];
        setDoctor(selectedDoctor || null);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();

    // Fetch appointment preferences from localStorage
    const day = localStorage.getItem("appointmentDay") || "";
    const time = localStorage.getItem("appointmentTime") || "";
    const endTime = localStorage.getItem("appointmentEndTime") || "";
    setAppointmentDay(day);
    setAppointmentTime(time);
    setAppointmentEndTime(endTime);
  }, [id]); // Re-run the effect whenever `id` changes

  const handleCloseModal = () => {
    setShowPaymentSuccess(false);
    router.push("/appointments");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        <LoadingDoctors />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-lg  font-semibold">
        {language === "ar" ? `خطأ: ${error}` : `Error: ${error}`}
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex justify-center items-center h-screen text-lg  font-semibold">
        {language === "ar" ? "الطبيب غير موجود" : "Doctor not found"}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-[1280px]">
      {/* Payment Success Modal */}
      {showPaymentSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                {language === "ar" ? "تم الدفع بنجاح" : "Payment Successful"}
              </h3>
              <div className="mt-2 text-sm text-gray-500">
                {language === "ar"
                  ? `تم قبول الدفع وتم إنشاء حجز برقم ${appointmentId}`
                  : `Payment accepted and reservation #${appointmentId} was created`}
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  onClick={handleCloseModal}
                >
                  {language === "ar" ? "حسنا" : "OK"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Details */}
      <DoctorCardAppointment
        key={doctor.doctor_id}
        id={doctor.doctor_id}
        name={doctor.name}
        specialty={doctor.specialization}
        rating={doctor.rating || 0}
        reviewsCount={doctor.reviewsCount || 0}
        price={doctor.price}
        // @ts-ignore
        location={doctor.city}
        imageUrl={doctor.image}
        day={appointmentDay}
        time={appointmentTime}
        endTime={appointmentEndTime}
        medical_organizations={
          doctor?.medical_organizations || { id: 0, name: "Unknown" }
        }
      />
    </div>
  );
};

export default withAuth(Appointment);