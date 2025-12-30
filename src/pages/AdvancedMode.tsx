import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageContainer } from "@/components/layout/PageContainer";
import { 
  BarChart3, 
  Building2, 
  Database, 
  Download, 
  Map, 
  Shield, 
  AlertTriangle,
  ArrowRight,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * AdvancedMode - Couche 3 (Opérationnel/Technique)
 * 
 * UX RULES (Blueprint):
 * - Permanent "Mode avancé" banner
 * - Protected by expert/admin role
 * - Hub for all technical/operational data
 * - Pro UX: filters, tables, exports
 */
const AdvancedMode = () => {
  const { user } = useAuth();

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
      title: "Organisations / Agences",
      description: "Gestion des agences et fonds nationaux",
      icon: Building2,
      href: "/organizations",
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      id: "map",
      title: "Carte SIG",
      description: "Couches techniques et données géographiques",
      icon: Map,
      href: "/map",
      color: "bg-orange-500/10 text-orange-600",
    },
    {
      id: "exports",
      title: "Exports de données",
      description: "Téléchargement de données brutes et rapports",
      icon: Download,
      href: "/resources",
      color: "bg-cyan-500/10 text-cyan-600",
    },
    {
      id: "admin",
      title: "Administration",
      description: "Paramètres système et gestion des utilisateurs",
      icon: Settings,
      href: "/admin",
      color: "bg-red-500/10 text-red-600",
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
                Données techniques
              </Badge>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700">
              <Link to="/network">
                Retour au réseau
              </Link>
            </Button>
          </div>
        </PageContainer>
      </div>

      <PageContainer className="py-8">
        {/* Header */}
        <div className="text-center mb-12">
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

        {/* Warning Alert */}
        <Alert className="mb-8 border-amber-500/30 bg-amber-500/5">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-700">Zone technique</AlertTitle>
          <AlertDescription className="text-amber-600/80">
            Cette section contient des données techniques détaillées destinées aux experts et administrateurs.
            Pour une vue simplifiée du réseau, retournez à la{" "}
            <Link to="/network" className="underline font-medium">
              Vue Réseau
            </Link>.
          </AlertDescription>
        </Alert>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advancedModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card 
                key={module.id} 
                className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-card/80 backdrop-blur-sm border-border/50"
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

        {/* Quick Stats for Experts */}
        <Card className="mt-8 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Résumé des données
            </CardTitle>
            <CardDescription>
              Aperçu rapide des métriques système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold text-foreground mb-1">54</div>
                <div className="text-sm text-muted-foreground">Pays enregistrés</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold text-foreground mb-1">127</div>
                <div className="text-sm text-muted-foreground">Projets actifs</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold text-foreground mb-1">89</div>
                <div className="text-sm text-muted-foreground">Documents</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold text-foreground mb-1">342</div>
                <div className="text-sm text-muted-foreground">Utilisateurs</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  );
};

export default AdvancedMode;
