import React from "react";
import { Button } from "../ui/button"; // Assuming you have a button component
import { Banknote, LocateIcon, MapPin, Star, StarHalf } from "lucide-react";

type DoctorCardInsideProps = {
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  price: string;
  location: string;
  imageUrl: string;
  id: number;
};

const DoctorCardInside: React.FC<DoctorCardInsideProps> = ({
  name,
  specialty,
  rating,
  reviewsCount,
  price,
  location,
  imageUrl,
  id,
}) => {
  return (
    <div className="flex flex-col md:flex-row p-4 bg-white  rounded-xl  mx-auto lg:p-10">
      {/* Left Section: Rating and Button */}
      <div className="flex lg:flex-col  flex-row justify-between p-4 ">
        <div className="flex items-center mb-2 ">
          <span className="text-gray-500 text-sm ml-2">({reviewsCount})</span>
          {/* Star Rating */}
          <div className="flex text-yellow-500">
            {Array.from({ length: 5 }, (_, i) => {
              // Check if it's a full star or a half star
              if (i + 1 <= rating) {
                return <Star key={i} className="h-5 w-5 fill-yellow-500" />;
              } else if (i + 0.5 <= rating) {
                return <StarHalf key={i} className="h-5 w-5 fill-yellow-500" />;
              } else {
                return <Star key={i} className="h-5 w-5 text-gray-300" />;
              }
            })}
          </div>
        </div>
      </div>

      {/* Right Section: Doctor Info */}
      <div className="flex flex-1 justify-end gap-4 items-center p-4">
        {/* Doctor's Details */}
        <div className="flex flex-col items-end">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{name}</h1>
          <p className="text-sm text-gray-500 mb-2 text-end">{specialty}</p>
          <div className="flex items-center text-sm text-gray-600 mb-1 mt-2 gap-2">
            <span>سعر الكشف: {price}</span>
            <Banknote className="text-roshitaDarkBlue" />
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-1 mt-2 gap-2">
            <p className="text-sm text-gray-500">{location}</p>
            <MapPin className="text-roshitaDarkBlue" />
          </div>
        </div>

        {/* Doctor's Image */}
        <div className="ml-4 h-40 w-40 rounded-full bg-roshitaBlue flex justify-center items-center overflow-hidden">
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

export default DoctorCardInside;