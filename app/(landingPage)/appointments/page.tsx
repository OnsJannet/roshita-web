'use client'
import { LogOut, MonitorCheck, Settings, UserRound } from 'lucide-react'
import React from 'react'

const Page = () => {

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login';
  };

  return (
    <div className="flex justify-center flex-col p-8 bg-[#fafafa]">
      <div>
        <div className="flex justify-start gap-10 flex-row-reverse mx-auto">
          <div className="flex lg:w-[20%] w-[40%] justify-start gap-10 mx-auto p-4 bg-white rounded flex-col">
            <div className="mx-auto flex justify-center">
            <div className="relative lg:w-60 lg:h-60 xl:w-20 xl:h-20">
            <div className="w-full h-full rounded-full bg-[#f1f1f1] flex items-center justify-center overflow-hidden">
              <UserRound className="w-1/2 h-1/2 text-roshitaBlue" />
            </div>
            </div>
            </div>
            <div>
              <div className="flex p-2 bg-[#F1F1F1] text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer">
                <div className="rounded-full bg-white h-6 w-6 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-roshitaDarkBlue" />
                </div>
                <p>الإعدادت</p>
              </div>
              <div className="flex p-2 bg-[#F1F1F1] text-end flex-row-reverse gap-2 items-center mb-4 rounded-lg cursor-pointer">
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
          <div className="flex gap-10 text-end flex-col w-[80%] mx-auto">
          <div className='flex justify-center bg-white w-[80%] mx-auto p-8 rounded'>
            <div className='p-4 text-center border-l-gray-300  w-1/2 '>التالي</div>
            <div className='p-4 text-center border-l-2 border-l-gray-300  w-1/2 '>السابق</div>

          </div>


          </div>
        </div>
      </div>
    </div>
  )
}

export default Page