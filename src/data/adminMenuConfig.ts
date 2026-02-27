import type { ComponentType } from "react";
import {
  BarChart3,
  BookOpen,
  Calendar,
  GraduationCap,
  MessageCircle,
  PieChart,
  Plug,
  Rss,
  Shield,
  ShieldCheck,
  Settings,
  Users,
} from "lucide-react";
import { USER_ROLE_LABELS } from "@/types/userRole";
import type { UserRole } from "@/types/userRole";

const FEATURE_BASE_PATH = "/admin/features";
const ADMIN_PLUS_ROLES: UserRole[] = ["super_admin", "country_admin", "editor"];
const SUPER_ADMIN_ONLY: UserRole[] = ["super_admin"];

interface BaseFeature {
  id: string;
  title: string;
  description: string;
  roles: UserRole[];
  cdcRef: string;
  tables?: string[];
  actions?: string[];
  icon: ComponentType<any>;
}

export interface AdminMenuFeature extends BaseFeature {
  sectionId: string;
  path: string;
}

export interface AdminMenuSection {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<any>;
  items: BaseFeature[];
}

export const ADMIN_MENU_SECTIONS: AdminMenuSection[] = [
  {
    id: "admin",
    title: "ADMIN (Back Office)",
    description: "Pilotage complet du back-office : KPI, contenus, modération, intégrations et paramètres.",
    icon: Shield,
    items: [
      {
        id: "admin-dashboard",
        title: "Dashboard",
        description: "Vue globale, KPIs et alertes en temps réel.",
        roles: ADMIN_PLUS_ROLES,
        cdcRef: "4.2",
        tables: ["admin_activity_stream", "admin_alerts", "admin_export_jobs", "performance_metrics"],
        actions: ["Comparer les rapports mensuels", "Partager le résumé avec les équipes"],
        icon: BarChart3,
      },
      {
        id: "admin-users",
        title: "Utilisateurs",
        description: "Gestion complète des comptes, rôles et validations.",
        roles: SUPER_ADMIN_ONLY,
        cdcRef: "4.2",
        tables: ["profiles", "role_permissions", "admin_account_validations", "focal_points"],
        actions: ["Attribuer un rôle institutionnel", "Approuver les nouvelles inscriptions"],
        icon: Users,
      },
      {
        id: "admin-contents",
        title: "Contenus",
        description: "Validation des projets, documents et publications.",
        roles: ADMIN_PLUS_ROLES,
        cdcRef: "4.2",
        tables: ["agency_projects", "documents", "document_versions", "document_comments", "admin_watch_sources"],
        actions: ["Piloter les workflows éditoriaux", "Prioriser les contributions stratégiques"],
        icon: BookOpen,
      },
      {
        id: "admin-moderation",
        title: "Modération",
        description: "Surveillance des forums, signalements et blocages.",
        roles: ADMIN_PLUS_ROLES,
        cdcRef: "4.2",
        tables: ["forum_posts", "forum_replies", "admin_alerts", "admin_activity_stream"],
        actions: ["Modérer les discussions sensibles", "Suspendre les contenus non conformes"],
        icon: ShieldCheck,
      },
      {
        id: "admin-training",
        title: "Formation",
        description: "Catalogue, participants et certifications des sessions.",
        roles: ADMIN_PLUS_ROLES,
        cdcRef: "4.1",
        tables: ["training_courses", "training_participants", "training_certifications", "presentation_sessions"],
        actions: ["Programmer les webinaires", "Valider les attestations diplômantes"],
        icon: GraduationCap,
      },
      {
        id: "admin-statistics",
        title: "Statistiques",
        description: "Indicateurs d'utilisation, projets, export de données.",
        roles: ADMIN_PLUS_ROLES,
        cdcRef: "4.2",
        tables: ["admin_support_tickets", "agency_projects", "admin_export_jobs"],
        actions: ["Comparer les exports CSV/JSON/PDF", "Suivre l'usage par pays"],
        icon: PieChart,
      },
      {
        id: "admin-calendar",
        title: "Calendrier",
        description: "Événements, échéances CMDT et rappels automatisés.",
        roles: ADMIN_PLUS_ROLES,
        cdcRef: "4.1",
        tables: ["events", "admin_calendar_deadlines", "admin_calendar_reminders"],
        actions: ["Planifier les deadlines CMDT-25", "Configurer les notifications"],
        icon: Calendar,
      },
      {
        id: "admin-watch",
        title: "Veille",
        description: "Sources RSS externes et règles d'alertes avancées.",
        roles: ADMIN_PLUS_ROLES,
        cdcRef: "4.1",
        tables: ["admin_watch_sources", "admin_alert_rules"],
        actions: ["Relier les flux UIT/Smart Africa", "Déclarer les alertes techniques"],
        icon: Rss,
      },
      {
        id: "admin-integrations",
        title: "API & Intégrations",
        description: "Cartographie et connecteurs aux services externes.",
        roles: SUPER_ADMIN_ONLY,
        cdcRef: "4.2",
        tables: ["admin_map_configurations", "admin_connectors"],
        actions: ["Configurer Leaflet/Mapbox", "Activer les connecteurs statistics et SSO"],
        icon: Plug,
      },
      {
        id: "admin-support",
        title: "Support",
        description: "Messagerie, tickets et FAQ du support technique.",
        roles: ADMIN_PLUS_ROLES,
        cdcRef: "4.2",
        tables: ["admin_internal_messages", "admin_support_tickets", "admin_support_faq"],
        actions: ["Répondre aux anomalies remontées", "Actualiser la base de connaissance"],
        icon: MessageCircle,
      },
      {
        id: "admin-settings",
        title: "Paramètres",
        description: "Identité, sécurité, sauvegardes et conformité RGPD.",
        roles: SUPER_ADMIN_ONLY,
        cdcRef: "5",
        tables: ["site_settings", "admin_security_policies", "admin_backups", "admin_data_requests"],
        actions: ["Gérer l'identité plateforme", "Auditer la conformité et les backups"],
        icon: Settings,
      },
    ],
  },
];

export const ADMIN_MENU_FEATURES: AdminMenuFeature[] = ADMIN_MENU_SECTIONS.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    sectionId: section.id,
    path: `${FEATURE_BASE_PATH}/${item.id}`,
  }))
);

export const ADMIN_FEATURE_MAP: Record<string, AdminMenuFeature> = ADMIN_MENU_FEATURES.reduce(
  (acc, feature) => {
    acc[feature.id] = feature;
    return acc;
  },
  {} as Record<string, AdminMenuFeature>
);

export const ADMIN_FEATURE_SECTION_TITLE = (feature: AdminMenuFeature) =>
  ADMIN_MENU_SECTIONS.find((section) => section.id === feature.sectionId)?.title ?? "Administration";

export const ADMIN_ROLE_LABELS = USER_ROLE_LABELS;
