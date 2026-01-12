import React, { useState } from 'react';
import { Calculator, Plus, Trash2, Download, RefreshCw, DollarSign, Users, Clock, TrendingUp } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { GlassCard } from '@/components/ui/glass-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFSUCalculations, formatCurrency, formatNumber, CAPEX_CATEGORIES, OPEX_CATEGORIES } from '@/hooks/useFSUCalculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--primary))',
  'hsl(var(--accent))',
];

const FSUCostCalculator: React.FC = () => {
  const {
    projectData,
    costResult,
    addCAPEXItem,
    removeCAPEXItem,
    addOPEXItem,
    removeOPEXItem,
    updateProjectData,
    resetProjectData,
  } = useFSUCalculations();

  // État pour les nouveaux items
  const [newCAPEX, setNewCAPEX] = useState({ category: '', description: '', quantity: 1, unitCost: 0 });
  const [newOPEX, setNewOPEX] = useState({ category: '', description: '', annualCost: 0 });

  const handleAddCAPEX = () => {
    if (newCAPEX.category && newCAPEX.unitCost > 0) {
      addCAPEXItem(newCAPEX);
      setNewCAPEX({ category: '', description: '', quantity: 1, unitCost: 0 });
    }
  };

  const handleAddOPEX = () => {
    if (newOPEX.category && newOPEX.annualCost > 0) {
      addOPEXItem(newOPEX);
      setNewOPEX({ category: '', description: '', annualCost: 0 });
    }
  };

  const handleExport = () => {
    const report = {
      projectName: projectData.projectName,
      date: new Date().toISOString(),
      summary: {
        totalCAPEX: costResult.totalCAPEX,
        totalOPEXAnnual: costResult.totalOPEXAnnual,
        totalOPEXLifetime: costResult.totalOPEXLifetime,
        contingency: costResult.contingencyAmount,
        totalProjectCost: costResult.totalProjectCost,
        costPerBeneficiary: costResult.costPerBeneficiary,
        targetPopulation: projectData.targetPopulation,
        projectDuration: projectData.projectDuration,
      },
      capexItems: projectData.capexItems,
      opexItems: projectData.opexItems,
      yearlyBreakdown: costResult.yearlyBreakdown,
      categoryBreakdown: costResult.categoryBreakdown,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fsu-cost-calculation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <PageHero
          badge="Outil FSU"
          badgeIcon={Calculator}
          title="Calculateur de Coûts FSU"
          subtitle="Calculez les coûts complets de vos projets FSU (CAPEX et OPEX) selon les recommandations GSMA"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panneau de configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations du projet */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[hsl(var(--nx-gold))]" />
                Informations du projet
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Nom du projet</Label>
                  <Input
                    value={projectData.projectName}
                    onChange={(e) => updateProjectData({ projectName: e.target.value })}
                    placeholder="Ex: Extension rurale Zone X"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80 flex items-center gap-1">
                    <Users className="w-4 h-4" /> Population cible
                  </Label>
                  <Input
                    type="number"
                    value={projectData.targetPopulation || ''}
                    onChange={(e) => updateProjectData({ targetPopulation: parseInt(e.target.value) || 0 })}
                    placeholder="Nombre de bénéficiaires"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Durée (années)
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={projectData.projectDuration}
                    onChange={(e) => updateProjectData({ projectDuration: parseInt(e.target.value) || 8 })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Contingence (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={30}
                    value={projectData.contingencyRate}
                    onChange={(e) => updateProjectData({ contingencyRate: parseFloat(e.target.value) || 10 })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </GlassCard>

            {/* Tabs CAPEX / OPEX */}
            <GlassCard className="p-6">
              <Tabs defaultValue="capex" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/5">
                  <TabsTrigger value="capex" className="data-[state=active]:bg-[hsl(var(--nx-gold))] data-[state=active]:text-black">
                    CAPEX (Investissement)
                  </TabsTrigger>
                  <TabsTrigger value="opex" className="data-[state=active]:bg-[hsl(var(--nx-cyan))] data-[state=active]:text-black">
                    OPEX (Opérationnel)
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="capex" className="mt-4 space-y-4">
                  {/* Formulaire d'ajout CAPEX */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-white/5 rounded-lg">
                    <Select
                      value={newCAPEX.category}
                      onValueChange={(value) => setNewCAPEX({ ...newCAPEX, category: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {CAPEX_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Description"
                      value={newCAPEX.description}
                      onChange={(e) => setNewCAPEX({ ...newCAPEX, description: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                    <Input
                      type="number"
                      placeholder="Quantité"
                      min={1}
                      value={newCAPEX.quantity}
                      onChange={(e) => setNewCAPEX({ ...newCAPEX, quantity: parseInt(e.target.value) || 1 })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                    <Input
                      type="number"
                      placeholder="Coût unitaire ($)"
                      value={newCAPEX.unitCost || ''}
                      onChange={(e) => setNewCAPEX({ ...newCAPEX, unitCost: parseFloat(e.target.value) || 0 })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                    <ModernButton onClick={handleAddCAPEX} size="sm" className="gap-1">
                      <Plus className="w-4 h-4" /> Ajouter
                    </ModernButton>
                  </div>

                  {/* Liste des items CAPEX */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {projectData.capexItems.length === 0 ? (
                      <p className="text-white/50 text-center py-8">
                        Aucun élément CAPEX. Ajoutez des équipements, installations, etc.
                      </p>
                    ) : (
                      projectData.capexItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex-1">
                            <span className="text-[hsl(var(--nx-gold))] text-sm">{item.category}</span>
                            <p className="text-white text-sm">{item.description || 'Sans description'}</p>
                          </div>
                          <div className="text-right mr-4">
                            <p className="text-white font-medium">
                              {formatCurrency(item.quantity * item.unitCost)}
                            </p>
                            <p className="text-white/50 text-xs">
                              {item.quantity} × {formatCurrency(item.unitCost)}
                            </p>
                          </div>
                          <ModernButton
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCAPEXItem(item.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </ModernButton>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="opex" className="mt-4 space-y-4">
                  {/* Formulaire d'ajout OPEX */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-white/5 rounded-lg">
                    <Select
                      value={newOPEX.category}
                      onValueChange={(value) => setNewOPEX({ ...newOPEX, category: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {OPEX_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Description"
                      value={newOPEX.description}
                      onChange={(e) => setNewOPEX({ ...newOPEX, description: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                    <Input
                      type="number"
                      placeholder="Coût annuel ($)"
                      value={newOPEX.annualCost || ''}
                      onChange={(e) => setNewOPEX({ ...newOPEX, annualCost: parseFloat(e.target.value) || 0 })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                    <ModernButton onClick={handleAddOPEX} size="sm" className="gap-1">
                      <Plus className="w-4 h-4" /> Ajouter
                    </ModernButton>
                  </div>

                  {/* Liste des items OPEX */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {projectData.opexItems.length === 0 ? (
                      <p className="text-white/50 text-center py-8">
                        Aucun élément OPEX. Ajoutez les coûts d'énergie, maintenance, etc.
                      </p>
                    ) : (
                      projectData.opexItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex-1">
                            <span className="text-[hsl(var(--nx-cyan))] text-sm">{item.category}</span>
                            <p className="text-white text-sm">{item.description || 'Sans description'}</p>
                          </div>
                          <div className="text-right mr-4">
                            <p className="text-white font-medium">
                              {formatCurrency(item.annualCost)}/an
                            </p>
                            <p className="text-white/50 text-xs">
                              {formatCurrency(item.annualCost * projectData.projectDuration)} sur {projectData.projectDuration} ans
                            </p>
                          </div>
                          <ModernButton
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOPEXItem(item.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </ModernButton>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </GlassCard>

            {/* Graphiques */}
            {(costResult.totalCAPEX > 0 || costResult.totalOPEXAnnual > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Graphique de flux de trésorerie */}
                <GlassCard className="p-6">
                  <h3 className="text-white font-semibold mb-4">Flux de trésorerie par année</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={costResult.yearlyBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="year" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--nx-night))', border: '1px solid rgba(255,255,255,0.1)' }}
                        labelStyle={{ color: 'white' }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Legend />
                      <Bar dataKey="capex" name="CAPEX" fill="hsl(var(--nx-gold))" />
                      <Bar dataKey="opex" name="OPEX" fill="hsl(var(--nx-cyan))" />
                    </BarChart>
                  </ResponsiveContainer>
                </GlassCard>

                {/* Graphique cumulatif */}
                <GlassCard className="p-6">
                  <h3 className="text-white font-semibold mb-4">Coût cumulatif</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={costResult.yearlyBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="year" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--nx-night))', border: '1px solid rgba(255,255,255,0.1)' }}
                        labelStyle={{ color: 'white' }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Line
                        type="monotone"
                        dataKey="cumulative"
                        name="Coût cumulatif"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </GlassCard>
              </div>
            )}
          </div>

          {/* Panneau des résultats */}
          <div className="space-y-6">
            {/* Résumé des coûts */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[hsl(var(--nx-gold))]" />
                  Résumé des coûts
                </h2>
                <div className="flex gap-2">
                  <ModernButton variant="ghost" size="sm" onClick={resetProjectData}>
                    <RefreshCw className="w-4 h-4" />
                  </ModernButton>
                  <ModernButton variant="outline" size="sm" onClick={handleExport}>
                    <Download className="w-4 h-4" />
                  </ModernButton>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[hsl(var(--nx-gold)/0.1)] rounded-lg border border-[hsl(var(--nx-gold)/0.2)]">
                  <p className="text-[hsl(var(--nx-gold))] text-sm">Total CAPEX</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(costResult.totalCAPEX)}</p>
                </div>

                <div className="p-4 bg-[hsl(var(--nx-cyan)/0.1)] rounded-lg border border-[hsl(var(--nx-cyan)/0.2)]">
                  <p className="text-[hsl(var(--nx-cyan))] text-sm">OPEX annuel</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(costResult.totalOPEXAnnual)}</p>
                  <p className="text-white/50 text-sm mt-1">
                    {formatCurrency(costResult.totalOPEXLifetime)} sur {projectData.projectDuration} ans
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white/60 text-sm">Contingence ({projectData.contingencyRate}%)</p>
                  <p className="text-xl font-semibold text-white">{formatCurrency(costResult.contingencyAmount)}</p>
                </div>

                <div className="h-px bg-white/20" />

                <div className="p-4 bg-[hsl(var(--primary)/0.1)] rounded-lg border border-[hsl(var(--primary)/0.2)]">
                  <p className="text-[hsl(var(--primary-light))] text-sm font-medium">COÛT TOTAL DU PROJET</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(costResult.totalProjectCost)}</p>
                </div>

                {projectData.targetPopulation > 0 && (
                  <div className="p-4 bg-[hsl(var(--success)/0.1)] rounded-lg border border-[hsl(var(--success)/0.2)]">
                    <p className="text-[hsl(var(--success))] text-sm">Coût par bénéficiaire</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(costResult.costPerBeneficiary)}
                    </p>
                    <p className="text-white/50 text-sm mt-1">
                      pour {formatNumber(projectData.targetPopulation)} personnes
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Répartition par catégorie */}
            {costResult.categoryBreakdown.length > 0 && (
              <GlassCard className="p-6">
                <h3 className="text-white font-semibold mb-4">Répartition par catégorie</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={costResult.categoryBreakdown.slice(0, 7)}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="amount"
                      nameKey="category"
                    >
                      {costResult.categoryBreakdown.slice(0, 7).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--nx-night))', border: '1px solid rgba(255,255,255,0.1)' }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {costResult.categoryBreakdown.slice(0, 5).map((cat, index) => (
                    <div key={cat.category} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                        />
                        <span className="text-white/80 truncate max-w-[150px]">{cat.category}</span>
                      </div>
                      <span className="text-white">{cat.percentage.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Conseils méthodologiques */}
            <GlassCard className="p-6">
              <h3 className="text-[hsl(var(--nx-gold))] font-semibold mb-3">💡 Recommandations GSMA</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>• Prévoir une durée de vie de 8 ans minimum</li>
                <li>• Inclure tous les coûts d'énergie et sécurité</li>
                <li>• Appliquer 10-15% de contingence</li>
                <li>• Calculer le coût par bénéficiaire pour comparer</li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FSUCostCalculator;
