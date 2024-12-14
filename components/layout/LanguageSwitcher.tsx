import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = event.target.value;
    console.log(lang);
    
    // Set language in localStorage
    localStorage.setItem('language', lang);
    
    // Change the language in i18n
    i18n.changeLanguage(lang);
  };

  // Sync language with localStorage on initial load
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    } else {
      i18n.changeLanguage('en'); // Default language
    }
  }, [i18n]);

  return (
    <div className="gap-2">
      <select onChange={changeLanguage} className="border p-2 rounded" value={i18n.language}>
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
