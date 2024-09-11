import React from 'react'

const CurrentYear = new Date().getFullYear();
const Footer = () => {
  return (
    <footer className='bg-[#F2F7FF] p-4'>
        <div className=' flex flex-col justify-center max-w-[1280px] mx-auto py-8'>
            <img src='/logos/ShortLogo.png' alt='short logo' className='w-20 h-20 mx-auto'/>
            <h1 className='mx-auto mt-6 lg:text-[18px] text-[16px] font-[600]'>روشــــــــيتــــــا </h1>
            <p className="font-[500] lg:text-[16px] text-[12px] mx-auto">
              صحــة أفضل{" "}
              <span className="text-roshitaGreen">تواصـــــل أســـرع</span>{" "}
            </p>
            <p className='mx-auto mt-6'>{CurrentYear} الحقوق محفوظة لمنصة روشيتا©  </p>
            <div className='mt-6 flex gap-4 justify-center mx-auto'>
                <img src='/logos/applestore.png' alt='short logo' className='w-[200px] h-14 mx-auto'/>
                <img src='/logos/googleplay.png' alt='short logo' className='w-[200px] h-14 mx-auto'/>
            </div>
            <div className='flex justify-center w-[20%] mx-auto mt-4 gap-4'>
                <img src='/logos/facebooklogo.png' alt='short logo' className='w-[15px] h-[25px] cursor-pointer'/>
                <img src='/logos/iglogo.png' alt='short logo' className='w-6 h-6 cursor-pointer'/>
                <img src='/logos/whatsapplogo.png' alt='short logo' className='w-6 h-6 cursor-pointer'/>
                <img src='/logos/linkedinlogo.png' alt='short logo' className='w-6 h-6 cursor-pointer'/>
                <img src='/logos/messengerlogo.png' alt='short logo' className='w-6 h-6 cursor-pointer'/>
                <img src='/logos/tiktoklogo.png' alt='short logo' className='w-6 h-6 cursor-pointer'/>
            </div>
        </div>
    </footer>
  )
}

export default Footer