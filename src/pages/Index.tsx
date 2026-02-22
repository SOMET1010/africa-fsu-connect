import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import nexusHeroImage from "@/assets/nexus-hero-africa.png";
import { HomeHeroBlock } from "@/components/home/HomeHeroBlock";
import { HomeFeaturesBlock } from "@/components/home/HomeFeaturesBlock";
import { HomeCtaBlock } from "@/components/home/HomeCtaBlock";
import { HomePartnersBlock } from "@/components/home/HomePartnersBlock";
import { HomeMessagesBlock } from "@/components/home/HomeMessagesBlock";
import { HomeTrustBadge } from "@/components/home/HomeTrustBadge";
import { HomeTrustSection } from "@/components/home/HomeTrustSection";
import { HomeMemberMapBlock } from "@/components/home/HomeMemberMapBlock";
import { AdminLocaleConsistencyAlert } from "@/components/home/AdminLocaleConsistencyAlert";

import { PublicHeader } from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";

const Index = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { preferences } = useUserPreferences();
  const variant = preferences.homeLayout === 'immersive' ? 'dark' : 'light';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ===== DARK ZONE: Hero ===== */}
      <div className="bg-[hsl(var(--nx-night))] relative">
        <div className="absolute inset-0">
          <img src={nexusHeroImage} alt="Africa Network" className="w-full h-full object-cover opacity-45" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--nx-night))]/40 via-[hsl(var(--nx-night))]/60 to-[hsl(var(--nx-night))]" />
        </div>
        <div className="relative z-10">
          <PublicHeader />
          <AdminLocaleConsistencyAlert />
          <HomeHeroBlock />
          <HomeTrustBadge />
        </div>
      </div>

      {/* ===== CONTENT ZONE: Light or Immersive ===== */}
      <div className={variant === 'dark' ? "bg-[hsl(var(--nx-night))] relative z-10" : "bg-[hsl(var(--nx-bg))] relative z-10"}>
        <HomeMemberMapBlock variant={variant} />
        <HomeFeaturesBlock variant={variant} />
        <HomeTrustSection variant={variant} />
        <HomeMessagesBlock variant={variant} />
        <HomeCtaBlock variant={variant} />
        <HomePartnersBlock variant={variant} />
      </div>

      {/* ===== DARK ZONE: Footer ===== */}
      <div className="bg-[hsl(var(--nx-night))] relative z-10">
        <Footer />
      </div>

    </div>
  );
};

export default Index;
