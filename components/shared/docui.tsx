import React from 'react';

const DoctorProfile = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Dr. Charla Romero, APRN, DNP, RN</h1>
        <p className="text-gray-600">Family Nurse Practitioner</p>
        <div className="mt-2">
          <span className="text-yellow-400">★ ★ ★ ★ ★</span>
          <span className="text-gray-600 ml-2">4.90 - 203 reviews</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-600">- Video visits</p>
        <p className="text-gray-600">- In-network insurance only. See if they're in network</p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-600">New patient appointments - Highly recommended - Excellent wait time</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-center">Appointment Schedule</h2>
        <div className="grid grid-cols-7 gap-4 mt-4 text-center">
          {['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'].map((day, index) => (
            <div key={index}>
              <p className="font-semibold">{day}</p>
              <p className="text-gray-600">Jan {16 + index}</p>
              <p className="text-gray-600">
                {index === 0 ? <span className="font-bold">1</span> : index === 3 ? <span className="font-bold">12</span> : index === 4 ? <span className="font-bold">4</span> : index === 5 ? <span className="font-bold">4</span> : index === 6 ? <span className="font-bold">5</span> : 'No'} appts
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4 mt-4 text-center">
          {['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'].map((day, index) => (
            <div key={index}>
              <p className="font-semibold">{day}</p>
              <p className="text-gray-600">Jan {23 + index}</p>
              <p className="text-gray-600">
                {index === 0 ? <span className="font-bold">17</span> : index === 1 ? <span className="font-bold">2</span> : index === 3 ? <span className="font-bold">10</span> : index === 4 ? <span className="font-bold">1</span> : index === 5 ? <span className="font-bold">5</span> : index === 6 ? <span className="font-bold">5</span> : 'No'} appts
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;