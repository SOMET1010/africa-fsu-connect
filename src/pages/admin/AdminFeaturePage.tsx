import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  ADMIN_FEATURE_MAP,
  ADMIN_FEATURE_SECTION_TITLE,
  ADMIN_ROLE_LABELS,
} from "@/data/adminMenuConfig";
import { useAdminOverviewCounts } from "@/hooks/useAdminOverviewCounts";

const AdminFeaturePage = () => {
  const { featureId } = useParams<{ featureId: string }>();
  const feature = featureId ? ADMIN_FEATURE_MAP[featureId] : undefined;
  const { data: counts, isLoading } = useAdminOverviewCounts();

  if (!feature) {
    return (
      <AdminLayout>
        <PageHeader
          title="Fonctionnalité introuvable"
          description="Cette entrée du menu d'administration n'est pas encore configurée."
        />
        <PageContainer>
          <GlassCard className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Vérifiez le lien dans la barre latérale, ou contactez l'équipe technique pour
              ajouter la fonctionnalité correspondante.
            </p>
          </GlassCard>
        </PageContainer>
      </AdminLayout>
    );
  }

  const sectionTitle = ADMIN_FEATURE_SECTION_TITLE(feature);

  return (
    <AdminLayout>
      <PageHeader
        title={feature.title}
        description={feature.description}
        badge={sectionTitle}
        gradient
      />
      <PageContainer>
        <div className="space-y-6">
          <GlassCard className="space-y-4 p-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs font-semibold">
                CDC {feature.cdcRef}
              </Badge>
              {feature.roles.map((role) => (
                <Badge key={role} variant="secondary" className="text-[10px] font-semibold">
                  {ADMIN_ROLE_LABELS[role]}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </GlassCard>

          {feature.tables && feature.tables.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {feature.tables.map((table) => (
                <GlassCard key={table} className="p-4 space-y-2">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{table}</p>
                  <p className="text-3xl font-semibold">
                    {isLoading ? "..." : counts?.[table] ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Données enregistrées dans la table <code>{table}</code>
                  </p>
                </GlassCard>
              ))}
            </div>
          )}

          {feature.actions && feature.actions.length > 0 && (
            <GlassCard className="p-6 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Actions recommandées
              </h3>
              <ul className="space-y-1 text-sm text-foreground list-disc list-inside">
                {feature.actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </GlassCard>
          )}
        </div>
      </PageContainer>
    </AdminLayout>
  );
};

export default AdminFeaturePage;
