'use client'
import { useState } from 'react';

const DoctorCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full max-w-lg mx-auto my-8 p-6 bg-white rounded-lg shadow-md border border-blue-200">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">د. عبدالله</h2>
          <p className="text-sm text-gray-500">
            استشاري امراض النساء والولادة وجراحاتها والعقم، مستشفى الجامعة الاردنية سابقاً
          </p>
        </div>
        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
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

      {/* Toggle Button */}
      <div className="mt-4">
        <button
          onClick={handleToggle}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full text-center">
          {isOpen ? 'إغلاق' : 'حجز طبي'}
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
