'use client';

import React, { useState, useEffect } from 'react';
import DoctorSearchFilters from "../shared/DoctorSearchFilters";
import { useRouter } from 'next/navigation';

const Hero1Page: React.FC = () => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const storedLang = localStorage.getItem('language');
    if (storedLang === 'en' || storedLang === 'ar') {
      setLanguage(storedLang);
    }
  }, []);

  const carouselSlides = [
    {
      id: 1,
      image: "/Images/carouse-hero-1.png",
      ar: {
        title: "خـــــود رأي طـــــــــبي تاني  مـــــجاني ",
subtitle: "تحصل على استشارة طبية ثانية من أطباء في تونس وليبيا",

      },
      en: {
        title: "Second Medical Opinion",
        subtitle: "Get a second medical consultation from doctors in Tunisia and Libya",
      }
    },
    {
      id: 2,
      image: "/Images/carouse-hero-2.png",
      ar: {
        title: "خـــــود رأي طـــــــــبي تاني  مـــــجاني ",
subtitle: "تحصل على استشارة طبية ثانية من أطباء في تونس وليبيا",

      },
      en: {
        title: "Free Second Medical Opinion",
        subtitle: "Get a second medical consultation for free in Tunisia and Libya",
      }
    },
    {
      id: 3,
      image: "/Images/carouse-hero-3.png",
      ar: {
        title: "خـــــود رأي طـــــــــبي تاني  مـــــجاني ",
subtitle: "تحصل على استشارة طبية ثانية من أطباء في تونس وليبيا",

      },
      en: {
        title: "Second Medical Opinion",
        subtitle: "Get a second medical consultation from doctors in Tunisia and Libya",
      }
    }
  ];

  const currentSlideContent = carouselSlides[currentSlide][language];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === carouselSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  const handleConsultationClick = () => {
    console.log("entered")
    router.push('/create-consultation');
  };

  return (
    <div className="relative min-h-screen">
      {/* Carousel */}
      <div className="absolute inset-0 overflow-hidden">
        {carouselSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img
              src={slide.image}
              alt="Medical Professional Background"
              className="w-full h-full object-cover object-center"
            />

            {/* Slide Content - Made responsive */}
            <div className="lg:mt-0 mt-[-150px] absolute inset-0 flex items-center justify-center text-white p-4 lg:p-8 lg:w-1/2 w-full z-30">
              <div className="text-center w-full lg:w-[80%] lg:pr-20">
                <h1 className="text-4xl sm:text-[4xl] md:text-4xl lg:text-[48px] font-bold mb-2 lg:mb-4 lg:text-black lg:text-right text-center">
                  {currentSlideContent.title}
                </h1>
                <p className="text-2xl sm:text-base md:text-lg lg:text-[24px] mb-4 lg:mb-6 lg:text-black lg:text-right text-center">
                  {currentSlideContent.subtitle}
                </p>
                <div className="flex lg:justify-end justify-center">
                  <button
                    onClick={handleConsultationClick}
                    className="bg-[#1C75BC] p-2 lg:p-4 w-[160px] lg:w-[220px] rounded-md flex items-center justify-between cursor-pointer text-white text-sm lg:text-base"
                  >
                    <span className="mr-2">←</span>
                    <span>
                      {language === "ar" ? "احصل على استشارة" : "Get a consultation"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

      {/* Carousel Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom Content - Made responsive */}
      <div className="relative z-9999 lg:min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
          <div className="mx-auto w-full lg:mt-[500px] mt-[450px] sm:mt-[200px]">
            <DoctorSearchFilters />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Hero1Page;