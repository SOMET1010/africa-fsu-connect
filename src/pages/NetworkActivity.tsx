import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageContainer } from "@/components/layout/PageContainer";
import { ActivityTimeline } from "@/components/network/ActivityTimeline";
import { PresenceIndicator } from "@/components/network/PresenceIndicator";
import { Activity, Globe, Filter, Calendar } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * NetworkActivity - Couche 1 (Réseau)
 * 
 * UX RULES (Blueprint):
 * - NO technical KPIs
 * - NO rankings or punitive alerts
 * - Timeline-style activity feed
 * - Light filters (period, region, type)
 */
const NetworkActivity = () => {
  const { t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");

  const regions = [
    { value: "all", label: "Toutes les régions" },
    { value: "west", label: "Afrique de l'Ouest" },
    { value: "central", label: "Afrique Centrale" },
    { value: "east", label: "Afrique de l'Est" },
    { value: "south", label: "Afrique Australe" },
    { value: "north", label: "Afrique du Nord" },
  ];

  const activityTypes = [
    { value: "all", label: "Tous les types" },
    { value: "project", label: "Projets" },
    { value: "document", label: "Documents" },
    { value: "event", label: "Événements" },
    { value: "discussion", label: "Discussions" },
    { value: "collaboration", label: "Collaborations" },
  ];

  const periods = [
    { value: "week", label: "Cette semaine" },
    { value: "month", label: "Ce mois" },
    { value: "quarter", label: "Ce trimestre" },
    { value: "year", label: "Cette année" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <PageContainer className="py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Activity className="w-4 h-4 mr-2" />
            Activité du réseau
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Activité récente du réseau
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Suivez les dernières contributions, échanges et collaborations entre pays membres
          </p>
        </div>

        {/* Network Presence Summary */}
        <Card className="mb-8 bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Présence réseau
                </h3>
                <p className="text-muted-foreground">
                  Le réseau SUTEL est actif et les pays membres contribuent régulièrement
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <PresenceIndicator level={8} maxLevel={10} size="lg" />
                <span className="text-sm text-muted-foreground font-medium">
                  Forte activité ce mois
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-8 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtrer l'activité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Période
                </label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une période" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Région
                </label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une région" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Type d'activité
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Timeline des activités
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityTimeline maxItems={20} />
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  );
};

export default NetworkActivity;
