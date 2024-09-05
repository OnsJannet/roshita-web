'use client'
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';


const DoctorCard = () => {
  const [isOpen, setIsOpen] = useState(false);


  // Toggle the card when the card itself (except the button) is clicked
  const handleCardClick = () => {
    setIsOpen(!isOpen);
  };

  // Navigate to another page or perform another action when the button is clicked
  const handleBookingClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card from toggling
    // For example, navigate to another page
    window.location.href = "/"
  };

  return (
    <div
      className={`w-full max-w-lg mx-auto my-8 p-6 bg-white rounded-lg shadow-md border  cursor-pointer ${
        isOpen ? '' : ''
      }`}
      onClick={handleCardClick} // Trigger expansion/collapse when the card is clicked
    >
      <div className="flex justify-between items-center gap-2">
        <div>

            <div className='flex justify-between'>
            {isOpen ? <ChevronDown className='text-[#7EDAD2]' /> : <ChevronUp className='text-[#7EFAF2]'/>}
                <h2 className="text-xl font-semibold text-end">د. عبدالله</h2>

            </div>
          <p className="text-xs text-gray-500 text-end">
            استشاري امراض النساء والولادة وجراحاتها والعقم، مستشفى الجامعة الاردنية سابقاً
          </p>
        </div>
        <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 ">
          <img
            src="https://via.placeholder.com/150"
            alt="Doctor"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Collapsible Info */}
      {isOpen && (
        <div className="mt-4 text-gray-600">
          <p>استشاري امراض النساء والولادة وجراحاتها والعقم، مستشفى الجامعة الاردنية سابقاً.</p>
          <ul className="mt-2 list-disc list-inside space-y-2">
            <li>للتخصص في النسائية والتوليد حيث حصل في عام 1987 على درجة الماجستير واليور</li>
            <li>الأردني في إختصاص النسائي</li>
            <li>الأردني في إختصاص النسائي</li>
          </ul>
        </div>
      )}

      {/* Booking Button */}
      <div className="mt-4">
        <button
          onClick={handleBookingClick} // Prevent toggle and navigate to booking page
          className="bg-blue-500 text-white px-4 py-2 rounded-lg  text-center lg:w-[30%] w-full">
          حجز طبي
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
