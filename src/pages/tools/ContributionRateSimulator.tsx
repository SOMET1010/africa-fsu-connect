import React from 'react';
import { Percent, TrendingUp, DollarSign, Clock, Target, AlertTriangle } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { GlassCard } from '@/components/ui/glass-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useFSUCalculations, formatCurrency, formatNumber } from '@/hooks/useFSUCalculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, ReferenceLine } from 'recharts';

const ContributionRateSimulator: React.FC = () => {
  const {
    contributionData,
    contributionResult,
    updateContributionData,
    resetContributionData,
  } = useFSUCalculations();

  const coverageGap = contributionData.coverageTarget - contributionData.currentCoverage;

  return (
    <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <PageHero
          badge="Outil FSU"
          badgeIcon={Percent}
          title="Simulateur de Taux de Contribution"
          subtitle="Estimez le taux de contribution optimal pour atteindre vos objectifs de couverture"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panneau de configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Objectifs de couverture */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[hsl(var(--nx-gold))]" />
                Objectifs de Couverture
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white/80 flex items-center justify-between">
                      <span>Couverture actuelle</span>
                      <span className="text-[hsl(var(--nx-cyan))] font-medium">
                        {contributionData.currentCoverage}%
                      </span>
                    </Label>
                    <Slider
                      value={[contributionData.currentCoverage]}
                      onValueChange={([value]) => updateContributionData({ currentCoverage: value })}
                      min={0}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80 flex items-center justify-between">
                      <span>Objectif de couverture</span>
                      <span className="text-[hsl(var(--nx-gold))] font-medium">
                        {contributionData.coverageTarget}%
                      </span>
                    </Label>
                    <Slider
                      value={[contributionData.coverageTarget]}
                      onValueChange={([value]) => updateContributionData({ coverageTarget: value })}
                      min={0}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-white/60 text-sm mb-2">Écart à combler</p>
                    <p className="text-4xl font-bold" style={{ 
                      color: coverageGap > 10 ? 'hsl(var(--warning))' : coverageGap > 0 ? 'hsl(var(--nx-cyan))' : 'hsl(var(--success))'
                    }}>
                      {coverageGap}%
                    </p>
                    <p className="text-white/50 text-sm mt-2">de la population</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Données financières */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[hsl(var(--nx-gold))]" />
                Données Financières
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Investissement nécessaire ($)</Label>
                  <Input
                    type="number"
                    value={contributionData.estimatedInvestmentNeeded || ''}
                    onChange={(e) => updateContributionData({ 
                      estimatedInvestmentNeeded: parseFloat(e.target.value) || 0 
                    })}
                    placeholder="Ex: 100000000"
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-white/40 text-xs">Budget total pour atteindre l'objectif</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Revenus secteur télécom ($)</Label>
                  <Input
                    type="number"
                    value={contributionData.sectorRevenue || ''}
                    onChange={(e) => updateContributionData({ 
                      sectorRevenue: parseFloat(e.target.value) || 0 
                    })}
                    placeholder="Ex: 500000000"
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-white/40 text-xs">Chiffre d'affaires annuel du secteur</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Horizon (années)
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={contributionData.timeHorizon}
                    onChange={(e) => updateContributionData({ 
                      timeHorizon: parseInt(e.target.value) || 5 
                    })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-white/40 text-xs">Durée pour atteindre l'objectif</p>
                </div>
              </div>
            </GlassCard>

            {/* Comparaison des scénarios */}
            {contributionResult.scenarios.length > 0 && contributionData.sectorRevenue > 0 && (
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[hsl(var(--nx-gold))]" />
                  Comparaison des Scénarios
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={contributionResult.scenarios}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="rate" 
                      stroke="rgba(255,255,255,0.5)"
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="rgba(255,255,255,0.5)"
                      tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="rgba(255,255,255,0.5)"
                      tickFormatter={(v) => `${v} ans`}
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--nx-night))', 
                        border: '1px solid rgba(255,255,255,0.1)' 
                      }}
                      formatter={(value: number, name: string) => {
                        if (name === 'Contribution annuelle') return formatCurrency(value);
                        if (name === 'Années pour atteindre l\'objectif') return `${value} ans`;
                        return value;
                      }}
                    />
                    <Bar 
                      yAxisId="left"
                      dataKey="annual" 
                      name="Contribution annuelle"
                      fill="hsl(var(--nx-gold))"
                    >
                      {contributionResult.scenarios.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={entry.rate === Math.round(contributionResult.requiredRate) 
                            ? 'hsl(var(--nx-cyan))' 
                            : 'hsl(var(--nx-gold))'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                {/* Tableau des scénarios */}
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-white/60 py-2 px-3">Taux</th>
                        <th className="text-right text-white/60 py-2 px-3">Contribution/an</th>
                        <th className="text-right text-white/60 py-2 px-3">Années nécessaires</th>
                        <th className="text-center text-white/60 py-2 px-3">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contributionResult.scenarios.map((scenario) => {
                        const isOptimal = scenario.rate >= contributionResult.requiredRate && 
                          scenario.rate < contributionResult.requiredRate + 0.5;
                        return (
                          <tr 
                            key={scenario.rate}
                            className={`border-b border-white/5 ${isOptimal ? 'bg-[hsl(var(--nx-cyan)/0.1)]' : ''}`}
                          >
                            <td className="py-2 px-3 text-white">{scenario.rate}%</td>
                            <td className="py-2 px-3 text-right text-white">
                              {formatCurrency(scenario.annual)}
                            </td>
                            <td className="py-2 px-3 text-right text-white">
                              {scenario.yearsToGoal === Infinity ? '∞' : `${scenario.yearsToGoal} ans`}
                            </td>
                            <td className="py-2 px-3 text-center">
                              {scenario.yearsToGoal <= contributionData.timeHorizon ? (
                                <span className="text-[hsl(var(--success))] text-xs">✓ Atteint</span>
                              ) : (
                                <span className="text-[hsl(var(--warning))] text-xs">Insuffisant</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Panneau des résultats */}
          <div className="space-y-6">
            {/* Résultats principaux */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Résultats</h2>
                <ModernButton variant="ghost" size="sm" onClick={resetContributionData}>
                  Réinitialiser
                </ModernButton>
              </div>

              <div className="space-y-4">
                {contributionData.sectorRevenue > 0 && contributionData.estimatedInvestmentNeeded > 0 ? (
                  <>
                    <div className="p-4 bg-[hsl(var(--nx-gold)/0.1)] rounded-lg border border-[hsl(var(--nx-gold)/0.2)]">
                      <p className="text-[hsl(var(--nx-gold))] text-sm">Taux de contribution requis</p>
                      <p className="text-3xl font-bold text-white">
                        {contributionResult.requiredRate.toFixed(2)}%
                      </p>
                      <p className="text-white/50 text-sm mt-1">
                        des revenus du secteur télécom
                      </p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-white/60 text-sm">Contribution annuelle</p>
                      <p className="text-2xl font-semibold text-white">
                        {formatCurrency(contributionResult.annualContribution)}
                      </p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-white/60 text-sm">Contribution totale sur {contributionData.timeHorizon} ans</p>
                      <p className="text-2xl font-semibold text-white">
                        {formatCurrency(contributionResult.totalContribution)}
                      </p>
                    </div>

                    <div className="p-4 bg-[hsl(var(--nx-cyan)/0.1)] rounded-lg border border-[hsl(var(--nx-cyan)/0.2)]">
                      <p className="text-[hsl(var(--nx-cyan))] text-sm">Progression annuelle</p>
                      <p className="text-2xl font-bold text-white">
                        +{contributionResult.coverageGainPerYear.toFixed(2)}%
                      </p>
                      <p className="text-white/50 text-sm mt-1">
                        de couverture par an
                      </p>
                    </div>

                    {contributionResult.priceImpactEstimate > 0.5 && (
                      <div className="p-4 bg-[hsl(var(--warning)/0.1)] rounded-lg border border-[hsl(var(--warning)/0.2)]">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-[hsl(var(--warning))] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[hsl(var(--warning))] text-sm font-medium">
                              Impact estimé sur les prix
                            </p>
                            <p className="text-white text-lg font-semibold">
                              ~{contributionResult.priceImpactEstimate.toFixed(2)}%
                            </p>
                            <p className="text-white/50 text-xs mt-1">
                              Hypothèse: 50% répercuté sur les consommateurs
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-white/50">
                    <p>Renseignez les données financières pour voir les résultats</p>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Benchmarks régionaux */}
            <GlassCard className="p-6">
              <h3 className="text-[hsl(var(--nx-gold))] font-semibold mb-3">📊 Benchmarks Africains</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Afrique du Sud</span>
                  <span className="text-white">0.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Maroc (Pay or Play)</span>
                  <span className="text-white">2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Nigeria</span>
                  <span className="text-white">2.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">RDC</span>
                  <span className="text-white">5%</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-white/70">Moyenne africaine</span>
                  <span className="text-[hsl(var(--nx-gold))] font-medium">~1-2%</span>
                </div>
              </div>
            </GlassCard>

            {/* Conseils */}
            <GlassCard className="p-6">
              <h3 className="text-[hsl(var(--nx-cyan))] font-semibold mb-3">💡 Recommandations GSMA</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>• Calibrer le taux sur le déficit d'accès réel</li>
                <li>• Éviter des taux trop élevés (impact prix)</li>
                <li>• Considérer les modèles alternatifs</li>
                <li>• Réévaluer périodiquement (3-5 ans)</li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionRateSimulator;
