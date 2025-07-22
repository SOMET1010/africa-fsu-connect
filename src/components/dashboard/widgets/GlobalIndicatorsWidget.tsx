import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Globe, TrendingUp, Users, Wifi, Activity } from "lucide-react";
import { useUniversalServiceIndicators, useIndicatorDefinitions, useIndicatorStats } from "@/hooks/useUniversalServiceIndicators";
import { SkeletonCard } from "@/components/ui/skeleton-loader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export const GlobalIndicatorsWidget = () => {
  const { data: indicators, isLoading: indicatorsLoading } = useUniversalServiceIndicators();
  const { data: definitions } = useIndicatorDefinitions();
  const { data: stats } = useIndicatorStats();

  if (indicatorsLoading) {
    return <SkeletonCard className="h-96" />;
  }

  // Sample data for demonstration
  const sampleData = [
    { name: "Côte d'Ivoire", mobile: 142.5, internet: 58.2, broadband: 1.8 },
    { name: "Kenya", mobile: 110.4, internet: 87.2, broadband: 2.3 },
    { name: "Nigeria", mobile: 104.7, internet: 51.9, broadband: 0.1 },
    { name: "Ghana", mobile: 138.1, internet: 68.1, broadband: 0.9 },
    { name: "Senegal", mobile: 105.9, internet: 58.2, broadband: 2.1 }
  ];

  const connectivityData = [
    { indicator: "Couverture 4G", value: 85.4, target: 90 },
    { indicator: "Accès Internet", value: 64.7, target: 75 },
    { indicator: "Haut Débit Mobile", value: 78.9, target: 85 },
    { indicator: "Haut Débit Fixe", value: 12.3, target: 25 }
  ];

  const regionData = [
    { name: "Afrique de l'Ouest", value: 35, color: COLORS[0] },
    { name: "Afrique de l'Est", value: 28, color: COLORS[1] },
    { name: "Afrique Centrale", value: 20, color: COLORS[2] },
    { name: "Afrique Australe", value: 17, color: COLORS[3] }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Overview Stats */}
      <ScrollReveal className="xl:col-span-3">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-primary" />
              Indicateurs du Service Universel - Vue Globale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats?.totalIndicators || 0}</div>
                <div className="text-sm text-muted-foreground">Indicateurs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{stats?.countriesCount || 0}</div>
                <div className="text-sm text-muted-foreground">Pays</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{stats?.regionsCount || 0}</div>
                <div className="text-sm text-muted-foreground">Régions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-1">{stats?.latestYear || 2024}</div>
                <div className="text-sm text-muted-foreground">Dernière Année</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Connectivity Progress */}
      <ScrollReveal>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-primary" />
              Objectifs de Connectivité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {connectivityData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.indicator}</span>
                  <span className="font-medium">{item.value}% / {item.target}%</span>
                </div>
                <Progress value={(item.value / item.target) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Actuel: {item.value}%</span>
                  <span>Objectif: {item.target}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Regional Distribution */}
      <ScrollReveal>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-secondary" />
              Répartition Régionale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {regionData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Country Comparison */}
      <ScrollReveal className="lg:col-span-2 xl:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Comparaison par Pays - Indicateurs Clés
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">Pénétration Mobile</Badge>
              <Badge variant="outline">Accès Internet</Badge>
              <Badge variant="outline">Haut Débit</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="mobile" fill="hsl(var(--primary))" name="Mobile %" />
                <Bar dataKey="internet" fill="hsl(var(--secondary))" name="Internet %" />
                <Bar dataKey="broadband" fill="hsl(var(--accent))" name="Haut Débit %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Data Sources */}
      <ScrollReveal>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-chart-1" />
              Sources de Données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["GSMA", "ITU", "Banque Mondiale", "UAT"].map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{source}</div>
                  <div className="text-sm text-muted-foreground">
                    {index === 0 ? "Données mobiles" : 
                     index === 1 ? "Statistiques TIC" :
                     index === 2 ? "Indicateurs développement" : "Coordination régionale"}
                  </div>
                </div>
                <Badge variant={index < 2 ? "default" : "secondary"}>
                  {index < 2 ? "Actif" : "En cours"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  );
};