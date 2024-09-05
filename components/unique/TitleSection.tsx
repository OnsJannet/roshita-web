import React from "react";
import Filters from "../shared/Filters";
import { Button } from "../ui/button";

const TitleSection = () => {
  return (
    <div>
      <div className="relative w-full h-[60vh] lg:flex-row flex-col bg-cover bg-center bg-[url('/Images/headerWoman.png')]">
        <div className="absolute inset-0 bg-blue-500 opacity-40 z-10"></div>
        <div className="max-w-[1280px] relative flex lg:flex-row flex-col-reverse lg:justify-between justify-center items-center  lg:py-40 py-10 lg:gap-0 gap-2 lg:w-[50%] w-full mx-auto z-20">
          <div>
            <Button
              variant="register"
              className="mt-10 rounded-2xl h-[52px] w-[140px]"
            >
              حمل التطبيق
            </Button>
          </div>
          <div className="">
            <h1 className="text-[60px] text-white text-center lg:text-end font-bold">أحجــز دكتور</h1>
            <p className="text-white lg:text-end">لتقديم الاستشارات الطبية واستفسار كافة المعلومات</p>
          </div>
        </div>
      </div>

      {/*<div className="z-30 lg:mt-0 -mt-[180px]">
        <Filters />
      </div>*/}
    </div>
  );
};

export default TitleSection;
