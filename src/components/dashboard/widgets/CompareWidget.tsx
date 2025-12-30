import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  MapPin, 
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface CompareWidgetProps {
  countryCode: string;
}

type ComparisonType = 'region' | 'budget' | 'population';

interface ComparisonData {
  label: string;
  value: number;
  average: number;
  trend: 'up' | 'down' | 'stable';
}

// Données simulées de comparaison bienveillante
const getComparisonData = (type: ComparisonType): ComparisonData[] => {
  const data: Record<ComparisonType, ComparisonData[]> = {
    region: [
      { label: 'Projets actifs', value: 12, average: 9.5, trend: 'up' },
      { label: 'Taux de couverture', value: 68, average: 62, trend: 'up' },
      { label: 'Bénéficiaires (M)', value: 1.2, average: 0.8, trend: 'stable' },
    ],
    budget: [
      { label: 'Projets actifs', value: 12, average: 11, trend: 'stable' },
      { label: 'Taux de couverture', value: 68, average: 65, trend: 'up' },
      { label: 'Efficience budget', value: 85, average: 78, trend: 'up' },
    ],
    population: [
      { label: 'Projets par 10M hab.', value: 4.2, average: 3.8, trend: 'up' },
      { label: 'Couverture rurale', value: 45, average: 42, trend: 'stable' },
      { label: 'Bénéficiaires (%)', value: 12, average: 10, trend: 'up' },
    ],
  };
  return data[type];
};

export function CompareWidget({ countryCode }: CompareWidgetProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [comparisonType, setComparisonType] = useState<ComparisonType | null>(null);

  const comparisonOptions = [
    { type: 'region' as ComparisonType, label: 'Pays de ma région', icon: MapPin, description: 'Afrique de l\'Ouest' },
    { type: 'budget' as ComparisonType, label: 'Budget FSU similaire', icon: BarChart3, description: '±20% du budget' },
    { type: 'population' as ComparisonType, label: 'Population similaire', icon: Users, description: '±30% population' },
  ];

  const comparisonData = comparisonType ? getComparisonData(comparisonType) : null;

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-success" />;
    if (trend === 'down') return <TrendingUp className="h-3 w-3 text-destructive rotate-180" />;
    return <span className="h-3 w-3 text-muted-foreground">→</span>;
  };

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            {t('compare.title')}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (!isExpanded) setComparisonType(null);
            }}
          >
            {isExpanded ? (
              <>Réduire <ChevronUp className="h-4 w-4 ml-1" /></>
            ) : (
              <>Comparer <ChevronDown className="h-4 w-4 ml-1" /></>
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {t('compare.description')}
        </p>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Options de comparaison */}
          {!comparisonType && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {comparisonOptions.map((option) => (
                <button
                  key={option.type}
                  onClick={() => setComparisonType(option.type)}
                  className="p-4 rounded-lg border bg-card hover:bg-muted/50 hover:border-primary/50 transition-all text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <option.icon className="h-5 w-5 text-primary" />
                    <span className="font-medium text-sm">{option.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </button>
              ))}
            </div>
          )}

          {/* Résultats de comparaison (bienveillante) */}
          {comparisonType && comparisonData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-primary/10">
                  {comparisonOptions.find(o => o.type === comparisonType)?.label}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setComparisonType(null)}
                >
                  Changer de critère
                </Button>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  📊 Comparaison avec {comparisonType === 'region' ? '12 pays de la région' : 
                    comparisonType === 'budget' ? '8 pays au budget similaire' : '10 pays de taille similaire'}
                </p>

                <div className="space-y-3">
                  {comparisonData.map((item) => {
                    const isAboveAverage = item.value >= item.average;
                    return (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTrendIcon(item.trend)}
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`font-bold ${isAboveAverage ? 'text-success' : 'text-muted-foreground'}`}>
                            {item.value}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            (moy. {item.average})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-muted-foreground mt-4 pt-3 border-t">
                  💡 Ces données sont indicatives et contextuelles. Chaque pays a ses propres défis et opportunités.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
