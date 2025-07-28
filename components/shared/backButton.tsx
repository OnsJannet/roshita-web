// components/BackButton.tsx
import { ArrowLeft, CircleChevronLeft, CircleChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface BackButtonProps {
  lang: 'en' | 'ar';
}

const BackButton: React.FC<BackButtonProps> = ({ lang }) => {
  const router = useRouter();
  
  const isRTL = lang === 'ar';
  const buttonText = isRTL ? 'العودة إلى الصفحة السابقة' : 'Return to previous page';

  const handleClick = () => {
    router.back();
  };

  return (
    <div className={`flex ${lang === "ar" ? 'justify-end' : 'justify-start'}`}>
<button
  onClick={handleClick}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg  dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200 mb-2 ${
    isRTL ? 'flex-row' : 'flex-row-reverse'
  }`}
  dir={isRTL ? 'rtl' : 'ltr'}
>
  {!isRTL ? (
    <CircleChevronLeft className="w-6 h-6 text-[#1588C8]" />
  ) : (
    <CircleChevronRight className="w-6 h-6 text-[#1588C8]" />
  )}
  <span>{buttonText}</span>
</button>
    </div>
  );
};

export default BackButton;