import {
    Home,
    Map,
    BookOpen,
    Users,
    GraduationCap,
    Calendar,
    Rss,
    BarChart3,
    User,
    FileText,
    MessageSquare,
    Video,
    Shield,
    Settings,
    LogOut,
} from "lucide-react"

export interface NavSubItem {
    label: string
    labelKey?: string
    href: string
    icon: any
    description: string
    descriptionKey?: string
    roles?: string[] // Pour les restrictions d'accès
}

export interface NavItem {
    id: string
    label: string
    labelKey?: string
    href?: string
    icon: any
    highlight?: boolean
    submenu?: NavSubItem[]
    roles?: string[] // Pour les restrictions d'accès
}

// ============================================================
// MENU PRINCIPAL (FRONT OFFICE)
// Accessible selon les droits : Invité, Lecteur, Contributeur, Administrateur
// ============================================================

export const mainNavigation: NavItem[] = [
    {
        id: "home",
        label: "Accueil",
        labelKey: "nav.home",
        href: "/",
        icon: Home,
        highlight: true,
        submenu: [
            {
                label: "Vue d'ensemble",
                labelKey: "nav.home.overview",
                href: "/",
                icon: Home,
                description: "Vue d'ensemble dynamique du programme FSU",
            },
            {
                label: "Mot des autorités",
                labelKey: "nav.home.authorities",
                href: "/about",
                icon: Users,
                description: "Mot de la DG ANSUT et du SG UAT",
            },
        ],
    },
    {
        id: "projects",
        label: "Projets",
        labelKey: "nav.projects",
        icon: Map,
        highlight: false,
        submenu: [
            {
                label: "Carte Interactive",
                labelKey: "nav.projects.map",
                href: "/map",
                icon: Map,
                description: "Par région/pays/statut",
            },
            {
                label: "Liste des Projets",
                labelKey: "nav.projects.list",
                href: "/projects",
                icon: FileText,
                description: "Fiches normalisées",
            },
            {
                label: "Soumettre un Projet",
                labelKey: "nav.projects.submit",
                href: "/submit",
                icon: FileText,
                description: "Formulaire de soumission",
                roles: [
                    "contributor",
                    "editor",
                    "country_admin",
                    "super_admin",
                ],
            },
            {
                label: "Mes Projets",
                labelKey: "nav.projects.my",
                href: "/my-contributions",
                icon: FileText,
                description: "Suivi personnel",
                roles: [
                    "reader",
                    "contributor",
                    "editor",
                    "country_admin",
                    "super_admin",
                ],
            },
        ],
    },
    {
        id: "resources",
        label: "Ressources",
        labelKey: "nav.resources",
        icon: BookOpen,
        highlight: false,
        submenu: [
            {
                label: "Bibliothèque",
                labelKey: "nav.resources.library",
                href: "/resources",
                icon: BookOpen,
                description: "Guides, Rapports, Bulletins",
            },
            {
                label: "Politiques & Cadres",
                labelKey: "nav.resources.policies",
                href: "/strategies",
                icon: FileText,
                description: "Documents réglementaires",
            },
            {
                label: "Modèles & Formulaires",
                labelKey: "nav.resources.templates",
                href: "/agency-documents",
                icon: FileText,
                description: "Téléchargement",
                roles: [
                    "reader",
                    "contributor",
                    "editor",
                    "country_admin",
                    "super_admin",
                ],
            },
        ],
    },
    {
        id: "community",
        label: "Communauté",
        labelKey: "nav.community",
        icon: Users,
        highlight: false,
        submenu: [
            {
                label: "Forum de Discussion",
                labelKey: "nav.community.forum",
                href: "/forum",
                icon: MessageSquare,
                description: "Thématiques",
                roles: [
                    "reader",
                    "contributor",
                    "editor",
                    "country_admin",
                    "super_admin",
                ],
            },
            {
                label: "Annuaire",
                labelKey: "nav.community.directory",
                href: "/members",
                icon: Users,
                description: "Agences & Points Focaux",
                roles: [
                    "reader",
                    "contributor",
                    "editor",
                    "country_admin",
                    "super_admin",
                ],
            },
            {
                label: "Co-rédaction",
                labelKey: "nav.community.coauthoring",
                href: "/coauthoring",
                icon: FileText,
                description: "Espace collaboratif",
                roles: [
                    "contributor",
                    "editor",
                    "country_admin",
                    "super_admin",
                ],
            },
        ],
    },
    {
        id: "training",
        label: "Formation",
        labelKey: "nav.training",
        icon: GraduationCap,
        highlight: false,
        submenu: [
            {
                label: "Catalogue",
                labelKey: "nav.training.catalog",
                href: "/elearning",
                icon: GraduationCap,
                description: "Webinaires & Sessions",
            },
            {
                label: "E-Learning",
                labelKey: "nav.training.elearning",
                href: "/elearning",
                icon: Video,
                description: "Modules en différé",
            },
            {
                label: "Mes Inscriptions",
                labelKey: "nav.training.my",
                href: "/events",
                icon: Calendar,
                description: "Suivi",
                roles: [
                    "reader",
                    "contributor",
                    "editor",
                    "country_admin",
                    "super_admin",
                ],
            },
        ],
    },
    {
        id: "agenda",
        label: "Agenda",
        labelKey: "nav.agenda",
        icon: Calendar,
        highlight: false,
        submenu: [
            {
                label: "Calendrier",
                labelKey: "nav.agenda.calendar",
                href: "/events",
                icon: Calendar,
                description: "Événements & Deadlines",
            },
            {
                label: "CMDT-25",
                labelKey: "nav.agenda.cmdt25",
                href: "/events?cmdt25=true",
                icon: Calendar,
                description: "Section dédiée & échéances",
            },
        ],
    },
    {
        id: "watch",
        label: "Veille",
        labelKey: "nav.watch",
        icon: Rss,
        highlight: false,
        submenu: [
            {
                label: "Actualités",
                labelKey: "nav.watch.news",
                href: "/watch",
                icon: Rss,
                description: "News FSU/TIC",
            },
            {
                label: "Flux RSS",
                labelKey: "nav.watch.rss",
                href: "/watch",
                icon: Rss,
                description: "UIT, Smart Africa, UA",
            },
        ],
    },
    {
        id: "dashboard",
        label: "Tableau de Bord",
        labelKey: "nav.dashboard",
        href: "/public-dashboard",
        icon: BarChart3,
        highlight: true,
        submenu: [
            {
                label: "Statistiques Publiques",
                labelKey: "nav.dashboard.stats",
                href: "/public-dashboard",
                icon: BarChart3,
                description: "Couverture, Projets, Impact",
            },
        ],
    },
]

// ============================================================
// MENU MON COMPTE (Connectés uniquement)
// ============================================================

export const accountMenu: NavItem[] = [
    {
        id: "profile",
        label: "Profil",
        labelKey: "nav.profile",
        href: "/profile",
        icon: User,
        roles: [
            "reader",
            "contributor",
            "editor",
            "country_admin",
            "super_admin",
        ],
    },
    {
        id: "security",
        label: "Sécurité",
        labelKey: "nav.security",
        href: "/security",
        icon: Shield,
        roles: [
            "reader",
            "contributor",
            "editor",
            "country_admin",
            "super_admin",
        ],
    },
    {
        id: "preferences",
        label: "Notifications",
        labelKey: "nav.preferences",
        href: "/preferences",
        icon: Settings,
        roles: [
            "reader",
            "contributor",
            "editor",
            "country_admin",
            "super_admin",
        ],
    },
    {
        id: "admin",
        label: "Administration",
        labelKey: "nav.admin",
        href: "/admin",
        icon: Shield,
        roles: ["country_admin", "super_admin"],
        highlight: true,
    },
    {
        id: "logout",
        label: "Déconnexion",
        labelKey: "nav.logout",
        icon: LogOut,
        roles: [
            "reader",
            "contributor",
            "editor",
            "country_admin",
            "super_admin",
        ],
    },
]

// Labels de navigation pour les sidebars
export const sidebarLabels = {
    home: "Accueil",
    projects: "Projets",
    resources: "Ressources",
    community: "Communauté",
    training: "Formation",
    agenda: "Agenda",
    watch: "Veille",
    dashboard: "Tableau de Bord",
}
