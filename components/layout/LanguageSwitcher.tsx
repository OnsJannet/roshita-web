import { useEffect, useState } from 'react';

const LanguageSwitcher: React.FC = () => {
  const [language, setLanguage] = useState<string>('ar');

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = event.target.value;
    console.log(lang);

    // Set language in localStorage
    localStorage.setItem('language', lang);

    // Reload the page to reflect the language change
    window.location.reload();
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      // If language exists in localStorage, use it
      setLanguage(storedLanguage);
    } else {
      // Otherwise, default to 'ar' (Arabic)
      setLanguage('ar');
    }
  }, []);

  return (
    <div className="gap-2">
      <select onChange={changeLanguage} className="border p-2 rounded" value={language}>
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
