import BestDoctors from "@/components/unique/BestDoctors";
import Cta from "@/components/unique/Cta";
import HeroPage from "@/components/unique/HeroPage";
import Services from "@/components/unique/Services";

const page = () => {
  return (
    <div>
      <div className="bg-[#f9f9f9]">
        <HeroPage />
        <Cta />
        <Services />
      </div>
      <div className="bg-white py-20">
        <BestDoctors />
      </div>
    </div>
  );
};

export default page;
