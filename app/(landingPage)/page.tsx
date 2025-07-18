"use client";
import DiscoveryGuideComponent from "@/components/shared/DiscoveryGuideComponent";
import MedicalCarouselExample from "@/components/shared/MedicalCarousel";
import ServicesComponent from "@/components/shared/ServiceComponent";
import BestDoctors from "@/components/unique/BestDoctors";
import Cta from "@/components/unique/Cta";
import DownloadApp from "@/components/unique/DownloadApp";
import ExpertsConsultants from "@/components/unique/ExpertsConsultants";
import Hero1Page from "@/components/unique/Hero1Page";
import HeroPage from "@/components/unique/HeroPage";
import Services from "@/components/unique/Services";

/**
 * This React component serves as the homepage for a healthcare platform,
 * featuring various sections like a hero page, doctor slots, best doctors,
 * services, and app download CTA. It includes visually appealing SVG designs
 * for seamless transitions between sections.
 *
 * Key functionalities include:
 * - Displaying a hero section at the top to engage users.
 * - Featuring a "Call to Action" (CTA) section encouraging user interaction.
 * - Highlighting services offered by the platform with dedicated components.
 * - Displaying a list of the best doctors with a dedicated section for user browsing.
 * - Encouraging users to download the platform's app with a dedicated download CTA section.
 * - Smooth, dynamic page layout with SVG decorations between sections for aesthetic transitions.
 *
 * Design considerations:
 * - Sections are laid out in a vertical flow with ample spacing between them to create a clean, organized look.
 * - Each section (hero, CTA, services, best doctors, and app download) is self-contained for better maintainability and scalability.
 * - The page includes visually attractive SVG wave patterns to separate sections and provide a polished, fluid user experience.
 *
 * Dependencies:
 * - Custom components (HeroPage, Cta, BestDoctors, Services, DownloadApp, DoctorCard).
 * - Tailwind CSS for styling and layout management.
 * - React hooks (useState, useEffect) for managing state and side effects if needed.
 */

//should be #f9f9f9

const page = () => {
  return (
    <div className="bg-[#f2f7ff]">
      <div className="bg-[#f2f7ff] ">
        <Hero1Page />
        <ServicesComponent />
        <DiscoveryGuideComponent />
        <MedicalCarouselExample />
        <ExpertsConsultants />
        <div className="bg-white lg:h-40 h-0"></div>
        <DownloadApp />
        <div className="bg-white h-40 "></div>
      </div>
    </div>
  );
};

export default page;
