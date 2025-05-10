import { useEffect, useState } from 'react';
import Image from 'next/image';

const LanguageSwitcher: React.FC = () => {
  const [language, setLanguage] = useState<string>('ar');
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lang: string) => {
    localStorage.setItem('language', lang);
    window.location.reload();
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    } else {
      setLanguage('ar');
    }
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <Image
          src={`/Images/${language === 'ar' ? 'lb-flag' : 'en-flag'}.png`}
          alt={language === 'ar' ? 'Arabic' : 'English'}
          width={24}
          height={24}
          className="rounded-sm object-cover"
        />
        <span className="text-sm font-medium">
          {language === 'ar' ? 'العربية' : 'English'}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-50">
          <button
            onClick={() => {
              changeLanguage('ar');
              setIsOpen(false);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 transition-colors"
          >
            <Image
              src="/Images/lb-flag.png"
              alt="Arabic"
              width={24}
              height={24}
              className="rounded-sm object-cover"
            />
            <span className="text-sm">العربية</span>
          </button>
          <button
            onClick={() => {
              changeLanguage('en');
              setIsOpen(false);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 transition-colors"
          >
            <Image
              src="/Images/en-flag.png"
              alt="English"
              width={24}
              height={24}
              className="rounded-sm object-cover"
            />
            <span className="text-sm">English</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
