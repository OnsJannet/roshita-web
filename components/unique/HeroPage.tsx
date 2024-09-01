import Filters from "../shared/Filters";
import { Button } from "../ui/button";
import Cta from "./Cta";

const HeroPage = () => {
  return (
    <div >
      <div className="w-full flex h-[80vh] lg:flex-row flex-col ">
        <div className="lg:w-1/2 w-full p-20 text-center flex flex-col justify-center  ">
          <div className="mx-auto">
            <h1 className="text-[60px] text-end text-roshitaBlue">
              رعاية طبية
            </h1>
            <h1 className="text-[35px] text-end">بين تونس وليبيا</h1>
            <p className="text-[18px] text-end text-[#909090] mt-4">
              لتقديم الاستشارات الطبية واستفسار كافة المعلومات
            </p>
            <Button
              variant="register"
              className="mt-10 rounded-2xl h-[52px] w-[140px]"
            >
              حمل التطبيق
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2 w-full h-full bg-roshitaBlue flex items-center justify-center">
          <img
            className="h-full w-auto"
            alt="hero page"
            src="/Images/HeroImage.png"
          />
        </div>
      </div>
      <div className="!z-[9999]">
      <Filters />
      </div>
    </div>
  );
};

export default HeroPage;
