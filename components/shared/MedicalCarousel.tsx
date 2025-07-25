"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  image: string;
  badge?: string;
  href?: string;
}

interface CarouselProps {
  title: string;
  subtitle: string;
  data: CarouselItem[];
  language?: "ar" | "en";
}

const MedicalCarousel: React.FC<CarouselProps> = ({
  title,
  subtitle,
  data,
  language = "ar",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(5); // Changed default to 5
  const router = useRouter();

  // Clone items at both ends for infinite effect
  const clonedData = [
    ...data.slice(-itemsPerView),
    ...data,
    ...data.slice(0, itemsPerView),
  ];

  const itemWidth = 100 / itemsPerView;
  const totalItems = clonedData.length;
  const maxIndex = data.length + itemsPerView;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setItemsPerView(1);
      } else if (window.innerWidth < 640) {
        setItemsPerView(1.5); // Shows 1.5 items to indicate there's more to scroll
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(4);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(4);
      } else {
        setItemsPerView(6); // Show 5 items on very large screens
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleBookClick = (href: string | undefined) => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <div
      className={`py-8 md:py-16 px-4 sm:px-6 bg-gray-50 ${
        language === "ar" ? "rtl" : "ltr"
      }`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
            {title}
          </h2>
          <div className="w-12 h-1 bg-green-500 mx-auto mb-3 md:mb-4"></div>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2">
            {subtitle}
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Buttons - Hidden on mobile */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`hidden sm:block absolute ${
              language === "ar" ? "right-4" : "left-4"
            } top-1/2 -translate-y-1/2 z-10 
    w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center
    disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors`}
          >
            {language === "ar" ? (
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-600 mx-auto my-auto" />
            ) : (
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600 mx-auto my-auto" />
            )}
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className={`hidden sm:block absolute ${
              language === "ar" ? "left-4" : "right-4"
            } top-1/2 -translate-y-1/2 z-10 
    w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center
    disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors`}
          >
            {language === "ar" ? (
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600 mx-auto my-auto" />
            ) : (
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-600 mx-auto my-auto" />
            )}
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden px-1 sm:px-4">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                width: `${data.length * itemWidth}%`,
                transform:
                  language === "ar"
                    ? `translateX(${currentIndex * itemWidth}%)`
                    : `translateX(-${currentIndex * itemWidth}%)`,
              }}
            >
              {clonedData.map((item) => (
                <div
                  key={item.id}
                  className="flex p-1 sm:p-2 md:p-3"
                  style={{
                    width: `${itemWidth}%`,
                    minWidth: `${itemWidth}%`,
                  }}
                >
                  <div className="bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg overflow-hidden hover:shadow-lg md:hover:shadow-xl transition-shadow duration-300 h-full flex flex-col w-full">
                    {/* Image */}
                    <div className="relative h-32 sm:h-40 md:h-48 lg:h-56 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {item.badge && (
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-medium">
                          {item.badge}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4 md:p-6 flex-grow flex flex-col">
                      <div className="flex-grow">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-4">
                          {item.subtitle}
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <button
                          className="border border-[#1588C8] py-1 px-3 sm:px-4 rounded-md text-sm sm:text-base text-[#1588C8] hover:bg-[#1588C8] hover:text-white transition-colors"
                          onClick={() => handleBookClick(item.href)}
                        >
                          {language === "ar" ? "حجز" : "Book"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Dots */}
          <div className="sm:hidden flex justify-center mt-4 space-x-2">
            {Array.from({ length: Math.ceil(data.length / itemsPerView) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    currentIndex === index ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MedicalCarouselExample: React.FC = () => {
  const [language, setLanguage] = useState<"ar" | "en">("ar");

  useEffect(() => {
    // Get language from localStorage
    const storedLanguage = localStorage.getItem("language") || "ar";
    //@ts-ignore
    setLanguage(storedLanguage);
  }, []);

  const offersData: CarouselItem[] = [
    {
      id: "1",
      title: language === "ar" ? "تشخيص اسنان" : "Dental Diagnosis",
      subtitle: language === "ar" ? "عيادة" : "Clinic",
      price: "1500",
      image: "/Images/dental.png",
      badge: language === "ar" ? "جديد" : "New",
    },
    {
      id: "2",
      title: language === "ar" ? "أطفال" : "Pediatrics",
      subtitle: language === "ar" ? "عيادة" : "Clinic",
      price: "1200",
      image: "/Images/children.png",
      badge: language === "ar" ? "جديد" : "New",
    },
    {
      id: "3",
      title: language === "ar" ? "عيادات الجلدية" : "Dermatology",
      subtitle: language === "ar" ? "عيادة" : "Clinic",
      price: "1800",
      image: "/Images/skin.png",
      badge: language === "ar" ? "جديد" : "New",
    },
    {
      id: "4",
      title: language === "ar" ? "عيادة القلب" : "Cardiology",
      subtitle: language === "ar" ? "عيادة" : "Clinic",
      price: "2500",
      image: "/Images/alkestra.png",
      badge: language === "ar" ? "جديد" : "New",
    },
    {
      id: "5",
      title: language === "ar" ? "أسنان" : "Dentistry",
      subtitle: language === "ar" ? "تخصص" : "Specialty",
      price: "1800",
      image: "/Images/dentist.png",
      badge: language === "ar" ? "جديد" : "New",
      href: "/doctor-appointement/all/all/أسنان/all/all",
    },
    {
      id: "6",
      title: language === "ar" ? "تجميل" : "Cosmetic",
      subtitle: language === "ar" ? "تخصص" : "Specialty",
      price: "3000",
      image: "/Images/cosmetic.png",
      badge: language === "ar" ? "جديد" : "New",
      href: "/doctor-appointement/all/all/جراحة%20تجميل/all/all",
    },
    {
      id: "7",
      title: language === "ar" ? "اختصاص عظام" : "Orthopedics",
      subtitle: language === "ar" ? "تخصص" : "Specialty",
      price: "2200",
      image: "/Images/bones.png",
      badge: language === "ar" ? "جديد" : "New",
      href: "/doctor-appointement/all/all/عظام/all/all",
    },
    {
      id: "8",
      title: language === "ar" ? "أمراض والقلب" : "Cardiology",
      subtitle: language === "ar" ? "تخصص" : "Specialty",
      price: "2800",
      image: "/Images/Heart.png",
      badge: language === "ar" ? "جديد" : "New",
      href: "/doctor-appointement/all/all/جراحة%20قلب%20وصدر/all/all",
    },
  ];

  return (
    <div className="lg:min-h-screen bg-gray-50">
      {/* Offers Carousel */}
      <MedicalCarousel
        title={language === "ar" ? "عروض" : "Offers"}
        subtitle={
          language === "ar"
            ? "أكثر عروض وخدمات رخيصة الخدمات الطبية المتميزة باستعمال منتجات عالية الجودة كل هذا يمكنكم من تحرير وقتكم"
            : "More affordable offers and services for distinguished medical services using high-quality products, all of this allows you to free up your time"
        }
        data={offersData}
        language={language}
      />
    </div>
  );
};

export default MedicalCarouselExample;
