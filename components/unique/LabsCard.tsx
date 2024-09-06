import { ChevronLeft } from 'lucide-react';
import React from 'react';

interface LabsCardProps {
    name: string;
    city: string;
    tests: number;
  }
  
  const LabsCard: React.FC<LabsCardProps> = ({ name, city, tests}) => {
  return (
    <div className="flex justify-start lg:flex-row-reverse flex-row-reverse bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto ">
      <div className="ml-4 h-20 w-20 rounded-full bg-blue-500 flex justify-center lg:flex-row-reverse flex-col items-center overflow-hidden">
        <img
          src="/Images/tests.png"
          alt="hospital logo"
          className="h-10 w-10 object-contain mx-auto"
        />
      </div>
      <div className="flex-1 text-right">
        <h2 className="text-lg font-bold">{name}</h2>
        <p className="text-sm text-gray-500">{city}</p>
        <div className="flex justify-end items-center mt-2 text-gray-700 gap-10">
          <div className='flex gap-10'>
            <p>{tests} تحليل</p>

          </div>
          <div className="flex items-center">
          <span>{city}</span>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Tunisia.svg"
              alt="Libya flag"
              className="h-4 w-4 ml-2 rounded-full cover"
            />

          </div>
        </div>
      </div>
      <div>
        <ChevronLeft/>
      </div>
    </div>
  );
};

export default LabsCard;
