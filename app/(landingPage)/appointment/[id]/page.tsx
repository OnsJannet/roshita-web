"use client";
import withAuth from "@/hoc/withAuth";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doctors } from "@/constant";
import DoctorCardAppointment from "@/components/unique/DoctorCardAppointment";

interface Doctor {
  doctor_id: number;
  name: string;
  specialization: string;
  rating: number | null;
  reviewsCount: number;
  price: string;
  location: string;
  imageUrl: string;
  medical_organizations: { id: number; name: string };
}

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
  const [appointmentDay, setAppointmentDay] = useState<string>("");
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Parse doctor id from URL params
  const id = parseInt(
    Array.isArray(params?.id) ? params.id[0] : params?.id ?? "",
    10
  );

  useEffect(() => {
    // Fetch doctors data from API
    const fetchDoctor = async () => {
      try {
        const response = await fetch("/api/userDoctor/getDoctor");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch doctors");
        }

        // Find the doctor by ID
        const selectedDoctor = data.data.find(
          (doc: Doctor) => doc.doctor_id === id
        );
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
    setAppointmentDay(day);
    setAppointmentTime(time);
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!doctor) {
    return <div>Doctor not found</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-[1280px]">
      {/* Doctor Details */}
      <DoctorCardAppointment
        key={doctor.doctor_id}
        id={doctor.doctor_id}
        name={doctor.name}
        specialty={doctor.specialization}
        rating={doctor.rating || 0}
        reviewsCount={doctor.reviewsCount || 0}
        price={doctor.price}
        location={doctor.location}
        imageUrl={doctor.imageUrl}
        day={appointmentDay}
        time={appointmentTime}
        medical_organizations={
          doctor?.medical_organizations || { id: 0, name: "Unknown" }
        }
      />
    </div>
  );
};

export default withAuth(Appointment);
