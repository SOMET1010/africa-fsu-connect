import { useEffect, useCallback, useRef } from "react";
import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import "@/styles/driver-rtl.css";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";

const STORAGE_KEY = "user_onboarding_tour_completed";

const TOUR_STEPS = [
  {
    element: "[data-tour='user-hero']",
    title: {
      fr: "Bienvenue sur la plateforme",
      en: "Welcome to the Platform",
      ar: "مرحبًا بك في المنصة",
      pt: "Bem-vindo à plataforma",
    },
    desc: {
      fr: "Découvrez le réseau panafricain du Service Universel. Cette plateforme connecte les agences membres pour partager ressources, projets et bonnes pratiques.",
      en: "Discover the pan-African Universal Service network. This platform connects member agencies to share resources, projects and best practices.",
      ar: "اكتشف الشبكة الأفريقية للخدمة الشاملة. تربط هذه المنصة الوكالات الأعضاء لتبادل الموارد والمشاريع وأفضل الممارسات.",
      pt: "Descubra a rede pan-africana do Serviço Universal. Esta plataforma conecta agências membros para partilhar recursos, projetos e boas práticas.",
    },
  },
  {
    element: "[data-tour='user-kpis']",
    title: {
      fr: "Vos indicateurs",
      en: "Your Metrics",
      ar: "مؤشراتك",
      pt: "Seus indicadores",
    },
    desc: {
      fr: "Suivez vos projets, documents partagés, événements à venir et soumissions en un coup d'œil.",
      en: "Track your projects, shared documents, upcoming events and submissions at a glance.",
      ar: "تابع مشاريعك ووثائقك المشتركة وفعالياتك القادمة وتقديماتك بنظرة سريعة.",
      pt: "Acompanhe seus projetos, documentos partilhados, eventos próximos e submissões num relance.",
    },
  },
  {
    element: "[data-tour='user-map']",
    title: {
      fr: "Carte interactive",
      en: "Interactive Map",
      ar: "خريطة تفاعلية",
      pt: "Mapa interativo",
    },
    desc: {
      fr: "Explorez les pays membres du réseau et découvrez leurs agences, projets et contacts.",
      en: "Explore network member countries and discover their agencies, projects and contacts.",
      ar: "استكشف الدول الأعضاء في الشبكة واكتشف وكالاتها ومشاريعها وجهات اتصالها.",
      pt: "Explore os países membros da rede e descubra suas agências, projetos e contactos.",
    },
  },
  {
    element: "[data-tour='user-projects']",
    title: {
      fr: "Projets inspirants",
      en: "Inspiring Projects",
      ar: "مشاريع ملهمة",
      pt: "Projetos inspiradores",
    },
    desc: {
      fr: "Découvrez les projets phares des agences membres et trouvez des opportunités de collaboration transfrontalière.",
      en: "Discover flagship projects from member agencies and find cross-border collaboration opportunities.",
      ar: "اكتشف المشاريع الرائدة للوكالات الأعضاء وابحث عن فرص التعاون عبر الحدود.",
      pt: "Descubra projetos emblemáticos das agências membros e encontre oportunidades de colaboração transfronteiriça.",
    },
  },
  {
    element: "[data-tour='user-resources']",
    title: {
      fr: "Ressources & Événements",
      en: "Resources & Events",
      ar: "الموارد والفعاليات",
      pt: "Recursos e eventos",
    },
    desc: {
      fr: "Accédez aux documents clés (régulation, financement, connectivité) et inscrivez-vous aux événements du réseau.",
      en: "Access key documents (regulation, funding, connectivity) and register for network events.",
      ar: "اطلع على الوثائق الرئيسية (التنظيم، التمويل، الاتصال) وسجّل في فعاليات الشبكة.",
      pt: "Acesse documentos-chave (regulação, financiamento, conectividade) e inscreva-se nos eventos da rede.",
    },
  },
  {
    element: "[data-tour='user-lang-selector']",
    title: {
      fr: "Langue & votre rôle",
      en: "Language & Your Role",
      ar: "اللغة ودورك",
      pt: "Idioma e seu papel",
    },
    desc: {
      fr: "Basculez entre français, anglais, arabe et portugais. En tant que membre institutionnel, vous pouvez partager des ressources, collaborer sur des projets et participer aux événements.",
      en: "Switch between French, English, Arabic and Portuguese. As an institutional member, you can share resources, collaborate on projects and participate in events.",
      ar: "بدّل بين الفرنسية والإنجليزية والعربية والبرتغالية. بصفتك عضوًا مؤسسيًا، يمكنك مشاركة الموارد والتعاون في المشاريع والمشاركة في الفعاليات.",
      pt: "Alterne entre francês, inglês, árabe e português. Como membro institucional, pode partilhar recursos, colaborar em projetos e participar em eventos.",
    },
  },
];

const BUTTON_LABELS = {
  next: { fr: "Suivant", en: "Next", ar: "التالي", pt: "Seguinte" } as Record<string, string>,
  prev: { fr: "Précédent", en: "Previous", ar: "السابق", pt: "Anterior" } as Record<string, string>,
  done: { fr: "Terminé", en: "Done", ar: "تم", pt: "Concluído" } as Record<string, string>,
};

export const useUserOnboardingTour = () => {
  const { currentLanguage } = useTranslation();
  const { isRTL } = useDirection();
  const lang = currentLanguage || "fr";
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);

  const startTour = useCallback(() => {
    const steps: DriveStep[] = TOUR_STEPS.map((step) => ({
      element: step.element,
      popover: {
        title: step.title[lang] ?? step.title.fr,
        description: step.desc[lang] ?? step.desc.fr,
      },
    }));

    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      nextBtnText: BUTTON_LABELS.next[lang] ?? BUTTON_LABELS.next.fr,
      prevBtnText: BUTTON_LABELS.prev[lang] ?? BUTTON_LABELS.prev.fr,
      doneBtnText: BUTTON_LABELS.done[lang] ?? BUTTON_LABELS.done.fr,
      steps,
      onDestroyStarted: () => {
        localStorage.setItem(STORAGE_KEY, "true");
        driverObj.destroy();
      },
    });

    driverRef.current = driverObj;

    if (isRTL) {
      document.documentElement.classList.add("driver-rtl");
    } else {
      document.documentElement.classList.remove("driver-rtl");
    }

    setTimeout(() => driverObj.drive(), 500);
  }, [lang, isRTL]);

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      const timer = setTimeout(() => startTour(), 1200);
      return () => clearTimeout(timer);
    }
  }, [startTour]);

  const resetTour = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    startTour();
  }, [startTour]);

  return { startTour, resetTour };
};
