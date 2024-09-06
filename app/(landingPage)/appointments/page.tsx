'use client';
import React, { useEffect, useState } from 'react';
import { LogOut, MonitorCheck, Settings, UserRound } from 'lucide-react';
import AppointementsCard from '@/components/unique/AppointementsCard'; // Adjust the import path as needed
import { useRouter } from 'next/navigation';

const Page = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<'previous' | 'next'>('next'); // New state for filtering
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    // Fetch the appointments from localStorage
    const storedAppointments = localStorage.getItem('appointments');
    if (storedAppointments) {
      const parsedAppointments = JSON.parse(storedAppointments);
      setAppointments(parsedAppointments);
      filterAppointments(parsedAppointments, 'next'); // Set default to show next appointments
    }
  }, []);

  const filterAppointments = (appointments: any[], type: 'previous' | 'next') => {
    const today = new Date();

    if (type === 'next') {
      // Show appointments where day > today
      const nextAppointments = appointments.filter(appointment => new Date(appointment.day) > today);
      setFilteredAppointments(nextAppointments);
    } else {
      // Show appointments where day <= today
      const previousAppointments = appointments.filter(appointment => new Date(appointment.day) <= today);
      setFilteredAppointments(previousAppointments);
    }
  };

  const handleFilterChange = (type: 'previous' | 'next') => {
    setFilterType(type);
    filterAppointments(appointments, type);
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login';
  };

  const handleSettingsClick = () => {
    router.push('/profile');
  };

  const handleAppointmentsClick = () => {
    router.push('/appointments');
  };

  const handleSettingsPasswordClick = () => {
    router.push('/password-change');
  };

  return (
    <div className="flex justify-center flex-col p-8 bg-[#fafafa]">
      <div>
        <div className="flex lg:flex-row-reverse flex-col justify-start gap-10 mx-auto">
          <div className="flex lg:w-[20%] w-[100%] justify-start gap-10 mx-auto p-4 bg-white rounded flex-col">
            <div className="mx-auto flex justify-center">
              <div className="relative lg:w-60 lg:h-60 xl:w-20 xl:h-20 h-40 w-40">
                <div className="w-full h-full rounded-full bg-[#f1f1f1] flex items-center justify-center overflow-hidden">
                  <UserRound className="w-1/2 h-1/2 text-roshitaBlue" />
                </div>
              </div>
            </div>
            <div>
              <div
                onClick={handleSettingsClick}
                className="flex p-2 bg-[#F1F1F1] text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>الإعدادت</p>
              </div>
              <div
                onClick={handleSettingsPasswordClick}
                className="flex p-2 bg-[#F1F1F1] text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>تغير كلمة المرور</p>
              </div>
              <div
                onClick={handleAppointmentsClick}
                className="flex p-2 bg-[#F1F1F1] text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer"
              >
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <MonitorCheck className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>مواعيدي</p>
              </div>
              <div onClick={handleLogout} className="flex p-2 bg-[#F1F1F1] text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer">
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <LogOut className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>تسجيل الخروج</p>
              </div>
            </div>
          </div>
          <div className="flex gap-10 text-end flex-col lg:w-[80%] w-full mx-auto">
            <div className="flex justify-center bg-white w-[80%] mx-auto p-8 rounded">
              <div
                className={`p-4 text-center border-l-gray-300 w-1/2 cursor-pointer ${filterType === 'next' ? 'font-bold' : ''}`}
                onClick={() => handleFilterChange('next')}
              >
                التالي
              </div>
              <div
                className={`p-4 text-center border-l-2 border-l-gray-300 w-1/2 cursor-pointer ${filterType === 'previous' ? 'font-bold' : ''}`}
                onClick={() => handleFilterChange('previous')}
              >
                السابق
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment, index) => (
                  <AppointementsCard
                    key={index}
                    name={appointment.doctorName}
                    specialty={appointment.specialty}
                    price={appointment.price}
                    location=""
                    imageUrl={appointment.imageUrl}
                    day={appointment.day}
                    time={appointment.time}
                    status={appointment?.status || ''}
                  />
                ))
              ) : (
                <div className="text-center text-gray-500">لا توجد مواعيد لعرضها</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
