import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ROIMetrics {
  currentCosts: number;
  newCosts: number;
  savings: number;
  roi: number;
  paybackPeriod: number;
  annualSavings: number;
}

export function ROICalculator() {
  const [employees, setEmployees] = useState(100);
  const [currentSystemCost, setCurrentSystemCost] = useState(50000);
  const [timeSpentMonthly, setTimeSpentMonthly] = useState(40);
  const [averageSalary, setAverageSalary] = useState(3000);
  const [showResults, setShowResults] = useState(false);

  const calculateROI = (): ROIMetrics => {
    // Coûts actuels
    const monthlyOpCosts = currentSystemCost / 12;
    const timeWasteCost = (employees * timeSpentMonthly * averageSalary) / 160; // 160h/mois
    const currentMonthlyCosts = monthlyOpCosts + timeWasteCost;

    // Coûts avec UDC (réduction de 60% des coûts opérationnels + 70% de temps économisé)
    const newOpCosts = monthlyOpCosts * 0.4;
    const newTimeWaste = timeWasteCost * 0.3;
    const udcMonthlyCost = employees * 15; // 15$ par utilisateur/mois
    const newMonthlyCosts = newOpCosts + newTimeWaste + udcMonthlyCost;

    const monthlySavings = currentMonthlyCosts - newMonthlyCosts;
    const annualSavings = monthlySavings * 12;
    const implementationCost = 25000; // Coût de migration
    
    const roi = ((annualSavings - implementationCost) / implementationCost) * 100;
    const paybackPeriod = implementationCost / monthlySavings;

    return {
      currentCosts: currentMonthlyCosts * 12,
      newCosts: newMonthlyCosts * 12,
      savings: monthlySavings,
      roi: Math.round(roi),
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      annualSavings: Math.round(annualSavings)
    };
  };

  const metrics = calculateROI();

  const handleCalculate = () => {
    setShowResults(true);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
        >
          Calculateur ROI Personnalisé
        </motion.h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Découvrez les économies réelles que UDC peut générer pour votre organisation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire de saisie */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold">Vos Paramètres</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="employees">Nombre d'employés</Label>
              <Input
                id="employees"
                type="number"
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value))}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground">
                Personnel utilisant les systèmes de télécommunications
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentCost">Coûts système actuels ($/an)</Label>
              <Input
                id="currentCost"
                type="number"
                value={currentSystemCost}
                onChange={(e) => setCurrentSystemCost(Number(e.target.value))}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground">
                Incluant licences, maintenance, infrastructure
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeSpent">Temps perdu mensuel (heures/employé)</Label>
              <Input
                id="timeSpent"
                type="number"
                value={timeSpentMonthly}
                onChange={(e) => setTimeSpentMonthly(Number(e.target.value))}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground">
                Temps passé sur tâches manuelles/inefficaces
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salaire moyen mensuel ($)</Label>
              <Input
                id="salary"
                type="number"
                value={averageSalary}
                onChange={(e) => setAverageSalary(Number(e.target.value))}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground">
                Salaire moyen de vos équipes techniques
              </p>
            </div>

            <Button 
              onClick={handleCalculate} 
              size="lg" 
              className="w-full"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Calculer mon ROI
            </Button>
          </div>
        </Card>

        {/* Résultats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: showResults ? 1 : 0.3, scale: showResults ? 1 : 0.95 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h3 className="text-2xl font-bold">Vos Économies Projetées</h3>
            </div>

            {showResults && (
              <div className="space-y-6">
                {/* Charts */}
                <div className="space-y-6">
                  {/* Cost Comparison Chart */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Comparaison des Coûts
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={[
                          { name: 'Système actuel', value: metrics.currentCosts },
                          { name: 'Avec UDC', value: metrics.newCosts }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => `$${value.toLocaleString()}`}
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                        />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* ROI Timeline */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Évolution du ROI sur 3 ans
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart
                        data={[
                          { year: 'Année 0', savings: -25000, cumulative: -25000 },
                          { year: 'Année 1', savings: metrics.annualSavings, cumulative: metrics.annualSavings - 25000 },
                          { year: 'Année 2', savings: metrics.annualSavings, cumulative: (metrics.annualSavings * 2) - 25000 },
                          { year: 'Année 3', savings: metrics.annualSavings, cumulative: (metrics.annualSavings * 3) - 25000 }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => `$${value.toLocaleString()}`}
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="cumulative" stroke="#22c55e" name="Cumul des économies" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                {/* ROI Principal */}
                <div className="text-center p-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white">
                  <div className="text-4xl font-bold mb-2">{metrics.roi}%</div>
                  <div className="text-lg">Retour sur Investissement</div>
                  <div className="text-sm opacity-90 mt-1">
                    Récupération en {metrics.paybackPeriod} mois
                  </div>
                </div>

                {/* Métriques détaillées */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <DollarSign className="h-6 w-6 mx-auto text-green-600 mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      ${metrics.annualSavings.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Économies annuelles</div>
                  </div>

                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(timeSpentMonthly * 0.7)}h
                    </div>
                    <div className="text-sm text-muted-foreground">Temps économisé/mois</div>
                  </div>
                </div>

                {/* Comparaison coûts */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                    <span className="font-medium">Coûts actuels (annuels)</span>
                    <Badge variant="destructive">
                      ${Math.round(metrics.currentCosts).toLocaleString()}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                    <span className="font-medium">Coûts avec UDC</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ${Math.round(metrics.newCosts).toLocaleString()}
                    </Badge>
                  </div>
                </div>

                {/* Alertes et recommandations */}
                <div className="space-y-3">
                  {metrics.roi > 200 && (
                    <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <div className="font-medium text-green-800 dark:text-green-600">
                          Excellent potentiel d'économies !
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-500">
                          Votre organisation bénéficierait grandement de UDC
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {metrics.paybackPeriod < 6 && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <div className="font-medium text-blue-800 dark:text-blue-600">
                          Récupération rapide
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-500">
                          Investissement rentabilisé en moins de 6 mois
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button size="lg" className="w-full bg-gradient-to-r from-green-600 to-blue-600">
                  Demander une Demo Personnalisée
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}