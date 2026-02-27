import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useTranslation } from "@/hooks/useTranslation"

// Fallback navigation items (used when CMS is empty or on error)
// MENU PRINCIPAL (FRONT OFFICE) - Selon CDC 4.1
// Tableau de Bord masqué pour les invités (visible uniquement pour les connectés)

/*location: string
label: Record<string, string>
href: string
sort_order: number
is_visible: boolean
is_external: boolean
icon ?: string | null
user_role: any[]
reference: string
parent: string*/

const FALLBACK_HEADER_NAV = [
    {
        href: "/",
        label: { fr: "Accueil", en: "Home", ar: "الرئيسية", pt: "Início" },
        sort_order: 0,
    },
    {
        href: "/projects",
        label: {
            fr: "Projets",
            en: "FSU Projects",
            ar: "مشاريع الخدمة الشاملة",
            pt: "Projetos FSU",
        },
        sort_order: 1,
    },
    {
        href: "/resources",
        label: {
            fr: "Ressources",
            en: "Resources",
            ar: "الموارد",
            pt: "Recursos",
        },
        sort_order: 2,
    },
    {
        href: "/forum",
        label: {
            fr: "Communauté",
            en: "Community",
            ar: "المجتمع",
            pt: "Comunidade",
        },
        sort_order: 3,
    },
    {
        href: "/elearning",
        label: {
            fr: "Formation",
            en: "Training",
            ar: "التدريب",
            pt: "Formação",
        },
        sort_order: 4,
    },
    {
        href: "/events",
        label: {
            fr: "Agenda",
            en: "Agenda",
            ar: "الجدول الزمني",
            pt: "Agenda",
        },
        sort_order: 5,
    },
    {
        href: "/watch",
        label: { fr: "Veille", en: "Watch", ar: "المراقبة", pt: "Vigilância" },
        sort_order: 6,
    },
]

const FALLBACK_SETTINGS: Record<string, Record<string, string>> = {
    platform_name: { fr: "UDC", en: "UDC" },
    contact_email: { value: "secretariat@atuuat.africa" },
    contact_phone: { value: "+225 27 22 44 44 44" },
    contact_location: {
        fr: "Abidjan, Côte d'Ivoire",
        en: "Abidjan, Ivory Coast",
    },
    site_slogan: { fr: "Digital Connect Africa", en: "Digital Connect Africa" },
}

export interface NavItem {
    id?: string
    location: string
    label: Record<string, string>
    href: string
    sort_order: number
    is_visible: boolean
    is_external: boolean
    icon?: string | null
    user_role: any[]
    reference: string
    parent: string
}

export function useSiteConfig() {
    const { currentLanguage: language } = useTranslation()

    const settingsQuery = useQuery({
        queryKey: ["site-settings"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("site_settings" as any)
                .select("key, value")
            if (error) throw error
            const map: Record<string, any> = {}
            ;(data as any[])?.forEach((row: any) => {
                map[row.key] = row.value
            })
            return map
        },
        staleTime: 10 * 60 * 1000,
        retry: 1,
    })

    const navQuery = useQuery({
        queryKey: ["navigation-items"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("navigation_items" as any)
                .select("*")
                .eq("is_visible", true)
                .order("sort_order", { ascending: true })
            if (error) throw error
            return data as any[] as NavItem[]
        },
        staleTime: 10 * 60 * 1000,
        retry: 1,
    })

    const settings = settingsQuery.data ?? FALLBACK_SETTINGS
    const navItems = navQuery.data ?? []

    function getSetting(key: string): any {
        return settings[key] ?? FALLBACK_SETTINGS[key] ?? null
    }

    function getSettingLocalized(key: string, lang?: string): string {
        const val = getSetting(key)
        if (!val) return ""
        const l = lang ?? language ?? "fr"
        return val[l] ?? val.fr ?? val.value ?? ""
    }

    function getNavItems(location: string, parent: string): NavItem[] {
        const items = navItems.filter(n => n.location === location && n.parent === parent)
        if (items.length > 0) return items
        // Fallback for header
        if (location === "header") {
            /*return FALLBACK_HEADER_NAV.map(f => ({
                ...f,
                location: "header",
                is_visible: true,
                is_external: false,
            }))*/
        }
        return []
    }

    function getNavLabel(item: NavItem, lang?: string): string {
        const l = lang ?? language ?? "fr"
        const label = item.label as Record<string, string>
        return label[l] ?? label.fr ?? label.en ?? label.ar ?? label.pt
    }

    return {
        settings,
        navItems,
        isLoading: settingsQuery.isLoading || navQuery.isLoading,
        getSetting,
        getSettingLocalized,
        getNavItems,
        getNavLabel,
    }
}
