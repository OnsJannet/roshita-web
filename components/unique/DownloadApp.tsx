import React from 'react';

const DownloadApp: React.FC = () => {
  return (
    <div className=" p-6 max-w-[982px] lg:h-[320px] h-auto mx-auto  flex lg:flex-row flex-col rounded-md justify-between items-center  lg:p-20">
      {/* Phone Image Section */}
      <div className=" flex justify-center lg:justify-start mb-6 lg:mb-0 w-[40%]  mt-[14px] ">
        <img
          src="/Images/Phone.png"
          alt="phone application"
          className="lg:w-3/4 w-40 max-w-[600px] lg:max-w-[300px] mt-[14px]"
        />
      </div>

      {/* Text and Button Section */}
      <div className="flex-1  lg:text-left w-[50%]  ">
        <h2 className="text-black text-2xl lg:text-3xl font-bold mb-8 lg:text-end text-center">حمّل تطبيق <span className='text-roshitaDarkBlue'> روشيتا</span></h2>
        <p className="text-black text-base lg:text-xl mb-6 lg:text-end text-center font-bold">
          حجز وارسال استشارات طبية مع توفر أكبر  شبكة بين ذكارة ليبيا وتونس
        </p>
        <div
          className="flex justify-center lg:justify-end space-x-4 my-8  rounded-md" style={{ backgroundSize: '40% 100%' }}
        >
          <img
            src="/logos/applestore.png"
            alt="App Store"
            className="h-12 w-auto cursor-pointer"
          />
          <img
            src="/logos/googleplay.png"
            alt="Google Play"
            className="h-12 w-auto cursor-pointer"
          />
        </div>
        {/* Download Button */}
        <div className='flex lg:justify-end justify-center mt-4'>
        <button className="bg-roshitaBlue font-semibold py-[14px] px-6 rounded-lg mb-6 lg:mb-0 text-white ">
        تحميـــــل        
        </button>
        </div>
        {/* App Store and Google Play Buttons */}

      </div>
    </div>
  );
};

export default DownloadApp;
