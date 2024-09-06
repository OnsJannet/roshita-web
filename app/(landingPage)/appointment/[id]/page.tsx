'use client';
import withAuth from '@/hoc/withAuth';
import React, { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import { doctors } from '@/constant';
import DoctorCardAppointment from '@/components/unique/DoctorCardAppointment';

const Appointment = () => {
  const params = useParams();
  const [appointmentDay, setAppointmentDay] = useState<string>("");
  const [appointmentTime, setAppointmentTime] = useState<string>("");

  // Parse doctor id from URL params
  const id = parseInt(
    Array.isArray(params?.id) ? params.id[0] : params?.id ?? "",
    10
  );

  // Find the doctor by ID
  const doctor = doctors.find((doc) => doc.doctor_id === id);

  useEffect(() => {
    // Safely fetch from localStorage and default to an empty string if null
    const day = localStorage.getItem('appointmentDay') || "";
    const time = localStorage.getItem('appointmentTime') || "";
    setAppointmentDay(day);
    setAppointmentTime(time);
  }, []);

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
        specialty={doctor.specialty}
        rating={doctor.rating}
        reviewsCount={doctor.reviewsCount}
        price={doctor.price}
        location={doctor.location}
        imageUrl={doctor.imageUrl}
        day={appointmentDay}
        time={appointmentTime}
      />
    </div>
  );
};

export default withAuth(Appointment);
