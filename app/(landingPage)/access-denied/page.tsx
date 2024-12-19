'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Language = "ar" | "en" | "fr"; // Added French language option

const AccessDeniedPage = () => {
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [browserAgent, setBrowserAgent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // State to track loading
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("ar");

  // Sync language state with localStorage
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage as Language); // Cast stored value to 'Language'
    } else {
      setLanguage("ar"); // Default to 'ar' (Arabic) if no language is set
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "language") {
        setLanguage((event.newValue as Language) || "ar"); // Cast newValue to 'Language'
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Fetching user's IP address, country, and browser agent
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        setIpAddress(ipData.ip);

        const locationResponse = await fetch(`http://ip-api.com/json/${ipData.ip}`);
        const locationData = await locationResponse.json();
        setCountry(locationData.country);

        setBrowserAgent(navigator.userAgent);
      } catch (error) {
        console.error("Error fetching user information:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchUserInfo();
  }, []);

  // Function to navigate to the login page
  const goBack = () => {
    router.push("/dashboard/Auth/login");
  };

  // Texts for English and French
  const texts = {
    en: {
      title: "You shouldn't be here",
      description: "You do not have permission to access this page.",
      info: "If you believe this is an error, please contact the administrator.",
      goBackButton: "Go Back",
    },
    fr: {
      title: "Vous ne devriez pas être ici",
      description: "Vous n'avez pas l'autorisation d'accéder à cette page.",
      info: "Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur.",
      goBackButton: "Retour",
    },
    ar: {
      title: "أنت لا ينبغي أن تكون هنا",
      description: "ليس لديك إذن للوصول إلى هذه الصفحة.",
      info: "إذا كنت تعتقد أن هذه خطأ، يرجى الاتصال بالمسؤول.",
      goBackButton: "عودة",
    },
  };

  // Get text based on current language
  const currentText = texts[language];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg max-w-md w-full">
        {/* Conditionally render the loading card */}
        {loading ? (
          <div className="w-full p-4  animate-pulse rounded-lg">
            <div className="w-2/3 h-8 bg-gray-200 rounded mb-4 mx-auto"></div> {/* Gray bar for title */}
            <div className="w-2/3 h-4 bg-gray-200 rounded mb-4 mx-auto"></div> {/* Gray bar for description */}
            <div className="w-1/2 h-4 bg-gray-200 rounded mb-4 mx-auto"></div> {/* Gray bar for info */}
            <div className="w-1/4 h-10 bg-gray-200 rounded mx-auto"></div> {/* Gray button */}
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{currentText.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{currentText.description}</p>
            <p className="text-sm text-gray-600 mb-2">{currentText.info}</p>

            <button
              onClick={goBack}
              className="mt-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
            >
              {currentText.goBackButton}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AccessDeniedPage;
