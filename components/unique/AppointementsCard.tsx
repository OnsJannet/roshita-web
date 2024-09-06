import { Banknote, Calendar, Clock, Trash } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';

type DoctorCardProps = {
  name: string;
  specialty: string;
  price: string;
  location: string;
  imageUrl: string;
  day: string;
  time: string;
  status: string;
};

const AppointementsCard: React.FC<DoctorCardProps> = ({
  name,
  specialty,
  price,
  location,
  imageUrl,
  day,
  time,
  status: initialStatus, // renamed to avoid conflict with local state
}) => {
  const [status, setStatus] = useState(initialStatus); // Local state for status

  // Function to handle the cancellation
  const handleCancel = () => {
    // Retrieve appointments from localStorage
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');

    // Find the appointment and update its status to 'canceled'
    const updatedAppointments = appointments.map((appointment: any) => {
      if (appointment.doctorName === name && appointment.day === day) {
        return { ...appointment, status: 'canceled' };
      }
      return appointment;
    });

    // Save the updated appointments back to localStorage
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    // Update local state to trigger re-render
    setStatus('canceled');

    // Confirmation alert
    alert('تم إلغاء الموعد');
  };

  return (
    <div className="flex flex-col md:flex-row p-4 bg-white shadow-lg rounded-xl w-full max-w-[80%] lg:max-w-[80%] mx-auto">
      {/* Right Section: Doctor Info */}
      <div className="flex flex-1 justify-end gap-4 items-center p-4 lg:flex-row flex-col-reverse">
        {/* Doctor's Details */}
        <div className="flex flex-col items-end">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{name}</h1>
          <p className="text-sm text-gray-500 mb-2 text-end">{specialty}</p>
          <div className="bg-gray-100 lg:p-4 p-2 flex lg:flex-row flex-col w-full justify-between lg:gap-20 gap-4 rounded">
            <div className="flex items-center text-sm text-gray-600 mb-1 mt-2 flex-row-reverse gap-2">
              <Clock className="text-roshitaDarkBlue" />
              <span>الوقت: {time}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-1 mt-2 gap-2 flex-row-reverse">

              <Calendar className="text-roshitaDarkBlue" />
              <span>اليوم: {day}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-1 mt-2 gap-2">
              <span>سعر الكشف: {price}</span>
              <Banknote className="text-roshitaDarkBlue" />
            </div>
          </div>

          {/* Cancel Button or Canceled Message */}
          <div className="w-full flex lg:justify-start justify-center mt-4">
            {status === 'canceled' ? (
              <span className="text-red-500 text-lg">تم الإلغاء</span>
            ) : (
              <Button
                className="bg-transparent border-transparent text-black text-lg shadow-none hover:bg-gray-50"
                onClick={handleCancel}
              >
                حذف <Trash className="text-red-500 w-6 h-6 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Doctor's Image */}
        <div className="ml-4 h-40 w-40 rounded-full bg-roshitaBlue flex justify-center items-center overflow-hidden">
          <img src={imageUrl} alt={name} className="h-full w-full object-contain" />
        </div>
      </div>
    </div>
  );
};

export default AppointementsCard;
