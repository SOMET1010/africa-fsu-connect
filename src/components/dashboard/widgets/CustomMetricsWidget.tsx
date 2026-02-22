import { useState } from "react";
import { Settings, TrendingUp, PieChart, BarChart, LineChart, Target, Plus } from "lucide-react";
import { DashboardWidget } from "../DashboardWidget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { logger } from "@/utils/logger";

interface CustomMetricsWidgetProps {
  id: string;
  onRemove?: (id: string) => void;
}

interface CustomMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  type: 'percentage' | 'number' | 'currency';
  trend: number;
  color: string;
}

export const CustomMetricsWidget = ({ id, onRemove }: CustomMetricsWidgetProps) => {
  const [metrics, setMetrics] = useState<CustomMetric[]>([
    {
      id: '1',
      name: 'Taux de Satisfaction',
      value: 87,
      target: 90,
      type: 'percentage',
      trend: 5,
      color: 'bg-green-500'
    },
    {
      id: '2',
      name: 'Projets Complétés',
      value: 23,
      target: 30,
      type: 'number',
      trend: -2,
      color: 'bg-primary'
    },
    {
      id: '3',
      name: 'Budget Utilisé',
      value: 125000,
      target: 150000,
      type: 'currency',
      trend: 12,
      color: 'bg-purple-500'
    }
  ]);

  const [newMetric, setNewMetric] = useState({
    name: '',
    value: 0,
    target: 0,
    type: 'number' as const
  });

  const addCustomMetric = () => {
    if (newMetric.name) {
      const metric: CustomMetric = {
        id: Date.now().toString(),
        ...newMetric,
        trend: 0,
        color: `bg-${['red', 'blue', 'green', 'purple', 'orange', 'pink'][Math.floor(Math.random() * 6)]}-500`
      };
      setMetrics([...metrics, metric]);
      setNewMetric({ name: '', value: 0, target: 0, type: 'number' });
    }
  };

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'percentage':
        return `${value}%`;
      case 'currency':
        return `${(value / 1000).toFixed(0)}k €`;
      default:
        return value.toString();
    }
  };

  const calculateProgress = (value: number, target: number) => {
    return Math.min((value / target) * 100, 100);
  };

  return (
    <DashboardWidget
      id={id}
      title="Métriques Personnalisées"
      icon={<PieChart className="h-5 w-5 text-primary" />}
      isRemovable
      isConfigurable
      onRemove={onRemove}
      onConfigure={() => logger.debug('Configure custom metrics')}
    >
      <div className="space-y-4">
        {/* Add New Metric Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une Métrique
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle Métrique Personnalisée</DialogTitle>
              <DialogDescription>
                Créez une métrique personnalisée pour suivre vos indicateurs clés
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="metric-name">Nom de la Métrique</Label>
                <Input
                  id="metric-name"
                  value={newMetric.name}
                  onChange={(e) => setNewMetric({ ...newMetric, name: e.target.value })}
                  placeholder="ex: Taux de conversion"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metric-value">Valeur Actuelle</Label>
                  <Input
                    id="metric-value"
                    type="number"
                    value={newMetric.value}
                    onChange={(e) => setNewMetric({ ...newMetric, value: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="metric-target">Objectif</Label>
                  <Input
                    id="metric-target"
                    type="number"
                    value={newMetric.target}
                    onChange={(e) => setNewMetric({ ...newMetric, target: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="metric-type">Type</Label>
                <Select value={newMetric.type} onValueChange={(value: any) => setNewMetric({ ...newMetric, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="number">Nombre</SelectItem>
                    <SelectItem value="percentage">Pourcentage</SelectItem>
                    <SelectItem value="currency">Devise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addCustomMetric} className="w-full">
                Ajouter la Métrique
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Metrics List */}
        <div className="space-y-3">
          {metrics.map((metric) => (
            <div key={metric.id} className="p-3 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{metric.name}</h4>
                <div className="flex items-center gap-1">
                  {metric.trend > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
                  )}
                  <span className={`text-xs font-medium ${
                    metric.trend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend > 0 ? '+' : ''}{metric.trend}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">{formatValue(metric.value, metric.type)}</span>
                <span className="text-sm text-muted-foreground">
                  / {formatValue(metric.target, metric.type)}
                </span>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${metric.color}`}
                  style={{ width: `${calculateProgress(metric.value, metric.target)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="text-xs">
                  {calculateProgress(metric.value, metric.target).toFixed(0)}% de l'objectif
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setMetrics(metrics.filter(m => m.id !== metric.id))}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>

        {metrics.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucune métrique personnalisée</p>
            <p className="text-xs">Ajoutez vos indicateurs clés</p>
          </div>
        )}
      </div>
    </DashboardWidget>
  );
};