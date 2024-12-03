import { MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

interface LabCardProps {
  labName: string;
  location: string;
  phone: string;
  logoSrc: string;
}

const LabCard: React.FC<LabCardProps> = ({
  labName,
  location,
  phone,
  logoSrc,
}) => {
  return (
    <div className="bg-white shadow-sm py-4 flex flex-col lg:flex-row-reverse justify-between items-center max-w-[1280px] rounded-[26px] h-auto lg:h-[282px] px-4 lg:px-16 border mx-auto">
      
      {/* Logo and Lab Name Section */}
      <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-10 w-full">
        {/* Logo Section */}
        <Image
          src={logoSrc}
          alt="Lab logo"
          width={100}
          height={100}
          className="rounded-full"
        />
        {/* Lab Name Section */}
        <div className="flex flex-col items-center lg:items-end w-full text-center lg:text-right">
          <h2 className="text-xl font-regular text-gray-400">اسم المعمل</h2>
          <h2 className="text-xl font-semibold text-gray-800">{labName}</h2>
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

export default LabCard;
