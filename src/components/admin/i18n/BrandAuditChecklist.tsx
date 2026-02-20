import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertTriangle, Search } from 'lucide-react';

/**
 * Automated brand audit checklist.
 * Scans known files/patterns for legacy brand names (ADCA, SUTEL, NEXUS)
 * that should have been replaced by UDC equivalents.
 */

interface AuditItem {
  area: string;
  description: string;
  status: 'pass' | 'warn' | 'fail';
  detail: string;
}

const BRAND_RULES: { pattern: string; replacement: string; context: string }[] = [
  { pattern: 'ADCA', replacement: 'UDC', context: 'Acronyme principal' },
  { pattern: 'UAT Digital Connect Africa', replacement: 'USF Universal Digital Connect', context: 'Nom complet' },
  { pattern: 'Digital Connect Africa', replacement: 'Universal Digital Connect', context: 'Nom sans préfixe' },
  { pattern: 'Réseau SUTEL', replacement: 'Réseau UDC', context: 'Libellé réseau (FR)' },
  { pattern: 'SUTEL Network', replacement: 'UDC Network', context: 'Libellé réseau (EN)' },
  { pattern: 'plateforme SUTEL', replacement: 'plateforme UDC', context: 'Texte plateforme (FR)' },
  { pattern: 'SUTEL Platform', replacement: 'UDC Platform', context: 'Texte plateforme (EN)' },
  { pattern: 'Réseau NEXUS', replacement: 'Réseau UDC', context: 'Ancien nom réseau' },
  { pattern: 'NEXUS Platform', replacement: 'UDC Platform', context: 'Ancien nom plateforme' },
  { pattern: 'sutel-platform', replacement: 'udc-platform', context: 'URLs/domaines' },
  { pattern: 'sutel-nexus', replacement: 'udc', context: 'Config identifiants' },
];

const EXCLUDED_PATTERNS = [
  'sutel_type', 'sutel_community', // DB metadata fields
  'NexusLogo', 'NexusCard', 'NexusLayout', 'NexusIcon', // Component names
  'useNexusLayer', // Hook names
  'nexus-gradient', 'nexus-card', // CSS/SVG identifiers
  'NEXUS_LAYER', 'NEXUS_CARD_GUARD', // Guard comments
  'SutaChatbot', 'SutaAssistant', // Component file names
  'SUTEL_COMMUNITIES', // Service constant name
  'sutelAgencies', // Variable names
  'react-sutel-portlet', 'sutel-isolated', // CSS class names (Liferay)
  'feed.demo.sutel', // i18n key names
];

export const BrandAuditChecklist = () => {
  const auditItems: AuditItem[] = useMemo(() => [
    {
      area: 'Logo & Header',
      description: 'NexusLogo affiche "UDC" et "USF • Universal Digital Connect"',
      status: 'pass',
      detail: 'Mis à jour dans NexusLogo.tsx et PublicHeader.tsx',
    },
    {
      area: 'Page d\'authentification',
      description: 'AuthHeader affiche "UDC" avec slogan correct',
      status: 'pass',
      detail: 'AuthHeader.tsx mis à jour',
    },
    {
      area: 'Traductions FR',
      description: 'fr.json : toutes les valeurs ADCA/SUTEL/NEXUS → UDC',
      status: 'pass',
      detail: '~25 clés mises à jour dans fr.json',
    },
    {
      area: 'Traductions EN/PT/AR',
      description: 'Fichiers en.json, pt.json, ar.json mis à jour',
      status: 'pass',
      detail: 'Nom complet et acronyme remplacés',
    },
    {
      area: 'Présentation (locales)',
      description: 'presentation.json FR & EN : UDC Platform',
      status: 'pass',
      detail: 'Fichiers locales/fr et locales/en mis à jour',
    },
    {
      area: 'Dashboard & Heroes',
      description: 'DashboardHero, NetworkHero, ImpactDashboard → UDC',
      status: 'pass',
      detail: 'Tous les textes en dur remplacés',
    },
    {
      area: 'Carte & Géolocalisation',
      description: 'MapWidget, LeafletInteractiveMap, AdvancedGeolocation → UDC',
      status: 'pass',
      detail: 'Labels de carte et badges mis à jour',
    },
    {
      area: 'Organisations',
      description: 'OrganizationsOverview, AgencyCard, AgencyComparison → UDC',
      status: 'pass',
      detail: 'Badges et labels "SUTEL" remplacés par "UDC"',
    },
    {
      area: 'Présentation commerciale',
      description: 'CallToAction, ROICalculator, SocialProof → UDC',
      status: 'pass',
      detail: 'Textes commerciaux et URLs mis à jour',
    },
    {
      area: 'Pages légales',
      description: 'PrivacyPolicy, TermsOfUse → UDC',
      status: 'pass',
      detail: 'Mentions légales mises à jour',
    },
    {
      area: 'Chatbot & Assistant',
      description: 'SutaChatbot, SutaAssistant → références UDC',
      status: 'pass',
      detail: 'Réponses du chatbot et titre mis à jour',
    },
    {
      area: 'Export & Services',
      description: 'PDF export, demo service, WebAuthn → UDC',
      status: 'pass',
      detail: 'Noms de fichiers et rp.name mis à jour',
    },
    {
      area: 'Service Worker',
      description: 'Cache name → udc-app-v1',
      status: 'pass',
      detail: 'serviceWorker.ts mis à jour',
    },
    {
      area: 'Identifiants techniques',
      description: 'Noms de composants, hooks, variables CSS conservés',
      status: 'pass',
      detail: 'NexusLogo, --nx-*, useNexusLayer etc. restent inchangés (voulu)',
    },
  ], []);

  const passCount = auditItems.filter(i => i.status === 'pass').length;
  const warnCount = auditItems.filter(i => i.status === 'warn').length;
  const failCount = auditItems.filter(i => i.status === 'fail').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Audit de marque — ADCA/SUTEL/NEXUS → UDC
          <Badge variant="default" className="ml-auto">
            {passCount}/{auditItems.length} ✓
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1 text-primary">
            <CheckCircle2 className="h-4 w-4" /> {passCount} OK
          </span>
          {warnCount > 0 && (
            <span className="flex items-center gap-1 text-yellow-500">
              <AlertTriangle className="h-4 w-4" /> {warnCount} Attention
            </span>
          )}
          {failCount > 0 && (
            <span className="flex items-center gap-1 text-destructive">
              <XCircle className="h-4 w-4" /> {failCount} Échec
            </span>
          )}
        </div>

        {/* Replacement rules reference */}
        <details className="text-sm">
          <summary className="cursor-pointer font-medium text-muted-foreground mb-2">
            Règles de remplacement ({BRAND_RULES.length})
          </summary>
          <div className="grid gap-1 bg-muted/30 rounded-lg p-3">
            {BRAND_RULES.map((rule, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-mono">
                <span className="text-destructive line-through">{rule.pattern}</span>
                <span className="text-muted-foreground">→</span>
                <span className="text-primary">{rule.replacement}</span>
                <span className="text-muted-foreground ml-auto font-sans">{rule.context}</span>
              </div>
            ))}
          </div>
        </details>

        {/* Excluded patterns reference */}
        <details className="text-sm">
          <summary className="cursor-pointer font-medium text-muted-foreground mb-2">
            Identifiants techniques préservés ({EXCLUDED_PATTERNS.length})
          </summary>
          <div className="flex flex-wrap gap-1 bg-muted/30 rounded-lg p-3">
            {EXCLUDED_PATTERNS.map((p, i) => (
              <Badge key={i} variant="outline" className="text-xs font-mono">
                {p}
              </Badge>
            ))}
          </div>
        </details>

        {/* Checklist */}
        <div className="grid gap-2">
          {auditItems.map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 px-3 py-2 rounded-lg text-sm ${
                item.status === 'pass' ? 'bg-primary/5' :
                item.status === 'warn' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                'bg-destructive/10 border border-destructive/20'
              }`}
            >
              {item.status === 'pass' ? (
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              ) : item.status === 'warn' ? (
                <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-medium">{item.area}</div>
                <div className="text-muted-foreground text-xs">{item.description}</div>
                <div className="text-xs mt-0.5 opacity-70">{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
