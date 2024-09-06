'use client';

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const Services = () => {
  const router = useRouter(); // Initialize useRouter
  const services = [
    {
      title: "صيدليات",
      paragraph: "تقديم كافة المعلومات حول الصيدليات",
      image: "/images/pharmacies.png",
    },
    {
      title: "مستشفيات",
      paragraph: "تقديم كافة معلومات مستشفيات",
      image: "/images/Hospitals.png",
    },
    {
      title: "معامل تحاليل",
      paragraph: "تقديم كافة المعلومات حول معامل تحاليل وتصوير",
      image: "/images/biotech.png",
    },
  ];

  const handleClick = () => {
    console.log("Button clicked"); // Debugging line
    router.push('/guide');
  };

  return (
    <div className="max-w-[1280px] mx-auto pb-20">
      <h2 className="text-center text-roshitaDarkBlue text-4xl font-bold">
        الدليل الطبي
      </h2>
      <p className="text-gray-700 text-center mt-4 text-2xl lg:w-[50%] w-[90%] mx-auto">
        توفر كافة المعلومات عن المستشفيات الليبية والتونسية لتسهيل عمليات الحجز
        والاستشارة
      </p>
      <div className="flex justify-center lg:gap-10 gap-4 mt-8 lg:flex-row-reverse mb-8 flex-col-reverse">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 lg:w-[200px] w-[60%] lg:mx-0 mx-auto h-[200px] flex flex-col items-center text-center my-center gap-10"
            style={{
              boxShadow: "0 8px 26.6px rgba(0, 0, 0, 0.09)",
              zIndex: 9999,
            }}
          >
            <div className="flex justify-start gap-1 flex-row-reverse items-center">
              <img
                src={service.image}
                alt={service.title}
                className="h-[40px] w-[40px] object-contain mb-8"
              />
              <h3 className="text-lg font-bold mb-2">{service.title}</h3>
            </div>
            <p className="text-gray-600 text-[15px]">{service.paragraph}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mb-4">
      <Button
          variant="register"
          className="h-[72px] w-[200px] rounded-2xl text-[18px] font-semibold cursor-pointer z-[999999]"
          onClick={handleClick}
        >
          اكتشف الدليل
        </Button>
      </div>
    </div>
  );
};

export default Services;
