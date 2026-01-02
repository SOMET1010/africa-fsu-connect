import {
  Globe,
  Users,
  Handshake,
  Rocket,
  Lightbulb,
  Plus,
  MessageSquare,
  GraduationCap,
  BookOpen,
  Calendar,
  Video,
  Info,
  Map,
  Activity,
  LucideIcon
} from "lucide-react";

export interface NavSubItem {
  label: string;
  labelKey?: string;
  href: string;
  icon: LucideIcon;
  description: string;
  descriptionKey?: string;
}

export interface NavItem {
  id: string;
  label: string;
  labelKey?: string;
  href?: string;
  icon: LucideIcon;
  highlight?: boolean;
  submenu?: NavSubItem[];
}

// ============================================================
// NOUVELLE NAVIGATION PAR COUCHES - ARCHITECTURE UX REFONDÉE
// ============================================================
// Principe : 1 couche = 1 intention utilisateur
// Couche 1 : RÉSEAU (visible par défaut)
// Couche 2 : COLLABORATION (sur intention)
// Couche 3 : OPÉRATIONNEL (isolée, mode avancé)
// ============================================================

export const mainNavigation: NavItem[] = [
  { 
    id: 'network',
    label: 'Réseau', 
    labelKey: 'nav.network',
    icon: Globe,
    highlight: true,
    submenu: [
      { 
        label: 'Vue Réseau', 
        labelKey: 'nav.network.view',
        href: '/network', 
        icon: Globe, 
        description: 'Coordination collective SUTEL' 
      },
      { 
        label: 'Pays membres', 
        labelKey: 'nav.network.members',
        href: '/members', 
        icon: Users, 
        description: 'Annuaire du réseau' 
      },
      { 
        label: 'Carte du réseau', 
        labelKey: 'nav.network.map',
        href: '/map', 
        icon: Map, 
        description: 'Visualisation géographique' 
      },
      { 
        label: 'Activité récente', 
        labelKey: 'nav.network.activity',
        href: '/activity', 
        icon: Activity, 
        description: 'Ce qui se passe dans le réseau' 
      },
    ]
  },
  { 
    id: 'collaborate',
    label: 'Collaborer', 
    labelKey: 'nav.collaborate',
    icon: Handshake,
    highlight: false,
    submenu: [
      { 
        label: 'Projets inspirants', 
        labelKey: 'nav.collaborate.projects',
        href: '/projects', 
        icon: Rocket, 
        description: 'Découvrir ce qui marche' 
      },
      { 
        label: 'Bonnes pratiques', 
        labelKey: 'nav.collaborate.practices',
        href: '/practices', 
        icon: Lightbulb, 
        description: 'Partage d\'expériences' 
      },
      { 
        label: 'Proposer un projet', 
        labelKey: 'nav.collaborate.submit',
        href: '/submit', 
        icon: Plus, 
        description: 'Partager une initiative' 
      },
      { 
        label: 'Discussions', 
        labelKey: 'nav.collaborate.discussions',
        href: '/forum', 
        icon: MessageSquare, 
        description: 'Échanger avec le réseau' 
      },
    ]
  },
  { 
    id: 'learn',
    label: 'Apprendre', 
    labelKey: 'nav.learn',
    icon: GraduationCap,
    highlight: false,
    submenu: [
      { 
        label: 'E-Learning', 
        labelKey: 'nav.learn.elearning',
        href: '/elearning', 
        icon: BookOpen, 
        description: 'Formations en ligne' 
      },
      { 
        label: 'Événements', 
        labelKey: 'nav.learn.events',
        href: '/events', 
        icon: Calendar, 
        description: 'Agenda collaboratif' 
      },
      { 
        label: 'Webinaires', 
        labelKey: 'nav.learn.webinars',
        href: '/webinars', 
        icon: Video, 
        description: 'Sessions en direct' 
      },
    ]
  },
  { 
    id: 'library',
    label: 'Bibliothèque', 
    labelKey: 'nav.library',
    href: '/resources', 
    icon: BookOpen,
    highlight: false 
  },
  { 
    id: 'about',
    label: 'À propos', 
    labelKey: 'nav.about',
    href: '/about', 
    icon: Info,
    highlight: false 
  },
];

// Labels de navigation pour les sidebars
export const sidebarLabels = {
  network: "Réseau SUTEL",
  members: "Pays membres",
  projects: "Projets inspirants",
  resources: "Bibliothèque",
  forum: "Discussions",
  submit: "Proposer un projet",
  events: "Événements",
  elearning: "E-Learning",
};
