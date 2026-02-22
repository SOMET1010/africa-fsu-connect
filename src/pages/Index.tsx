import { HomeHeroBlock } from "@/components/home/HomeHeroBlock";
import { HomeGridSection } from "@/components/home/HomeGridSection";
import { HomeStatsSection } from "@/components/home/HomeStatsSection";
import { HomePartnersBlock } from "@/components/home/HomePartnersBlock";
import { PublicHeader } from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <HomeHeroBlock />
      <HomeGridSection />
      <HomeStatsSection />
      <HomePartnersBlock />
      <Footer />
    </div>
  );
};

export default Index;
