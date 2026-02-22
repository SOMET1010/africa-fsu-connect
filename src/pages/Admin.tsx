import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";
import { useAdminOnboarding } from "@/hooks/useAdminOnboarding";
import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Users, FileText, MessageSquare, Calendar, Globe, Rocket,
  Settings, Shield, BookOpen, MapPin, Flag, AlertTriangle,
  ExternalLink, Clock, ArrowRight, TrendingUp, Layout, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import "@/styles/driver-rtl.css";

// ─── i18n labels ───────────────────────────────────────────────

const LABELS: Record<string, Record<string, string>> = {
  title:            { fr: "Administration", en: "Administration", ar: "الإدارة", pt: "Administração" },
  subtitle:         { fr: "Tableau de bord administrateur", en: "Admin dashboard", ar: "لوحة القيادة", pt: "Painel de administração" },
  kpis:             { fr: "Indicateurs clés", en: "Key indicators", ar: "المؤشرات الرئيسية", pt: "Indicadores-chave" },
  shortcuts:        { fr: "Accès rapide", en: "Quick access", ar: "وصول سريع", pt: "Acesso rápido" },
  activity:         { fr: "Activité récente", en: "Recent activity", ar: "النشاط الأخير", pt: "Atividade recente" },
  alerts:           { fr: "Alertes & modération", en: "Alerts & moderation", ar: "التنبيهات والإشراف", pt: "Alertas e moderação" },
  users:            { fr: "Utilisateurs", en: "Users", ar: "المستخدمون", pt: "Utilizadores" },
  documents:        { fr: "Documents", en: "Documents", ar: "الوثائق", pt: "Documentos" },
  events:           { fr: "Événements", en: "Events", ar: "الفعاليات", pt: "Eventos" },
  projects:         { fr: "Projets", en: "Projects", ar: "المشاريع", pt: "Projetos" },
  countries:        { fr: "Pays actifs", en: "Active countries", ar: "الدول النشطة", pt: "Países ativos" },
  submissions:      { fr: "Soumissions", en: "Submissions", ar: "التقديمات", pt: "Submissões" },
  pending:          { fr: "En attente", en: "Pending", ar: "قيد الانتظار", pt: "Pendente" },
  noAlerts:         { fr: "Aucune alerte active", en: "No active alerts", ar: "لا توجد تنبيهات نشطة", pt: "Nenhum alerta ativo" },
  noActivity:       { fr: "Aucune activité récente", en: "No recent activity", ar: "لا يوجد نشاط حديث", pt: "Nenhuma atividade recente" },
  unresolvedAlerts: { fr: "Alertes non résolues", en: "Unresolved alerts", ar: "تنبيهات غير محلولة", pt: "Alertas não resolvidos" },
  forumPosts:       { fr: "Discussions forum", en: "Forum discussions", ar: "مناقشات المنتدى", pt: "Discussões do fórum" },
};

const l = (key: string, lang: string) => LABELS[key]?.[lang] ?? LABELS[key]?.fr ?? key;

// ─── Admin shortcuts by role ──────────────────────────────────

interface Shortcut {
  label: Record<string, string>;
  href: string;
  icon: React.ElementType;
  roles: string[];
  description: Record<string, string>;
}

const SHORTCUTS: Shortcut[] = [
  {
    label: { fr: "Gestion contenu", en: "Content management", ar: "إدارة المحتوى", pt: "Gestão de conteúdo" },
    href: "/admin/content",
    icon: Layout,
    roles: ["super_admin", "admin_pays", "editeur"],
    description: { fr: "CMS, navigation, paramètres", en: "CMS, navigation, settings", ar: "نظام إدارة المحتوى", pt: "CMS, navegação, configurações" },
  },
  {
    label: { fr: "Utilisateurs", en: "Users", ar: "المستخدمون", pt: "Utilizadores" },
    href: "/admin/users",
    icon: Users,
    roles: ["super_admin", "admin_pays"],
    description: { fr: "Rôles, permissions, comptes", en: "Roles, permissions, accounts", ar: "الأدوار والصلاحيات", pt: "Funções, permissões, contas" },
  },
  {
    label: { fr: "Points focaux", en: "Focal points", ar: "نقاط الاتصال", pt: "Pontos focais" },
    href: "/admin/focal-points",
    icon: Flag,
    roles: ["super_admin", "admin_pays"],
    description: { fr: "Correspondants nationaux", en: "National correspondents", ar: "المراسلون الوطنيون", pt: "Correspondentes nacionais" },
  },
  {
    label: { fr: "Ressources", en: "Resources", ar: "الموارد", pt: "Recursos" },
    href: "/admin/resources",
    icon: BookOpen,
    roles: ["super_admin", "admin_pays", "editeur"],
    description: { fr: "Documents et bibliothèque", en: "Documents & library", ar: "الوثائق والمكتبة", pt: "Documentos e biblioteca" },
  },
  {
    label: { fr: "Forum", en: "Forum", ar: "المنتدى", pt: "Fórum" },
    href: "/admin/forum",
    icon: MessageSquare,
    roles: ["super_admin", "admin_pays"],
    description: { fr: "Modération des discussions", en: "Discussion moderation", ar: "إدارة النقاشات", pt: "Moderação de discussões" },
  },
  {
    label: { fr: "Config plateforme", en: "Platform config", ar: "إعدادات المنصة", pt: "Config. plataforma" },
    href: "/admin/platform-config",
    icon: Settings,
    roles: ["super_admin"],
    description: { fr: "Identité, modules, langues", en: "Identity, modules, languages", ar: "الهوية والوحدات واللغات", pt: "Identidade, módulos, idiomas" },
  },
  {
    label: { fr: "Tableau de pilotage", en: "Analytics dashboard", ar: "لوحة التحليلات", pt: "Painel analítico" },
    href: "/admin/dashboard",
    icon: TrendingUp,
    roles: ["super_admin", "admin_pays"],
    description: { fr: "Métriques et KPIs détaillés", en: "Detailed metrics & KPIs", ar: "المقاييس التفصيلية", pt: "Métricas e KPIs detalhados" },
  },
  {
    label: { fr: "Sécurité", en: "Security", ar: "الأمان", pt: "Segurança" },
    href: "/security",
    icon: Shield,
    roles: ["super_admin", "admin_pays"],
    description: { fr: "Audit, sessions, anomalies", en: "Audit, sessions, anomalies", ar: "التدقيق والجلسات", pt: "Auditoria, sessões, anomalias" },
  },
];

// ─── Component ────────────────────────────────────────────────

const Admin = () => {
  const { profile } = useAuth();
  const { currentLanguage } = useTranslation();
  const { isRTL } = useDirection();
  const { resetTour } = useAdminOnboarding();
  const lang = currentLanguage || "fr";
  const userRole = profile?.role ?? "lecteur";

  // ── Live KPI queries (parallel) ──
  const { data: userCount = 0, isLoading: loadingUsers } = useQuery({
    queryKey: ["admin-kpi-users"],
    queryFn: async () => {
      const { count, error } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: docCount = 0, isLoading: loadingDocs } = useQuery({
    queryKey: ["admin-kpi-documents"],
    queryFn: async () => {
      const { count, error } = await supabase.from("documents").select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: eventCount = 0, isLoading: loadingEvents } = useQuery({
    queryKey: ["admin-kpi-events"],
    queryFn: async () => {
      const { count, error } = await supabase.from("events").select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: countryCount = 0 } = useQuery({
    queryKey: ["admin-kpi-countries"],
    queryFn: async () => {
      const { count, error } = await supabase.from("countries").select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
    staleTime: 10 * 60 * 1000,
  });

  const { data: projectCount = 0 } = useQuery({
    queryKey: ["admin-kpi-projects"],
    queryFn: async () => {
      const { count, error } = await supabase.from("agency_projects").select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: forumCount = 0 } = useQuery({
    queryKey: ["admin-kpi-forum"],
    queryFn: async () => {
      const { count, error } = await supabase.from("forum_posts").select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
    staleTime: 5 * 60 * 1000,
  });

  // ── Recent activity ──
  const { data: recentActivity = [] } = useQuery({
    queryKey: ["admin-recent-activity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("id, action_type, resource_type, created_at, details")
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 2 * 60 * 1000,
  });

  // ── Unresolved alerts ──
  const { data: unresolvedAlerts = [] } = useQuery({
    queryKey: ["admin-unresolved-alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("anomaly_alerts")
        .select("id, type, severity, message, created_at")
        .eq("resolved", false)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 2 * 60 * 1000,
    enabled: ["super_admin", "admin_pays"].includes(userRole),
  });

  const isLoading = loadingUsers || loadingDocs || loadingEvents;

  // ── KPIs ──
  const kpis = [
    { label: l("users", lang), value: userCount, icon: Users, color: "text-blue-500" },
    { label: l("documents", lang), value: docCount, icon: FileText, color: "text-emerald-500" },
    { label: l("events", lang), value: eventCount, icon: Calendar, color: "text-amber-500" },
    { label: l("countries", lang), value: countryCount, icon: Globe, color: "text-violet-500" },
    { label: l("projects", lang), value: projectCount, icon: Rocket, color: "text-rose-500" },
    { label: l("forumPosts", lang), value: forumCount, icon: MessageSquare, color: "text-cyan-500" },
  ];

  // ── Filtered shortcuts ──
  const filteredShortcuts = useMemo(
    () => SHORTCUTS.filter((s) => s.roles.includes(userRole)),
    [userRole]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <PageHeader title={l("title", lang)} description={l("subtitle", lang)} badge="Admin" gradient />
        <PageContainer>
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", isRTL && "text-right")}>
      <PageHeader
        title={l("title", lang)}
        description={l("subtitle", lang)}
        badge="Admin"
        gradient
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={resetTour} title="Tour">
              <HelpCircle className="h-4 w-4" />
            </Button>
            <div data-tour="lang-selector">
              <LanguageSelector variant="outline" size="sm" showLabel />
            </div>
          </div>
        }
      />

      <PageContainer>
        <div className="space-y-8">
          {/* ── KPI Grid ── */}
          <section data-tour="kpis">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              {l("kpis", lang)}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {kpis.map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <GlassCard
                    key={i}
                    variant="default"
                    className="p-4 transition-all hover:shadow-lg hover:shadow-primary/5 group animate-fade-in"
                    style={{ animationDelay: `${i * 60}ms` } as React.CSSProperties}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={cn("p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors", kpi.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      <AnimatedCounter value={kpi.value} />
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
                  </GlassCard>
                );
              })}
            </div>
          </section>

          {/* ── Shortcuts ── */}
          <section data-tour="shortcuts">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              {l("shortcuts", lang)}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredShortcuts.map((shortcut) => {
                const Icon = shortcut.icon;
                return (
                  <Link key={shortcut.href} to={shortcut.href}>
                    <GlassCard variant="default" className="p-4 hover:shadow-md hover:border-primary/20 transition-all group cursor-pointer h-full">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors shrink-0">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {shortcut.label[lang] ?? shortcut.label.fr}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {shortcut.description[lang] ?? shortcut.description.fr}
                          </p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0 mt-1" />
                      </div>
                    </GlassCard>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── Bottom row: Activity + Alerts ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <section data-tour="activity">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                {l("activity", lang)}
              </h2>
              <GlassCard variant="default" className="p-0 divide-y divide-border">
                {recentActivity.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    {l("noActivity", lang)}
                  </div>
                ) : (
                  recentActivity.map((log: any) => (
                    <div key={log.id} className="px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors">
                      <div className="p-1.5 rounded bg-muted shrink-0">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">
                          <span className="font-medium">{log.action_type}</span>
                          {log.resource_type && (
                            <span className="text-muted-foreground"> — {log.resource_type}</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.created_at).toLocaleString(lang === "ar" ? "ar-EG" : lang === "pt" ? "pt-BR" : lang, {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </GlassCard>
            </section>

            {/* Alerts & Moderation */}
            {["super_admin", "admin_pays"].includes(userRole) && (
              <section data-tour="alerts">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  {l("alerts", lang)}
                </h2>
                <GlassCard variant="default" className="p-0 divide-y divide-border">
                  {unresolvedAlerts.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      <Shield className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      {l("noAlerts", lang)}
                    </div>
                  ) : (
                    unresolvedAlerts.map((alert: any) => (
                      <div key={alert.id} className="px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors">
                        <div className={cn(
                          "p-1.5 rounded shrink-0",
                          alert.severity === "critical" ? "bg-destructive/10" :
                          alert.severity === "high" ? "bg-orange-500/10" : "bg-amber-500/10"
                        )}>
                          <AlertTriangle className={cn(
                            "h-3.5 w-3.5",
                            alert.severity === "critical" ? "text-destructive" :
                            alert.severity === "high" ? "text-orange-500" : "text-amber-500"
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{alert.message}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {alert.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(alert.created_at).toLocaleDateString(lang)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {unresolvedAlerts.length > 0 && (
                    <div className="p-3">
                      <Button asChild variant="ghost" size="sm" className="w-full text-xs">
                        <Link to="/security">
                          {l("unresolvedAlerts", lang)} ({unresolvedAlerts.length})
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </GlassCard>
              </section>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default Admin;
