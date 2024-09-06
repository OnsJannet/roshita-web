import React from "react";
import { Button } from "../ui/button";
import { Banknote, Calendar, MapPin } from "lucide-react";
import { AcceptAppointment } from "../shared/accpetAppoitment"; // Ensure the path is correct for this import

type DoctorCardAppointmentProps = {
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  price: string;
  location: string;
  imageUrl: string;
  id: number;
  day: string;
  time: string;
};

const DoctorCardAppointment: React.FC<DoctorCardAppointmentProps> = ({
  name,
  specialty,
  price,
  location,
  imageUrl,
  day,
  time,
}) => {
  return (
    <div className="shadow-lg py-10 mt-2 max-w-[1280px] rounded-2xl">
      <h2 className="text-center font-semibold lg:text-4xl text-2xl">
        تــأكيد الحجز
      </h2>
      {/* Right Section: Doctor Info */}
      <div className="flex flex-1 justify-end gap-4  lg:px-40 lg:py-10 p-4">
        {/* Doctor's Details */}
        <div className="flex flex-col items-end">
          <h1 className="lg:text-2xl text-xl font-bold text-gray-800 mb-1">
            {name}
          </h1>
          <p className="text-sm text-gray-500 mb-2 text-end">{specialty}</p>
          <div className="flex items-center text-sm text-gray-600 mb-1 mt-2 gap-2">
            <span>سعر الكشف: {price}</span>
            <Banknote className="text-roshitaDarkBlue" />
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-1 mt-2 gap-2">
            <p className="text-sm text-gray-500">{location}</p>
            <MapPin className="text-roshitaDarkBlue" />
          </div>
          <h1 className="lg:text-2xl text-xl font-bold text-gray-800 mb-1 mt-4 flex gap-2 items-center">
            اليـــــوم <Calendar className="text-roshitaDarkBlue w-6 h-6" />
          </h1>
          <p>{time} {day}</p>

          {/* Accept Appointment Button */}
          <AcceptAppointment
            name={name}
            specialty={specialty}
            rating={0} // If rating and reviews are not used, you can remove them from AcceptAppointement props
            reviewsCount={0}
            price={price}
            location={location}
            imageUrl={imageUrl}
            id={1} // Adjust accordingly
            day={day}
            time={time}
          />
        </div>

        {/* Doctor's Image */}
        <div className="ml-4 h-[120px] w-[120px] rounded-full bg-roshitaBlue flex justify-center items-center overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorCardAppointment;
