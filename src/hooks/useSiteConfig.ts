import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";

// Fallback navigation items (used when CMS is empty or on error)
const FALLBACK_HEADER_NAV = [
  { href: "/", label: { fr: "Accueil", en: "Home", ar: "الرئيسية", pt: "Início" }, sort_order: 0 },
  { href: "/about", label: { fr: "À propos", en: "About", ar: "حول", pt: "Sobre" }, sort_order: 1 },
  { href: "/network", label: { fr: "Plateforme", en: "Platform", ar: "المنصة", pt: "Plataforma" }, sort_order: 2 },
  { href: "/strategies", label: { fr: "Stratégies", en: "Strategies", ar: "استراتيجيات", pt: "Estratégias" }, sort_order: 3 },
  { href: "/events", label: { fr: "Événements", en: "Events", ar: "الفعاليات", pt: "Eventos" }, sort_order: 4 },
  { href: "/contact", label: { fr: "Contact", en: "Contact", ar: "اتصل بنا", pt: "Contato" }, sort_order: 5 },
];

const FALLBACK_SETTINGS: Record<string, Record<string, string>> = {
  platform_name: { fr: "UDC", en: "UDC" },
  contact_email: { value: "secretariat@atuuat.africa" },
  contact_phone: { value: "+225 27 22 44 44 44" },
  contact_location: { fr: "Abidjan, Côte d'Ivoire", en: "Abidjan, Ivory Coast" },
  site_slogan: { fr: "Digital Connect Africa", en: "Digital Connect Africa" },
};

export interface NavItem {
  id?: string;
  location: string;
  label: Record<string, string>;
  href: string;
  sort_order: number;
  is_visible: boolean;
  is_external: boolean;
  icon?: string | null;
}

export function useSiteConfig() {
  const { currentLanguage: language } = useTranslation();

  const settingsQuery = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings" as any)
        .select("key, value");
      if (error) throw error;
      const map: Record<string, any> = {};
      (data as any[])?.forEach((row: any) => {
        map[row.key] = row.value;
      });
      return map;
    },
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  const navQuery = useQuery({
    queryKey: ["navigation-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("navigation_items" as any)
        .select("*")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data as any[]) as NavItem[];
    },
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  const settings = settingsQuery.data ?? FALLBACK_SETTINGS;
  const navItems = navQuery.data ?? [];

  function getSetting(key: string): any {
    return settings[key] ?? FALLBACK_SETTINGS[key] ?? null;
  }

  function getSettingLocalized(key: string, lang?: string): string {
    const val = getSetting(key);
    if (!val) return "";
    const l = lang ?? language ?? "fr";
    return val[l] ?? val.fr ?? val.value ?? "";
  }

  function getNavItems(location: string): NavItem[] {
    const items = navItems.filter((n) => n.location === location);
    if (items.length > 0) return items;
    // Fallback for header
    if (location === "header") {
      return FALLBACK_HEADER_NAV.map((f) => ({
        ...f,
        location: "header",
        is_visible: true,
        is_external: false,
      }));
    }
    return [];
  }

  function getNavLabel(item: NavItem, lang?: string): string {
    const l = lang ?? language ?? "fr";
    const label = item.label as Record<string, string>;
    return label[l] ?? label.fr ?? label.en ?? "";
  }

  return {
    settings,
    navItems,
    isLoading: settingsQuery.isLoading || navQuery.isLoading,
    getSetting,
    getSettingLocalized,
    getNavItems,
    getNavLabel,
  };
}
