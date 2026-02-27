import type { ComponentType } from "react";
import {
  BarChart3,
  BookOpen,
  Calendar,
  GraduationCap,
  MessageCircle,
  PieChart,
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

// ============================================================
// MENU ADMINISTRATION (BACK OFFICE)
// Accessible selon les droits : Administrateur, Super Admin (ANSUT/UAT)
// ============================================================

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
        description: "Vue synthétique (Activité, Publications, Inscriptions), Alertes système & modération.",
        roles: ADMIN_PLUS_ROLES,
        cdcRef: "4.2",
        tables: ["admin_activity_stream", "admin_alerts", "admin_export_jobs", "performance_metrics"],
        actions: ["Comparer les rapports mensuels", "Partager le résumé avec les équipes"],
        icon: BarChart3,
      },
      {
        id: "admin-users",
        title: "Utilisateurs",
        description: "Gestion des Comptes (CRUD), Rôles & Permissions, Validation Inscriptions, Répertoire Points Focaux.",
        roles: SUPER_ADMIN_ONLY,
        cdcRef: "4.2",
        tables: ["profiles", "role_permissions", "admin_account_validations", "focal_points"],
        actions: ["Attribuer un rôle institutionnel", "Approuver les nouvelles inscriptions"],
        icon: Users,
      },
      {
        id: "admin-contents",
        title: "Contenus",
        description: "Validation Projets (Workflow éditorial), Gestion Documents, Actualités & Newsletters.",
        roles: ADMIN_PLUS_ROLES,
        cdcRef: "4.2",
        tables: ["agency_projects", "documents", "document_versions", "document_comments", "admin_watch_sources"],
        actions: ["Piloter les workflows éditoriaux", "Prioriser les contributions stratégiques"],
        icon: BookOpen,
      },
      {
        id: "admin-moderation",
        title: "Modération",
        description: "Forums & Commentaires (Validation/Blocage), Signalements, Utilisateurs Bannis.",
        roles: ADMIN_PLUS_ROLES,
        cdcRef: "4.2",
        tables: ["forum_posts", "forum_replies", "admin_alerts", "admin_activity_stream"],
        actions: ["Modérer les discussions sensibles", "Suspendre les contenus non conformes"],
        icon: ShieldCheck,
      },
      {
        id: "admin-statistics",
        title: "Statistiques",
        description: "Analyse d'Audience, Reporting Projets (Export CSV/PDF), Impact Formation.",
        roles: ADMIN_PLUS_ROLES,
        cdcRef: "4.2",
        tables: ["admin_support_tickets", "agency_projects", "admin_export_jobs"],
        actions: ["Comparer les exports CSV/JSON/PDF", "Suivre l'usage par pays"],
        icon: PieChart,
      },
      {
        id: "admin-training",
        title: "Formation",
        description: "Gestion Catalogue (Création sessions), Participants, Certificats (Génération).",
        roles: ADMIN_PLUS_ROLES,
        cdcRef: "4.1",
        tables: ["training_courses", "training_participants", "training_certifications", "presentation_sessions"],
        actions: ["Programmer les webinaires", "Valider les attestations diplômantes"],
        icon: GraduationCap,
      },
      {
        id: "admin-calendar",
        title: "Agenda",
        description: "Gestion Événements (Création/Modification), CMDT-25 (Configuration échéances).",
        roles: ADMIN_PLUS_ROLES,
        cdcRef: "4.1",
        tables: ["events", "admin_calendar_deadlines", "admin_calendar_reminders"],
        actions: ["Planifier les deadlines CMDT-25", "Configurer les notifications"],
        icon: Calendar,
      },
      {
        id: "admin-support",
        title: "Support",
        description: "Messagerie Interne (Admin ↔ Utilisateurs), Tickets & Anomalies, FAQ.",
        roles: ADMIN_PLUS_ROLES,
        cdcRef: "4.2",
        tables: ["admin_internal_messages", "admin_support_tickets", "admin_support_faq"],
        actions: ["Répondre aux anomalies remontées", "Actualiser la base de connaissance"],
        icon: MessageCircle,
      },
      {
        id: "admin-settings",
        title: "Paramètres",
        description: "Général (Langues, Logos, Couleurs), Sécurité (Logs, Sessions, RGPD), API & Intégrations, Sauvegardes.",
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
