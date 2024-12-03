import React from 'react';

const StatCard = () => {
  return (
    <div className="w-full max-w-[1280px] bg-dashboard-gradient rounded-[26px] h-auto lg:h-[282px] px-4 lg:px-16 py-8 lg:py-0 flex flex-col lg:flex-row justify-between items-center mx-auto">
      {/* Left Image Section - Hidden on mobile */}
      <div
        className="lg:w-[40%] w-full h-[200px] lg:h-full bg-cover bg-left hidden lg:block"
        style={{ backgroundImage: "url('/Images/Group-30.png')" }}
      ></div>

      {/* Right Stats Section */}
      <div className="w-full lg:w-[60%] flex flex-col lg:flex-row justify-center gap-8 lg:gap-16 px-4 lg:px-8 text-center lg:text-left">
        {/* Stat 1 */}
        <div className="text-white">
          <div className="lg:text-[48px] text-[30px] font-bold leading-none">120+</div>
          <div className="mt-2 text-sm lg:text-base">تخصص</div>
        </div>

        {/* Stat 2 */}
        <div className="text-white">
          <div className="lg:text-[48px] text-[30px] font-bold leading-none">78+</div>
          <div className="mt-2 text-sm lg:text-base">عدد المرضي</div>
        </div>

        {/* Stat 3 */}
        <div className="text-white">
          <div className="lg:text-[48px] text-[30px] font-bold leading-none">16789</div>
          <div className="mt-2 text-sm lg:text-base">عدد الدكاترة</div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
