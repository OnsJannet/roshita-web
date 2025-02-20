import React, { useState, useEffect } from "react";

// Define the type for the doctor data
interface Doctor {
  name: {
    ar: string;
    en: string;
  };
  title: {
    ar: string;
    en: string;
  };
  specialties: {
    ar: string[];
    en: string[];
  };
  image: string;
}

// Sample doctor data
const doctors: Doctor[] = [
  {
    name: {
      ar: "د. عبدالله",
      en: "Dr. Abdallah",
    },
    title: {
      ar: "استشاري امراض النساء والولادة وجراحتها والعقم، مستشفى الجامعة الأردنية سابقا",
      en: "Consultant in Obstetrics and Gynecology, former at Jordan University Hospital",
    },
    specialties: {
      ar: [
        "استشاري امراض النساء والولادة وجراحتها والعقم، مستشفى الجامعة الأردنية سابقا.",
        "لتخصص في النسائية والتوليد حيث حصل في عام 1987 على درجة الماجستير والبورد الأردني في اختصاص النسائي",
        "لتخصص في النسائية والتوليد حيث حصل في عام 1987 على درجة الماجستير والبورد الأردني في اختصاص النسائي",
      ],
      en: [
        "Consultant in Obstetrics and Gynecology, former at Jordan University Hospital.",
        "Specialized in Obstetrics and Gynecology, obtained a Master's degree and Jordanian Board in 1987.",
        "Specialized in Obstetrics and Gynecology, obtained a Master's degree and Jordanian Board in 1987.",
      ],
    },
    image: "/Images/Doctor-abdallah.png",
  },
  {
    name: {
      ar: "د. عبدالله",
      en: "Dr. Abdallah",
    },
    title: {
      ar: "استشاري امراض النساء والولادة وجراحتها والعقم، مستشفى الجامعة الأردنية سابقا",
      en: "Consultant in Obstetrics and Gynecology, former at Jordan University Hospital",
    },
    specialties: {
      ar: [
        "استشاري امراض النساء والولادة وجراحتها والعقم، مستشفى الجامعة الأردنية سابقا.",
        "لتخصص في النسائية والتوليد حيث حصل في عام 1987 على درجة الماجستير والبورد الأردني في اختصاص النسائي",
        "لتخصص في النسائية والتوليد حيث حصل في عام 1987 على درجة الماجستير والبورد الأردني في اختصاص النسائي",
      ],
      en: [
        "Consultant in Obstetrics and Gynecology, former at Jordan University Hospital.",
        "Specialized in Obstetrics and Gynecology, obtained a Master's degree and Jordanian Board in 1987.",
        "Specialized in Obstetrics and Gynecology, obtained a Master's degree and Jordanian Board in 1987.",
      ],
    },
    image: "/Images/Doctor-abdallah.png",
  },
  {
    name: {
      ar: "د. عبدالله",
      en: "Dr. Abdallah",
    },
    title: {
      ar: "استشاري امراض النساء والولادة وجراحتها والعقم، مستشفى الجامعة الأردنية سابقا",
      en: "Consultant in Obstetrics and Gynecology, former at Jordan University Hospital",
    },
    specialties: {
      ar: [
        "استشاري امراض النساء والولادة وجراحتها والعقم، مستشفى الجامعة الأردنية سابقا.",
        "لتخصص في النسائية والتوليد حيث حصل في عام 1987 على درجة الماجستير والبورد الأردني في اختصاص النسائي",
        "لتخصص في النسائية والتوليد حيث حصل في عام 1987 على درجة الماجستير والبورد الأردني في اختصاص النسائي",
      ],
      en: [
        "Consultant in Obstetrics and Gynecology, former at Jordan University Hospital.",
        "Specialized in Obstetrics and Gynecology, obtained a Master's degree and Jordanian Board in 1987.",
        "Specialized in Obstetrics and Gynecology, obtained a Master's degree and Jordanian Board in 1987.",
      ],
    },
    image: "/Images/Doctor-abdallah.png",
  },
];

const DoctorCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [language, setLanguage] = useState<string>("");

  useEffect(() => {
    // Sync the language state with the localStorage value
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    } else {
      setLanguage("ar"); // Default to 'ar' (Arabic) if no language is set
    }

    // Listen for changes in localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "language") {
        setLanguage(event.newValue || "ar");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Run only once on mount

  // Automatically change the slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 4000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? doctors.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === doctors.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto relative mt-8">
      <div className="flex justify-between items-center">
        {/* Slide Content */}
        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {doctors.map((doctor, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 flex lg:flex-row-reverse flex-col items-center text-center lg:gap-20 gap-4 bg-transparent"
              >
                <div className="relative w-1/2 rounded-4xl mb-4">
                  <div
                    className="absolute inset-0 bg-transparent rounded-4xl lg:h-[90%] h-[80%] mt-10 w-[20%]" // Adjust the background color and styles as needed
                    style={{
                      zIndex: -1,
                      boxShadow: "-18px -9px 30px 0 rgba(84, 48, 209, 0.4)",
                    }}
                  ></div>
                  <img
                    src={doctor.image}
                    alt={doctor.name.en} // Ensure that image alt uses English as fallback
                    className="rounded-lg mb-4 w-[400px] h-auto object-cover"
                  />
                </div>

                <div className="flex justify-start gap-20 flex-col  h-full py-4">
                  <div className="text-end">
                    <h3 className="text-4xl font-bold mb-2">
                      {doctor.name[language as "ar" | "en"]} {/* Safe access to language property */}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {doctor.title[language as "ar" | "en"]} {/* Safe access to language property */}
                    </p>
                  </div>
                  <ul className="text-gray-600 mt-10 list-none">
                    {/* Safely check if specialties exist for the language */}
                    {(doctor.specialties[language as "ar" | "en"] || []).map(
                      (specialty, idx) => (
                        <li
                          key={idx}
                          className="mb-4 relative"
                          style={{
                            paddingRight: "2.5rem",
                            textAlign: "right",
                          }}
                        >
                          <span
                            className="absolute right-0 top-1/2 transform -translate-y-1/2  rounded-full"
                            style={{
                              width: "16px",
                              height: "16px",
                              backgroundColor: "rgba(25, 141, 203, 0.31)",
                            }}
                          ></span>
                          {specialty}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center mt-4">
        {doctors.map((_, index) => (
          <span
            key={index}
            className={`mx-1 w-2 h-2 rounded-full cursor-pointer ${
              index === currentIndex ? "bg-gray-800" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorCarousel;
