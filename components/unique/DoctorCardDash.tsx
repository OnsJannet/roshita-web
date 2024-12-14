import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface DoctorCardProps {
  name: string;
  specialty: string;
  hospital: string;
  location: string;
  phone: string;
  imageSrc: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  name,
  specialty,
  hospital,
  location,
  phone,
  imageSrc,
}) => {
  return (
    <div className="bg-white shadow-sm py-4 flex flex-col lg:flex-row-reverse justify-between items-center max-w-[1280px] rounded-[26px] h-auto lg:h-[282px] px-4 lg:px-16 border mx-auto">
      {/* Image and Text Section */}
      <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-8 w-full lg:w-[60%]">
        {/* Image Section */}
        <Avatar className="w-[120px] h-[120px] object-cover">
          <AvatarImage src={imageSrc} alt="doctor img" />
          <AvatarFallback>
  {name
    ? name
        .split(' ') // Split the name by spaces
        .map(word => word.charAt(0).toUpperCase()) // Get the first letter of each word
        .join(' ') // Join the letters with a space
    : "?"}
</AvatarFallback>



        </Avatar>

        {/* Text Section */}
        <div className="flex flex-col gap-4 w-full text-center lg:text-right">
          <h2 className="text-xl font-regular text-gray-400">{name}</h2>
          <h2 className="text-xl font-semibold text-gray-800">{specialty}</h2>
          <h2 className="text-xl font-regular text-gray-400">{hospital}</h2>
        </div>
      </div>

      {/* Location and Phone Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center w-full lg:w-[40%] gap-4 text-center lg:text-left mt-4 lg:mt-0">
        {/* Location Section */}
        <div className="flex flex-col gap-2 w-full items-center lg:items-start">
          <MapPin className="text-blue-500 mx-auto" />
          <p className="text-sm text-gray-600 mx-auto">{location}</p>
        </div>

        {/* Phone Section */}
        <div className="flex flex-col gap-2 w-full items-center lg:items-start">
          <Phone className="text-blue-500 mx-auto" />
          <p className="text-sm text-gray-600 mx-auto">{phone}</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
