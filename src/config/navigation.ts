import {
  Home,
  BarChart2,
  BarChart3,
  Rocket,
  FolderOpen,
  BookOpen,
  MessageSquare,
  FileText,
  Calendar,
  Plus,
  Users,
  LayoutDashboard,
  Flag,
  LucideIcon
} from "lucide-react";

export interface NavSubItem {
  label: string;
  labelKey?: string;
  href: string;
  icon: LucideIcon;
  description: string;
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

// Navigation principale simplifiée (5 items max)
export const mainNavigation: NavItem[] = [
  { 
    id: 'home',
    label: 'Accueil', 
    labelKey: 'nav.home',
    href: '/', 
    icon: Home,
    highlight: false 
  },
  { 
    id: 'piloting',
    label: 'Pilotage', 
    labelKey: 'nav.piloting',
    icon: BarChart2,
    highlight: true,
    submenu: [
      { 
        label: "Vue réseau", 
        labelKey: 'nav.impact.view',
        href: '/dashboard', 
        icon: LayoutDashboard, 
        description: 'Coordination collective' 
      },
      { 
        label: 'Mon pays', 
        labelKey: 'nav.my.country',
        href: '/my-country', 
        icon: Flag, 
        description: 'Vue privée de mon FSU' 
      },
      { 
        label: 'Analytics', 
        labelKey: 'nav.analytics',
        href: '/analytics', 
        icon: BarChart3, 
        description: 'Analyses détaillées' 
      },
    ]
  },
  { 
    id: 'projects',
    label: 'Projets FSU', 
    labelKey: 'nav.projects.fsu',
    icon: Rocket,
    highlight: false,
    submenu: [
      { 
        label: 'Tous les projets', 
        labelKey: 'nav.all.projects',
        href: '/projects', 
        icon: FolderOpen, 
        description: 'Explorer les projets' 
      },
      { 
        label: 'Soumettre un projet', 
        labelKey: 'nav.submit.project',
        href: '/submit', 
        icon: Plus, 
        description: 'Nouvelle initiative' 
      },
      { 
        label: 'Note conceptuelle', 
        labelKey: 'nav.concept.note',
        href: '/concept-note', 
        icon: FileText, 
        description: 'Préparer une note' 
      },
    ]
  },
  { 
    id: 'community',
    label: 'Communauté', 
    labelKey: 'nav.community',
    icon: Users,
    highlight: false,
    submenu: [
      { 
        label: 'Discussions', 
        labelKey: 'nav.discussions',
        href: '/forum', 
        icon: MessageSquare, 
        description: "Forum d'échange" 
      },
      { 
        label: 'Événements', 
        labelKey: 'nav.events',
        href: '/events', 
        icon: Calendar, 
        description: 'Agenda collaboratif' 
      },
    ]
  },
  { 
    id: 'resources',
    label: 'Bibliothèque', 
    labelKey: 'nav.library',
    href: '/resources', 
    icon: BookOpen,
    highlight: false 
  },
];

// Labels de navigation modernisés pour les sidebars
export const sidebarLabels = {
  dashboard: "Vue d'impact",
  projects: "Projets FSU",
  resources: "Bibliothèque",
  forum: "Communauté",
  submit: "Soumettre un projet",
  events: "Événements",
  indicators: "Indicateurs",
  organizations: "Organisations",
};
