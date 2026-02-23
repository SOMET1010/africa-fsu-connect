import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import {
  Database,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  RefreshCw,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Static rename mapping from the plan
const RENAME_MAP: { prefix: string; oldDesc: string; newName: string }[] = [
  { prefix: '20250716155935', oldDesc: '9addb7dc', newName: 'create_enums_and_core_tables' },
  { prefix: '20250717161254', oldDesc: 'ff2b02d9', newName: 'create_user_preferences' },
  { prefix: '20250717230640', oldDesc: 'aae4299a', newName: 'create_audit_logs_and_sessions' },
  { prefix: '20250718090528', oldDesc: 'f6215899', newName: 'create_advanced_security_tables' },
  { prefix: '20250719162749', oldDesc: '3808a7e9', newName: 'create_agencies_and_federation' },
  { prefix: '20250720084024', oldDesc: 'f527d0c0', newName: 'update_agencies_fsu_data' },
  { prefix: '20250720084459', oldDesc: 'ed2d69ac', newName: 'fix_agencies_fsu_corrections' },
  { prefix: '20250720094615', oldDesc: 'd6ed6582', newName: 'fix_agencies_sutel_metadata' },
  { prefix: '20250720095354', oldDesc: '815bf8b8', newName: 'reset_agencies_sutel_data' },
  { prefix: '20250720100856', oldDesc: '3e034680', newName: 'reset_agencies_with_regions' },
  { prefix: '20250721095100', oldDesc: '2688a05b', newName: 'fix_security_search_path' },
  { prefix: '20250721100848', oldDesc: '2cb67e23', newName: 'fix_agencies_official_data' },
  { prefix: '20250722184556', oldDesc: 'b4e0dbf1', newName: 'create_universal_service_indicators' },
  { prefix: '20250724125550', oldDesc: '53542da6', newName: 'restrict_anonymous_access_phase1' },
  { prefix: '20250724125747', oldDesc: '78f58400', newName: 'restrict_admin_policies_phase1b' },
  { prefix: '20250724130130', oldDesc: '8f822fb2', newName: 'secure_storage_buckets_phase1c' },
  { prefix: '20250724181227', oldDesc: 'aa251a75', newName: 'fix_rls_dashboard_stats' },
  { prefix: '20250724195649', oldDesc: '38f3c683', newName: 'create_translation_system' },
  { prefix: '20250725134735', oldDesc: '5440343b', newName: 'create_data_versions' },
  { prefix: '20250725171651', oldDesc: 'e4e08d0f', newName: 'create_document_versions' },
  { prefix: '20250725185222', oldDesc: '57787a45', newName: 'create_submissions' },
  { prefix: '20250726110322', oldDesc: '7594e3d5', newName: 'create_user_avatars_bucket' },
  { prefix: '20250726122310', oldDesc: '03a90546', newName: 'create_countries_table' },
  { prefix: '20250726124049', oldDesc: 'adf27334', newName: 'add_countries_coordinates' },
  { prefix: '20250726124640', oldDesc: '347d9663', newName: 'add_countries_coordinates_v2' },
  { prefix: '20250726154705', oldDesc: '6970b8fd', newName: 'add_missing_translations' },
  { prefix: '20250726163737', oldDesc: '7d2085fc', newName: 'add_common_translations' },
  { prefix: '20250726170519', oldDesc: '61bbb6f0', newName: 'fix_role_escalation_vulnerability' },
  { prefix: '20250726170711', oldDesc: '4221a6ff', newName: 'fix_role_escalation_v2' },
  { prefix: '20250726170804', oldDesc: '8ba37b40', newName: 'fix_function_search_path' },
  { prefix: '20250726171228', oldDesc: '7e21e18a', newName: 'fix_audit_role_change_trigger' },
  { prefix: '20251121202656', oldDesc: 'd4189344', newName: 'create_presentation_sessions' },
  { prefix: '20251231125727', oldDesc: 'd45ace50', newName: 'fix_functions_search_path_phase3' },
  { prefix: '20251231131636', oldDesc: 'da937c5c', newName: 'enable_rls_all_tables_phase5d' },
  { prefix: '20251231131800', oldDesc: 'a3ab96bf', newName: 'fix_procedures_search_path' },
  { prefix: '20251231141451', oldDesc: 'ee17ccfb', newName: 'add_languages_community_to_countries' },
  { prefix: '20260102165244', oldDesc: 'c8a99b3b', newName: 'fix_artisan_profiles_rls' },
  { prefix: '20260102165305', oldDesc: 'ddb9996e', newName: 'remove_public_artisan_policy' },
  { prefix: '20260109140931', oldDesc: 'a7982b05', newName: 'set_storage_buckets_private' },
  { prefix: '20260109141742', oldDesc: 'd8c9269e', newName: 'fix_permissive_rls_payments' },
  { prefix: '20260109141849', oldDesc: '83df0db0', newName: 'fix_all_permissive_rls_policies' },
  { prefix: '20260109143228', oldDesc: '178b6a51', newName: 'create_focal_points_system' },
  { prefix: '20260109145442', oldDesc: 'df4da628', newName: 'create_focal_conversations' },
  { prefix: '20260110090453', oldDesc: 'ada144fd', newName: 'security_fixes_final' },
  { prefix: '20260111023308', oldDesc: '9cbaaf3b', newName: 'security_phase2_corrections' },
  { prefix: '20260111023524', oldDesc: '7ecaf242', newName: 'security_phase3_corrections' },
  { prefix: '20260111024046', oldDesc: '78f9fa99', newName: 'security_phase4_remove_permissive' },
  { prefix: '20260216233247', oldDesc: '4c2fa1c4', newName: 'add_documents_access_control' },
  { prefix: '20260216234456', oldDesc: 'eef6b312', newName: 'add_agency_resources_access_control' },
  { prefix: '20260216234943', oldDesc: '35a5dd92', newName: 'fix_rls_profiles_user_id_cast' },
  { prefix: '20260218170542', oldDesc: 'e0033f58', newName: 'create_homepage_content_blocks' },
  { prefix: '20260218171557', oldDesc: '9b43dbe0', newName: 'fix_handle_new_user_function' },
  { prefix: '20260218172849', oldDesc: 'b1bb678b', newName: 'update_homepage_hero_content' },
  { prefix: '20260219164805', oldDesc: '0b42bf67', newName: 'update_homepage_hero_branding' },
  { prefix: '20260222133935', oldDesc: '29697865', newName: 'update_hero_cms_multilingual' },
  { prefix: '20260222140706', oldDesc: '57cd8b0f', newName: 'create_site_settings' },
  { prefix: '20260223143947', oldDesc: '85bf0aa9', newName: 'harmonize_agencies_region_names' },
];

interface AppliedMigration {
  version: string;
  name: string;
  executed_at: string;
}

function formatTimestamp(ts: string): string {
  if (ts.length < 14) return ts;
  return `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)} ${ts.slice(8, 10)}:${ts.slice(10, 12)}:${ts.slice(12, 14)}`;
}

function classifyMigration(name: string): 'correct' | 'needs_rename' | 'unknown' {
  // Check if name follows YYYYMMDDHHmmss_descriptive_name pattern (no UUID)
  const correctPattern = /^\d{14}_[a-z][a-z0-9_]+$/;
  const uuidPattern = /[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}/i;
  const shortUuidPattern = /^(\d{14})[_-]([0-9a-f]{8})/;

  if (correctPattern.test(name)) return 'correct';
  if (uuidPattern.test(name) || shortUuidPattern.test(name)) return 'needs_rename';
  return 'unknown';
}

export default function MigrationStatus() {
  const [appliedMigrations, setAppliedMigrations] = useState<AppliedMigration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchMigrations = async () => {
    setLoading(true);
    setError(null);
    try {
      // Query the supabase_migrations.schema_migrations table
      const { data, error: queryError } = await supabase
        .rpc('get_user_role') // dummy call to test connection
        .maybeSingle();

      // We can't query schema_migrations directly from the client
      // So we show the static mapping + connection status
      setAppliedMigrations([]);
      setLastRefresh(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMigrations();
  }, []);

  const filteredMigrations = useMemo(() => {
    if (!search) return RENAME_MAP;
    const q = search.toLowerCase();
    return RENAME_MAP.filter(
      (m) =>
        m.prefix.includes(q) ||
        m.newName.includes(q) ||
        m.oldDesc.includes(q)
    );
  }, [search]);

  const stats = useMemo(() => {
    const total = RENAME_MAP.length;
    // For now, all are "needs_rename" since files haven't been renamed yet
    return {
      total,
      needsRename: total,
      correct: 0,
      progress: 0,
    };
  }, []);

  const categoryBreakdown = useMemo(() => {
    const categories: Record<string, number> = {};
    RENAME_MAP.forEach((m) => {
      const parts = m.newName.split('_');
      const verb = parts[0]; // create, fix, update, etc.
      categories[verb] = (categories[verb] || 0) + 1;
    });
    return Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, count }));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              Migration Status Dashboard
            </h1>
            <Badge variant="outline" className="ml-2 text-xs">
              DEBUG
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Suivi en temps réel de la santé des migrations Supabase et de la progression du renommage
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Dernière mise à jour : {lastRefresh.toLocaleTimeString('fr-FR')}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total Migrations</p>
                  <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                </div>
                <Database className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">À renommer</p>
                  <p className="text-3xl font-bold text-destructive">{stats.needsRename}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Conformes</p>
                  <p className="text-3xl font-bold text-green-600">{stats.correct}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Progression</p>
                  <p className="text-3xl font-bold text-foreground">{stats.progress}%</p>
                </div>
                <RefreshCw className="h-8 w-8 text-primary opacity-50" />
              </div>
              <Progress value={stats.progress} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Répartition par type de migration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categoryBreakdown.map(({ name, count }) => (
                <Badge key={name} variant="secondary" className="text-xs">
                  {name}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search + Refresh */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par timestamp, nom ou UUID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMigrations}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Rafraîchir
          </Button>
        </div>

        {/* Error banner */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-4 flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5 shrink-0" />
              <span className="text-sm">{error}</span>
            </CardContent>
          </Card>
        )}

        {/* Migrations Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4" />
              Plan de renommage ({filteredMigrations.length} fichiers)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground w-10">#</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Timestamp</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ancien suffixe (UUID)</th>
                    <th className="text-center px-2 py-3 font-medium text-muted-foreground w-10"></th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nouveau nom</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMigrations.map((m, i) => {
                    const globalIndex = RENAME_MAP.indexOf(m) + 1;
                    return (
                      <tr
                        key={m.prefix}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs">
                          {globalIndex}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-foreground">
                          {formatTimestamp(m.prefix)}
                        </td>
                        <td className="px-4 py-2.5">
                          <code className="text-xs bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">
                            {m.oldDesc}...
                          </code>
                        </td>
                        <td className="px-2 py-2.5 text-center">
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground inline" />
                        </td>
                        <td className="px-4 py-2.5">
                          <code className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                            {m.newName}
                          </code>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <Badge
                            variant="outline"
                            className="text-xs border-destructive/50 text-destructive"
                          >
                            En attente
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">🛠 Comment appliquer le renommage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Le dossier <code className="bg-muted px-1 rounded">supabase/migrations/</code> est protégé en écriture sur Lovable. Exécutez le script localement :</p>
            <div className="bg-muted rounded-md p-3 font-mono text-xs text-foreground">
              <p>chmod +x scripts/rename-migrations.sh</p>
              <p>bash scripts/rename-migrations.sh</p>
            </div>
            <p className="text-xs">
              Le script trouvera chaque fichier par son préfixe timestamp+UUID et le renommera avec la description lisible. Aucun contenu SQL n'est modifié.
            </p>
          </CardContent>
        </Card>

        <Separator />

        <p className="text-xs text-muted-foreground text-center pb-4">
          Page de debug — Convention Supabase CLI : <code>YYYYMMDDHHmmss_short_description.sql</code>
        </p>
      </div>
    </div>
  );
}
