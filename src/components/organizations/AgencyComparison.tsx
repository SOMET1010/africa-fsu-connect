import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  GitCompare, 
  X, 
  Building2, 
  Globe, 
  MapPin, 
  Users, 
  DollarSign,
  CheckCircle,
  XCircle,
  Calendar,
  Target
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Agency = Tables<"agencies">;

interface AgencyComparisonProps {
  agencies: Agency[];
  isOpen: boolean;
  onClose: () => void;
}

const ComparisonField = ({ 
  label, 
  values, 
  icon: Icon 
}: { 
  label: string; 
  values: (string | number | null)[];
  icon: any;
}) => (
  <div className="grid grid-cols-4 gap-4 py-3 border-b border-border/50">
    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    {values.map((value, index) => (
      <div key={index} className="text-sm">
        {value || "Non renseigné"}
      </div>
    ))}
  </div>
);

export const AgencyComparison = ({ agencies, isOpen, onClose }: AgencyComparisonProps) => {
  const [selectedAgencies, setSelectedAgencies] = useState<Agency[]>([]);

  if (!isOpen) return null;

  const availableAgencies = agencies.filter(a => !selectedAgencies.find(s => s.id === a.id));

  const toggleAgency = (agency: Agency) => {
    setSelectedAgencies(prev => {
      const exists = prev.find(a => a.id === agency.id);
      if (exists) {
        return prev.filter(a => a.id !== agency.id);
      } else if (prev.length < 3) {
        return [...prev, agency];
      }
      return prev;
    });
  };

  const getMetadataValue = (agency: Agency, key: string) => {
    return agency.metadata?.[key] || null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-7xl bg-background border-border/50 mt-8 mb-8">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitCompare className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Comparaison d'Organisations</h2>
              <Badge variant="outline" className="ml-2">
                {selectedAgencies.length}/3 sélectionnées
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Selection Panel */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Sélectionner des organisations à comparer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
              {availableAgencies.map((agency) => (
                <div
                  key={agency.id}
                  className="flex items-center space-x-3 p-3 border border-border/50 rounded-lg hover:bg-muted/30 cursor-pointer"
                  onClick={() => toggleAgency(agency)}
                >
                  <Checkbox
                    checked={false}
                    disabled={selectedAgencies.length >= 3}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{agency.name}</p>
                    <p className="text-xs text-muted-foreground">{agency.country}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Agencies Row */}
          {selectedAgencies.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Organisations sélectionnées</h3>
              <div className="flex gap-3">
                {selectedAgencies.map((agency) => (
                  <Card key={agency.id} className="flex-1 p-4 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => toggleAgency(agency)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm pr-8">{agency.name}</h4>
                      <p className="text-xs text-muted-foreground">{agency.acronym}</p>
                      <Badge variant="outline" className="text-xs">
                        {agency.region}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Comparison Table */}
          {selectedAgencies.length >= 2 && (
            <div className="space-y-4">
              <Separator />
              <h3 className="text-lg font-medium">Comparaison détaillée</h3>
              
              <div className="border border-border/50 rounded-lg overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-4 gap-4 p-4 bg-muted/30 border-b border-border/50">
                  <div className="font-medium">Critères</div>
                  {selectedAgencies.map((agency) => (
                    <div key={agency.id} className="font-medium text-center truncate">
                      {agency.name}
                    </div>
                  ))}
                </div>

                <div className="p-4 space-y-1">
                  {/* Basic Information */}
                  <ComparisonField
                    label="Pays"
                    icon={MapPin}
                    values={selectedAgencies.map(a => a.country)}
                  />
                  <ComparisonField
                    label="Région"
                    icon={Globe}
                    values={selectedAgencies.map(a => a.region)}
                  />
                  <ComparisonField
                    label="Acronyme"
                    icon={Building2}
                    values={selectedAgencies.map(a => a.acronym || "Non défini")}
                  />
                  <ComparisonField
                    label="Date de création"
                    icon={Calendar}
                    values={selectedAgencies.map(a => 
                      a.established_date 
                        ? new Date(a.established_date).getFullYear().toString()
                        : "Non renseignée"
                    )}
                  />

                  {/* Governance */}
                  <ComparisonField
                    label="Type de gouvernance"
                    icon={Target}
                    values={selectedAgencies.map(a => {
                      const type = getMetadataValue(a, 'governance_type');
                      return type === 'autonomous_agency' ? 'Agence autonome' :
                             type === 'unit_within_regulator' ? 'Unité régulateur' :
                             type === 'ministry_unit' ? 'Unité ministérielle' :
                             type || "Non défini";
                    })}
                  />

                  {/* Funding */}
                  <ComparisonField
                    label="Taux de financement"
                    icon={DollarSign}
                    values={selectedAgencies.map(a => {
                      const rate = getMetadataValue(a, 'funding_rate');
                      return rate ? `${rate}%` : "Non renseigné";
                    })}
                  />

                  {/* Contact */}
                  <ComparisonField
                    label="Site web"
                    icon={Globe}
                    values={selectedAgencies.map(a => 
                      a.website_url ? "Disponible" : "Non renseigné"
                    )}
                  />

                  {/* Status */}
                  <ComparisonField
                    label="Statut données"
                    icon={CheckCircle}
                    values={selectedAgencies.map(a => 
                      a.sync_status === 'synced' ? 'Synchronisées' :
                      a.sync_status === 'pending' ? 'En cours' :
                      a.sync_status === 'failed' ? 'Échec' : 'Partielles'
                    )}
                  />

                  {/* SUTEL Type */}
                  <ComparisonField
                    label="Type UDC"
                    icon={Building2}
                    values={selectedAgencies.map(a => 
                      getMetadataValue(a, 'sutel_type') ? "UDC" : "Non UDC"
                    )}
                  />
                </div>
              </div>

              {/* Summary */}
              <Card className="p-4 bg-muted/30">
                <h4 className="font-medium mb-2">Résumé de la comparaison</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Régions représentées</p>
                    <p className="font-medium">
                      {[...new Set(selectedAgencies.map(a => a.region))].length}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Agences autonomes</p>
                    <p className="font-medium">
                      {selectedAgencies.filter(a => 
                        getMetadataValue(a, 'governance_type') === 'autonomous_agency'
                      ).length}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">UDC confirmées</p>
                    <p className="font-medium">
                      {selectedAgencies.filter(a => 
                        getMetadataValue(a, 'sutel_type')
                      ).length}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {selectedAgencies.length === 1 && (
            <Card className="p-6 text-center bg-muted/30">
              <Building2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">
                Sélectionnez au moins 2 organisations
              </h3>
              <p className="text-muted-foreground">
                Choisissez une ou plusieurs organisations supplémentaires pour commencer la comparaison.
              </p>
            </Card>
          )}
        </div>
      </Card>
    </div>
  );
};