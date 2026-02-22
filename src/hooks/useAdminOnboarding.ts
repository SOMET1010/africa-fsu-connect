import { useEffect, useCallback, useRef } from "react";
import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";

const STORAGE_KEY = "admin_onboarding_completed";

const STEPS: Record<string, DriveStep & { title: Record<string, string>; desc: Record<string, string> }> = {};

const TOUR_STEPS = [
  {
    element: "[data-tour='kpis']",
    title: {
      fr: "Indicateurs clés",
      en: "Key Performance Indicators",
      ar: "المؤشرات الرئيسية",
      pt: "Indicadores-chave",
    },
    desc: {
      fr: "Suivez en temps réel le nombre d'utilisateurs, documents, événements et projets de la plateforme.",
      en: "Monitor users, documents, events and projects on the platform in real time.",
      ar: "تابع في الوقت الفعلي عدد المستخدمين والوثائق والفعاليات والمشاريع على المنصة.",
      pt: "Acompanhe em tempo real utilizadores, documentos, eventos e projetos da plataforma.",
    },
  },
  {
    element: "[data-tour='shortcuts']",
    title: {
      fr: "Accès rapide",
      en: "Quick Access",
      ar: "وصول سريع",
      pt: "Acesso rápido",
    },
    desc: {
      fr: "Accédez directement aux modules d'administration selon votre rôle : contenu, utilisateurs, forum, etc.",
      en: "Jump directly to admin modules based on your role: content, users, forum, and more.",
      ar: "انتقل مباشرة إلى وحدات الإدارة حسب دورك: المحتوى، المستخدمون، المنتدى، وغيرها.",
      pt: "Acesse diretamente os módulos de administração conforme seu papel: conteúdo, utilizadores, fórum, etc.",
    },
  },
  {
    element: "[data-tour='activity']",
    title: {
      fr: "Activité récente",
      en: "Recent Activity",
      ar: "النشاط الأخير",
      pt: "Atividade recente",
    },
    desc: {
      fr: "Consultez les dernières actions effectuées sur la plateforme pour garder le contrôle.",
      en: "Review the latest actions on the platform to stay in control.",
      ar: "راجع آخر الإجراءات التي تمت على المنصة للبقاء على اطلاع.",
      pt: "Consulte as últimas ações realizadas na plataforma para manter o controlo.",
    },
  },
  {
    element: "[data-tour='alerts']",
    title: {
      fr: "Alertes & modération",
      en: "Alerts & Moderation",
      ar: "التنبيهات والإشراف",
      pt: "Alertas e moderação",
    },
    desc: {
      fr: "Gérez les alertes de sécurité et les contenus signalés nécessitant votre attention.",
      en: "Manage security alerts and flagged content that needs your attention.",
      ar: "أدِر تنبيهات الأمان والمحتوى المبلّغ عنه الذي يحتاج اهتمامك.",
      pt: "Gerencie alertas de segurança e conteúdos sinalizados que necessitam da sua atenção.",
    },
  },
  {
    element: "[data-tour='lang-selector']",
    title: {
      fr: "Changer de langue",
      en: "Change Language",
      ar: "تغيير اللغة",
      pt: "Mudar idioma",
    },
    desc: {
      fr: "Basculez entre français, anglais, arabe et portugais à tout moment.",
      en: "Switch between French, English, Arabic and Portuguese at any time.",
      ar: "بدّل بين الفرنسية والإنجليزية والعربية والبرتغالية في أي وقت.",
      pt: "Alterne entre francês, inglês, árabe e português a qualquer momento.",
    },
  },
];

const BUTTON_LABELS = {
  next: { fr: "Suivant", en: "Next", ar: "التالي", pt: "Seguinte" },
  prev: { fr: "Précédent", en: "Previous", ar: "السابق", pt: "Anterior" },
  done: { fr: "Terminé", en: "Done", ar: "تم", pt: "Concluído" },
};

export const useAdminOnboarding = () => {
  const { currentLanguage } = useTranslation();
  const { isRTL } = useDirection();
  const lang = currentLanguage || "fr";
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);

  const startTour = useCallback(() => {
    // Build steps for current language
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

    // Apply RTL class to driver popover
    if (isRTL) {
      document.documentElement.classList.add("driver-rtl");
    } else {
      document.documentElement.classList.remove("driver-rtl");
    }

    // Small delay to ensure DOM elements are rendered
    setTimeout(() => driverObj.drive(), 500);
  }, [lang, isRTL]);

  // Auto-start for first-time visitors
  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      // Wait for the dashboard to render
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
