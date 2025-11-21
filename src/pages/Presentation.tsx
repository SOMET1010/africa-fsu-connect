import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { HeroSection } from "@/components/ui/hero-section";
import { PresentationNavigation } from "@/components/presentation/PresentationNavigation";
import { RegionalImpactSection } from "@/components/presentation/RegionalImpactSection";
import { ROICalculator } from "@/components/presentation/ROICalculator";
import { InteractiveDemoSection } from "@/components/presentation/InteractiveDemoSection";
import { TechnicalArchitecture } from "@/components/presentation/TechnicalArchitecture";
import { SocialProofSection } from "@/components/presentation/SocialProofSection";
import { SecurityComplianceSection } from "@/components/presentation/SecurityComplianceSection";
import { CallToActionSection } from "@/components/presentation/CallToActionSection";
import { PresentationControls } from "@/components/presentation/PresentationControls";
import { usePresentationKeyboard } from "@/hooks/usePresentationKeyboard";
import { usePresentationTracking } from "@/hooks/usePresentationTracking";
import { SlideTransitions, type TransitionType } from "@/components/presentation/SlideTransitions";
import { 
  Presentation as PresentationIcon, 
  Users, 
  TrendingUp, 
  Zap,
  Shield,
  Network,
  Award,
  Rocket
} from "lucide-react";

export default function Presentation() {
  const { t } = useTranslation('presentation');
  const [currentSection, setCurrentSection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [transitionType] = useState<TransitionType>('fade');
  const { trackSectionView, trackExport, trackShare } = usePresentationTracking();

  useEffect(() => {
    trackSectionView(currentSection);
  }, [currentSection, trackSectionView]);

  const sections = [
    {
      id: "hero",
      title: "Vision SUTEL Afrique",
      component: HeroSection,
      icon: PresentationIcon,
      props: {
        title: "SUTEL Platform : L'Avenir des Télécommunications Africaines",
        subtitle: "Une Solution Révolutionnaire",
        description: "La plateforme qui connecte 55+ pays, gère 1100+ projets et transforme l'industrie des télécommunications en Afrique. Rejoignez la révolution numérique qui unit notre continent.",
        actions: [
          {
            label: "Commencer la Demo",
            onClick: () => setCurrentSection(1),
            variant: "default" as const,
            icon: <Zap className="h-4 w-4" />
          },
          {
            label: "Calculer ROI",
            onClick: () => setCurrentSection(2),
            variant: "outline" as const,
            icon: <TrendingUp className="h-4 w-4" />
          }
        ]
      }
    },
    {
      id: "regional-impact",
      title: "Impact Régional",
      component: RegionalImpactSection,
      icon: Users,
      props: {}
    },
    {
      id: "roi-calculator",
      title: "Calculateur ROI",
      component: ROICalculator,
      icon: TrendingUp,
      props: {}
    },
    {
      id: "interactive-demo",
      title: "Démonstration Interactive",
      component: InteractiveDemoSection,
      icon: Zap,
      props: {}
    },
    {
      id: "technical-architecture",
      title: "Architecture Technique",
      component: TechnicalArchitecture,
      icon: Network,
      props: {}
    },
    {
      id: "social-proof",
      title: "Preuves & Résultats",
      component: SocialProofSection,
      icon: Award,
      props: {}
    },
    {
      id: "security-compliance",
      title: "Sécurité & Conformité",
      component: SecurityComplianceSection,
      icon: Shield,
      props: {}
    },
    {
      id: "call-to-action",
      title: "Rejoignez-Nous",
      component: CallToActionSection,
      icon: Rocket,
      props: {}
    }
  ];

  // Keyboard navigation (after sections is defined)
  usePresentationKeyboard({
    onNext: () => setCurrentSection(Math.min(sections.length - 1, currentSection + 1)),
    onPrevious: () => setCurrentSection(Math.max(0, currentSection - 1)),
    onToggleFullscreen: () => setIsFullscreen(!isFullscreen),
    isFullscreen,
    currentSection,
    totalSections: sections.length
  });

  const CurrentComponent = sections[currentSection]?.component;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-muted/20 to-background ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {!isFullscreen && (
        <PresentationNavigation
          sections={sections}
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
        />
      )}

      <main className="container mx-auto px-4 py-8 space-y-8">
        <PresentationControls
          isFullscreen={isFullscreen}
          onFullscreenToggle={() => setIsFullscreen(!isFullscreen)}
          currentSection={currentSection}
          totalSections={sections.length}
          onPrevious={() => setCurrentSection(Math.max(0, currentSection - 1))}
          onNext={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
          sections={sections}
          onTrackExport={trackExport}
          onTrackShare={trackShare}
        />

        <SlideTransitions transitionType={transitionType}>
          <div className="space-y-8">
        {currentSection === 0 ? (
          <HeroSection 
            title="SUTEL Platform : L'Avenir des Télécommunications Africaines"
            subtitle="Une Solution Révolutionnaire"
            description="La plateforme qui connecte 55+ pays, gère 1100+ projets et transforme l'industrie des télécommunications en Afrique. Rejoignez la révolution numérique qui unit notre continent."
            actions={[
              {
                label: "Commencer la Demo",
                onClick: () => setCurrentSection(1),
                variant: "default" as const,
                icon: <Zap className="h-4 w-4" />
              },
              {
                label: "Calculer ROI",
                onClick: () => setCurrentSection(2),
                variant: "outline" as const,
                icon: <TrendingUp className="h-4 w-4" />
              }
            ]}
          />
        ) : currentSection === 1 ? (
          <RegionalImpactSection />
        ) : currentSection === 2 ? (
          <ROICalculator />
        ) : currentSection === 3 ? (
          <InteractiveDemoSection />
        ) : currentSection === 4 ? (
          <TechnicalArchitecture />
        ) : currentSection === 5 ? (
          <SocialProofSection />
        ) : currentSection === 6 ? (
          <SecurityComplianceSection />
        ) : currentSection === 7 ? (
          <CallToActionSection />
        ) : null}
          </div>
        </SlideTransitions>
      </main>
    </div>
  );
}