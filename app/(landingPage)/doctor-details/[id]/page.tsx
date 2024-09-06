// Import necessary libraries and components
"use client";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import DoctorCardInside from "@/components/unique/DoctorCardInside";
import { doctors } from "@/constant";
import { Clock } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

const DoctorDetailsPage = () => {
  const params = useParams();
  const id = parseInt(
    Array.isArray(params?.id) ? params.id[0] : params?.id ?? "",
    10
  );

  // Find the doctor by ID
  const doctor = doctors.find((doc) => doc.doctor_id === id);

  if (!doctor) {
    return <div>Doctor not found</div>;
  }

  // Function to get day of the week in Arabic
  const getDayOfWeekInArabic = (dateString: string) => {
    const daysOfWeek = [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
  };

  // Function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Function to format the time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };


   // Function to handle appointment booking
   const handleBooking = (dateString: string, timeSting: string) => {
    const appointmentDay = dateString
    const appointmentTime = timeSting

    // Save appointment day and time to localStorage
    localStorage.setItem("appointmentDay", appointmentDay);
    localStorage.setItem("appointmentTime", appointmentTime);

    // Navigate to the appointment page
    window.location.href = `/appointment/${doctor.doctor_id}`;
  };

  return (
    <div className="container mx-auto p-4 max-w-[1280px]">
      {/* Doctor Details */}

      <DoctorCardInside
        key={doctor.doctor_id}
        id={doctor.doctor_id}
        name={doctor.name}
        specialty={doctor.specialty}
        rating={doctor.rating}
        reviewsCount={doctor.reviewsCount}
        price={doctor.price}
        location={doctor.location}
        imageUrl={doctor.imageUrl}
      />

      {/* Appointments Carousel */}
      <div className="max-w-[1280px] flex lg:flex-row-reverse gap-10 flex-col">


      <div className="bg-white border-2 border-gray-200 rounded-lg lg:w-1/2 w-[90%] mx-auto mt-10 mb-10 text-end p-8">
      <h2 className="text-xl font-semibold mb-4 text-roshitaBlue">أوقات المتاحة</h2>
        <Carousel>
          <CarouselPrevious className="bg-gray-300" />
          <CarouselNext className="bg-gray-300" />
          <CarouselContent>
            {doctor.appointment_dates.map((date, index) => (
              <CarouselItem
                key={index}
                className="p-4 rounded-md md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card className="rounded">
                    <CardTitle className="p-4 bg-roshitaBlue rounded text-white text-center">
                      {getDayOfWeekInArabic(date)}
                    </CardTitle>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <span className="text-2xl font-semibold">
                        {formatDate(date)}
                      </span>
                      <span className="text-xl font-medium">
                        {formatTime(date)}
                      </span>
                    </CardContent>
                    <CardFooter onClick={() => handleBooking(formatDate(date), formatTime(date))} className="p-4 bg-roshitaBlue rounded text-white !text-center font-bold flex justify-center">
                      أحجــز 
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className=" bg-white border-2 border-gray-200 rounded-lg lg:w-1/2 w-[90%] mx-auto mt-10 mb-10 text-end p-8">
        <h2 className="text-xl font-semibold mb-4 text-roshitaBlue">
          أوقات العمل
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between lg:flex-row-reverse border-b border-dotted border-gray-300 pb-2">
            <div className="text-gray-700 font-semibold text-2xl">الاثنين</div>
            <div className="text-gray-700 flex gap-2 flex-row-reverse items-center">
              <Clock className="h-4 w-4 text-roshitaBlue" />
              09:00 - 18:00
            </div>
          </div>
          <div className="flex justify-between lg:flex-row-reverse border-b border-dotted border-gray-300 pb-2">
            <div className="text-gray-700 font-semibold text-2xl">الثلاثاء</div>
            <div className="text-gray-700 flex gap-2 flex-row-reverse items-center">
              <Clock className="h-4 w-4 text-roshitaBlue" />
              09:00 - 18:00
            </div>
          </div>
          <div className="flex justify-between lg:flex-row-reverse border-b border-dotted border-gray-300 pb-2">
            <div className="text-gray-700 font-semibold text-2xl">الأربعاء</div>
            <div className="text-gray-700 flex gap-2 flex-row-reverse items-center">
              <Clock className="h-4 w-4 text-roshitaBlue" />
              09:00 - 18:00
            </div>
          </div>
          <div className="flex justify-between lg:flex-row-reverse border-b border-dotted border-gray-300 pb-2">
            <div className="text-gray-700 font-semibold text-2xl">الخميس</div>
            <div className="text-gray-700 flex gap-2 flex-row-reverse items-center">
              <Clock className="h-4 w-4 text-roshitaBlue" />
              09:00 - 18:00
            </div>
          </div>
          <div className="flex justify-between lg:flex-row-reverse border-b border-dotted border-gray-300 pb-2">
            <div className="text-gray-700 font-semibold text-2xl">الجمعة</div>
            <div className="text-gray-700 flex gap-2 flex-row-reverse items-center">
              <Clock className="h-4 w-4 text-roshitaBlue" />
              09:00 - 18:00
            </div>
          </div>
          <div className="flex justify-between lg:flex-row-reverse border-b border-dotted border-gray-300 pb-2">
            <div className="text-gray-700 font-semibold text-2xl">السبت</div>
            <div className="text-gray-700 flex gap-2 flex-row-reverse items-center">
              <Clock className="h-4 w-4 text-roshitaBlue" />
              09:00 - 18:00
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default DoctorDetailsPage;
