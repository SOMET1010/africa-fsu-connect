import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/PageContainer";
import { 
  BarChart3, 
  Building2, 
  Database, 
  Shield, 
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Settings,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdvancedStats } from "@/hooks/useAdvancedStats";

/**
 * AdvancedMode - Couche 3 (Opérationnel/Technique)
 * 
 * UX RULES (Blueprint):
 * - Permanent "Mode avancé" banner
 * - Protected by expert/admin role
 * - Hub for all technical/operational data
 * - Pro UX: filters, tables, exports
 * - C-LOCK: Only Layer 3 modules listed
 */

// Composant local pour les statistiques
const StatCard = ({ 
  label, 
  value, 
  loading 
}: { 
  label: string; 
  value?: number; 
  loading: boolean;
}) => (
  <div className="text-center p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
    <div className="text-2xl font-bold text-foreground mb-1">
      {loading ? (
        <div className="h-8 w-12 mx-auto bg-muted animate-pulse rounded" />
      ) : (
        value ?? 0
      )}
    </div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

const AdvancedMode = () => {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useAdvancedStats();

  // C-LOCK: Modules Layer 3 uniquement (pas de /map, /resources)
  const advancedModules = [
    {
      id: "analytics",
      title: "Analytics",
      description: "Analyses détaillées et statistiques de performance",
      icon: BarChart3,
      href: "/analytics",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      id: "indicators",
      title: "Indicateurs",
      description: "Métriques techniques et KPIs détaillés",
      icon: Database,
      href: "/indicators",
      color: "bg-green-500/10 text-green-600",
    },
    {
      id: "organizations",
      title: "Organisations",
      description: "Gestion des agences et fonds nationaux",
      icon: Building2,
      href: "/organizations",
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      id: "admin",
      title: "Administration",
      description: "Paramètres système et gestion des utilisateurs",
      icon: Settings,
      href: "/admin",
      color: "bg-red-500/10 text-red-600",
    },
    {
      id: "security",
      title: "Sécurité",
      description: "Audit de sécurité et contrôle d'accès",
      icon: Shield,
      href: "/security",
      color: "bg-slate-500/10 text-slate-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Permanent Advanced Mode Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/30">
        <PageContainer>
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-amber-600" />
              <span className="font-semibold text-amber-700">MODE AVANCÉ</span>
              <Badge variant="outline" className="border-amber-500/50 text-amber-600">
                Couche 3 - Opérationnel
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-amber-600/70 hidden sm:inline">
                {user?.email}
              </span>
              <Button asChild variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700">
                <Link to="/network">
                  Retour vitrine
                </Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer className="py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4 px-4 py-2 border-amber-500/30 bg-amber-500/5">
            <Shield className="w-4 h-4 mr-2 text-amber-600" />
            Accès réservé
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Mode Avancé
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Accédez aux données techniques, analyses détaillées et outils d'administration
          </p>
        </div>

        {/* Gate Warning - Explicite */}
        <div className="mb-8 p-6 rounded-xl border-2 border-amber-500/50 bg-amber-500/10">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-amber-500/20 shrink-0">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-amber-700 mb-2">
                Vous quittez la vitrine publique
              </h2>
              <p className="text-amber-600/90 mb-4">
                Cette section contient des outils d'administration et des données opérationnelles 
                réservées aux experts. Les informations affichées ici ne sont pas destinées au grand public.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <Button asChild variant="outline" className="border-amber-500/50 text-amber-700 hover:bg-amber-500/10">
                  <Link to="/network">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retourner à la vitrine
                  </Link>
                </Button>
                <span className="text-sm text-amber-600/70">
                  Connecté : {user?.email || 'Administrateur'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advancedModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card 
                key={module.id} 
                className="group hover:shadow-md transition-all duration-200 bg-card border-border"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {module.title}
                  </CardTitle>
                  <CardDescription>
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-all">
                    <Link to={module.href} className="flex items-center justify-center gap-2">
                      Accéder
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Dynamic Stats from Supabase */}
        <Card className="mt-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Résumé des données
              {statsLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </CardTitle>
            <CardDescription>
              Métriques système en temps réel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard label="Pays" value={stats?.countries} loading={statsLoading} />
              <StatCard label="Agences" value={stats?.agencies} loading={statsLoading} />
              <StatCard label="Projets" value={stats?.projects} loading={statsLoading} />
              <StatCard label="Documents" value={stats?.documents} loading={statsLoading} />
              <StatCard label="Événements" value={stats?.events} loading={statsLoading} />
              <StatCard label="Utilisateurs" value={stats?.profiles} loading={statsLoading} />
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  );
};

export default AdvancedMode;
