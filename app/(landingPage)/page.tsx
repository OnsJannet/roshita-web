import BestDoctors from "@/components/unique/BestDoctors";
import Cta from "@/components/unique/Cta";
import DoctorCard from "@/components/unique/DoctorCard";
import DownloadApp from "@/components/unique/DownloadApp";
import HeroPage from "@/components/unique/HeroPage";
import Services from "@/components/unique/Services";

const page = () => {
  return (
    <div className="bg-[#f9f9f9]">
      <div className="bg-[#f9f9f9] pb-40">
        <HeroPage />
        <Cta />
        <Services />
      </div>
      <div className="bg-transparent">
        <div className="relative  flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="absolute bottom-0 w-full"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="relative flex flex-col items-center justify-center bg-white ">
          <BestDoctors />
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#ffffff"
            fill-opacity="1"
            d="M0,64L48,85.3C96,107,192,149,288,186.7C384,224,480,256,576,234.7C672,213,768,139,864,122.7C960,107,1056,149,1152,144C1248,139,1344,85,1392,58.7L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div className="h-60 w-full bg-transparent">

      </div>

      <div className="bg-transparent ">
        <div className="relative  flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="absolute bottom-0 w-full"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
        <div className="bg-white py-20">
          <DownloadApp />
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#ffffff"
            fill-opacity="1"
            d="M0,64L48,85.3C96,107,192,149,288,186.7C384,224,480,256,576,234.7C672,213,768,139,864,122.7C960,107,1056,149,1152,144C1248,139,1344,85,1392,58.7L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>


    </div>
  );
};

export default page;
