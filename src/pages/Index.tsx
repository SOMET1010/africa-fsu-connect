import { HomeHeroBlock } from "@/components/home/HomeHeroBlock";
import { HomeGridSection } from "@/components/home/HomeGridSection";
import { HomeStatsSection } from "@/components/home/HomeStatsSection";
import { HomePartnersBlock } from "@/components/home/HomePartnersBlock";
import { PublicHeader } from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/contexts/AuthContext";

const HomeContent = () => (
  <>
    <HomeHeroBlock />
    <HomeGridSection />
    <HomeStatsSection />
    <HomePartnersBlock />
  </>
);

const HomePublic = () => (
  <div className="min-h-screen bg-white">
    <PublicHeader />
    <HomeContent />
    <Footer />
  </div>
);

const Index = () => {
  const { user } = useAuth();

  if (user) {
    return (
      <AppShell>
        <div className="min-h-screen bg-white">
          <HomeContent />
        </div>
      </AppShell>
    );
  }

  return <HomePublic />;
};

export default Index;
