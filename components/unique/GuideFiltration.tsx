import React from 'react'

const GuideFiltration = () => {
    return (
        <div
          className=" lg:-mt-[80px] xl:-mt-[40px] mt-[180px] rounded-2xl p-6 max-w-[1280px] mx-auto  relative "
          style={{ zIndex: 9999 }}
        >
            <div className='!bg-white justify-center flex  lg:flex-row-reverse flex-col rounded-lg p-4' style={{ boxShadow: "0 8px 26.6px rgba(0, 0, 0, 0.09)"}}>
                <div className='lg:border-l-gray-200 border-b-gray-200 lg:border-b-transparent lg:border-l border-b p-4 flex justify-center items-center flex-row-reverse lg:w-[25%] w-full cursor-pointer'>
                    <img src="/images/FilterDoc.png" alt='doc' className='h-8 w-8'/>
                    <p className='text-[24px] font-semibold'>الأطباء </p>
                </div>
                <div className='lg:border-l-gray-200 border-b-gray-200 lg:border-l lg:border-b-transparent border-b p-4  flex justify-center items-center flex-row-reverse lg:w-[25%] w-full cursor-pointer'>
                    <img src="/images/FilterHos.png" alt='doc' className='h-8 w-8'/>
                    <p className='text-[24px] font-semibold'>مستشفيات </p>
                </div>
                <div className='lg:border-l-gray-200 border-b-gray-200 lg:border-l  lg:border-b-transparentborder-b p-4  flex justify-center items-center flex-row-reverse lg:w-[25%] w-full cursor-pointer'>
                    <img src="/images/FilterPha.png" alt='doc' className='h-8 w-8'/>
                    <p className='text-[24px] font-semibold'>صيدلية </p>
                </div>
                <div className=' p-4  flex justify-center items-center flex-row-reverse lg:border-b-transparent lg:w-[25%] w-full cursor-pointer'>
                    <img src="/images/FilterLab.png" alt='doc' className='h-8 w-8'/>
                    <p className='text-[24px] font-semibold'>مختبرات </p>
                </div>
            </div>
            <div className='bg-roshitaBlue justify-center flex  flex-row-reverse rounded-lg p-4'>

            </div>
        </div>
      );
    };

export default GuideFiltration