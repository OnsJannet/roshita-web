import React from 'react'
import DoctorCarousel from './DoctorCarousel'

const BestDoctors = () => {
  return (
    <div className="max-w-[1280px] mx-auto ">
              <h2 className="text-center text-roshitaDarkBlue text-4xl font-bold mb-20 ">
              أفضل الأطباء تقييما{" "}
      </h2>
      <DoctorCarousel/>
    </div>
  )
}

export default BestDoctors