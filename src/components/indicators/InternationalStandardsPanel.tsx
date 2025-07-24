
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Globe2, 
  Zap, 
  TrendingUp,
  Shield,
  DollarSign,
  Users,
  BarChart3,
  CheckCircle,
  Star,
  Target
} from "lucide-react";
import { expandedIndicatorsService, INTERNATIONAL_STANDARDS, OFFICIAL_API_SOURCES } from "@/services/expandedIndicatorsService";

export const InternationalStandardsPanel = () => {
  const [isEnriching, setIsEnriching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [enrichmentStats, setEnrichmentStats] = useState({
    totalIndicators: 0,
    newStandards: 0,
    themes: 0,
    countries: 0
  });

  const handleInternationalEnrichment = async () => {
    if (isEnriching) return;
    
    setIsEnriching(true);
    setProgress(0);
    
    let progressInterval: NodeJS.Timeout | null = null;
    
    try {
      toast.info("Enrichissement Standards Internationaux", {
        description: "Intégration des 120+ indicateurs standards ITU/OCDE/G20..."
      });
      
      // Progress simulation
      progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 2, 95));
      }, 1000);
      
      const totalEnriched = await expandedIndicatorsService.enrichAllAfricanCountriesWithStandards();
      
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setProgress(100);
      
      setEnrichmentStats({
        totalIndicators: totalEnriched,
        newStandards: Object.values(INTERNATIONAL_STANDARDS).flat().length,
        themes: Object.keys(INTERNATIONAL_STANDARDS).length,
        countries: 54
      });
      
      toast.success("Standards Internationaux Intégrés!", {
        description: `${totalEnriched} indicateurs standards ITU/OCDE traités`
      });
      
    } catch (error) {
      console.error("International enrichment error:", error);
      toast.error("Erreur lors de l'enrichissement", {
        description: "Vérifiez la console pour plus de détails"
      });
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    } finally {
      setIsEnriching(false);
    }
  };

  const totalStandardIndicators = Object.values(INTERNATIONAL_STANDARDS).flat().length;

  return (
    <div className="space-y-6">
      {/* Panel principal */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-blue-600" />
            Standards Internationaux ITU/OCDE/G20
          </CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="default" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {totalStandardIndicators} Standards
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Globe2 className="h-3 w-3" />
              54 Pays Africains
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              5 APIs Officielles
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Implémentation complète des standards internationaux pour les indicateurs FSU 
            selon les recommandations ITU Toolkit G20, OCDE Digital Economy et UN SDG.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{totalStandardIndicators}</div>
              <div className="text-xs text-muted-foreground">Standards Internationaux</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-indigo-600">4</div>
              <div className="text-xs text-muted-foreground">Thèmes Principaux</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">5</div>
              <div className="text-xs text-muted-foreground">APIs Officielles</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">54</div>
              <div className="text-xs text-muted-foreground">Pays Couverts</div>
            </div>
          </div>
          
          <Button 
            onClick={handleInternationalEnrichment}
            disabled={isEnriching}
            className="w-full"
            size="lg"
          >
            {isEnriching ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-spin" />
                Intégration Standards en cours...
              </>
            ) : (
              <>
                <Globe2 className="mr-2 h-4 w-4" />
                Intégrer Standards Internationaux
              </>
            )}
          </Button>
          
          {isEnriching && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression:</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Thèmes des Standards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Standards par Thème ITU/OCDE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  Infrastructure & Accès
                </h4>
                <Badge variant="outline">{INTERNATIONAL_STANDARDS.INFRASTRUCTURE_ACCESS.length} indicateurs</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Serveurs SSL, IoT M2M, vitesses réelles vs annoncées, prix PPP, couverture fibre
              </p>
            </div>
            
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600" />
                  Inclusion Numérique
                </h4>
                <Badge variant="outline">{INTERNATIONAL_STANDARDS.DIGITAL_INCLUSION.length} indicateurs</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Fracture numérique, compétences digitales, e-gouvernement, inclusion financière
              </p>
            </div>
            
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  Qualité de Service
                </h4>
                <Badge variant="outline">{INTERNATIONAL_STANDARDS.SERVICE_QUALITY.length} indicateurs</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                QoE latence, SLA, NPS client, temps résolution, disponibilité service
              </p>
            </div>
            
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-orange-600" />
                  Impact Économique
                </h4>
                <Badge variant="outline">{INTERNATIONAL_STANDARDS.ECONOMIC_IMPACT.length} indicateurs</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Investissement TIC/PIB, e-commerce, commerce digital, ROI service universel
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* APIs Officielles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            APIs Officielles Configurées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {OFFICIAL_API_SOURCES.map((source, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{source.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={source.auth === 'free' ? 'default' : 'secondary'}>
                      {source.auth}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {source.reliability}%
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="uppercase">{source.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Couverture:</span>
                    <span>{source.coverage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fréquence:</span>
                    <span>{source.updateFrequency}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-xs">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">Opérationnel</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques d'enrichissement */}
      {enrichmentStats.totalIndicators > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Résultats Standards Internationaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-blue-600">
                  {enrichmentStats.totalIndicators.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Total Traités</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-green-600">
                  {enrichmentStats.newStandards}
                </div>
                <div className="text-xs text-muted-foreground">Nouveaux Standards</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-purple-600">
                  {enrichmentStats.themes}
                </div>
                <div className="text-xs text-muted-foreground">Thèmes Couverts</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-orange-600">
                  {enrichmentStats.countries}
                </div>
                <div className="text-xs text-muted-foreground">Pays Traités</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
