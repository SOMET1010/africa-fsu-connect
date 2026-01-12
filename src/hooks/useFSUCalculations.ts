import { useState, useMemo, useCallback } from 'react';

// Types pour le calculateur de coûts
export interface CAPEXItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unitCost: number;
}

export interface OPEXItem {
  id: string;
  category: string;
  description: string;
  annualCost: number;
}

export interface ProjectCostData {
  projectName: string;
  projectDuration: number; // en années
  targetPopulation: number;
  capexItems: CAPEXItem[];
  opexItems: OPEXItem[];
  contingencyRate: number; // % de contingence
  inflationRate: number; // % d'inflation annuelle pour OPEX
}

export interface CostCalculationResult {
  totalCAPEX: number;
  totalOPEXAnnual: number;
  totalOPEXLifetime: number;
  totalProjectCost: number;
  costPerBeneficiary: number;
  contingencyAmount: number;
  yearlyBreakdown: { year: number; capex: number; opex: number; total: number; cumulative: number }[];
  categoryBreakdown: { category: string; amount: number; percentage: number }[];
}

// Types pour le simulateur de taux de contribution
export interface ContributionSimulationData {
  coverageTarget: number; // % de population
  currentCoverage: number; // % actuel
  estimatedInvestmentNeeded: number; // en USD
  timeHorizon: number; // en années
  sectorRevenue: number; // revenus annuels du secteur télécom
  currentContributionRate: number; // taux actuel en %
}

export interface ContributionSimulationResult {
  requiredRate: number;
  annualContribution: number;
  totalContribution: number;
  coverageGainPerYear: number;
  priceImpactEstimate: number; // impact estimé sur les prix en %
  scenarios: { rate: number; annual: number; yearsToGoal: number }[];
}

// Catégories CAPEX standard
export const CAPEX_CATEGORIES = [
  { id: 'equipment', name: 'Équipements réseau', description: 'Antennes, BTS, routeurs, etc.' },
  { id: 'infrastructure', name: 'Infrastructure', description: 'Pylônes, shelters, câblage' },
  { id: 'installation', name: 'Installation', description: 'Main d\'œuvre, transport, montage' },
  { id: 'power', name: 'Énergie', description: 'Générateurs, solaire, batteries' },
  { id: 'backhaul', name: 'Transmission', description: 'Fibre, faisceaux hertziens' },
  { id: 'civil', name: 'Génie civil', description: 'Terrassement, fondations' },
  { id: 'licenses', name: 'Licences', description: 'Logiciels, autorisations' },
  { id: 'other', name: 'Autres', description: 'Autres coûts d\'investissement' },
];

// Catégories OPEX standard
export const OPEX_CATEGORIES = [
  { id: 'energy', name: 'Énergie', description: 'Électricité, carburant' },
  { id: 'maintenance', name: 'Maintenance', description: 'Entretien préventif et correctif' },
  { id: 'security', name: 'Sécurité', description: 'Gardiennage, surveillance' },
  { id: 'personnel', name: 'Personnel', description: 'Techniciens, superviseurs' },
  { id: 'transmission', name: 'Transmission', description: 'Location de liens, bande passante' },
  { id: 'taxes', name: 'Taxes et redevances', description: 'Taxes locales, redevances' },
  { id: 'insurance', name: 'Assurance', description: 'Assurance équipements' },
  { id: 'other', name: 'Autres', description: 'Autres coûts opérationnels' },
];

// Hook principal pour les calculs FSU
export function useFSUCalculations() {
  const [projectData, setProjectData] = useState<ProjectCostData>({
    projectName: '',
    projectDuration: 8,
    targetPopulation: 0,
    capexItems: [],
    opexItems: [],
    contingencyRate: 10,
    inflationRate: 3,
  });

  const [contributionData, setContributionData] = useState<ContributionSimulationData>({
    coverageTarget: 95,
    currentCoverage: 85,
    estimatedInvestmentNeeded: 0,
    timeHorizon: 5,
    sectorRevenue: 0,
    currentContributionRate: 1,
  });

  // Calcul des coûts du projet
  const costResult = useMemo((): CostCalculationResult => {
    const totalCAPEX = projectData.capexItems.reduce(
      (sum, item) => sum + item.quantity * item.unitCost,
      0
    );

    const totalOPEXAnnual = projectData.opexItems.reduce(
      (sum, item) => sum + item.annualCost,
      0
    );

    // Calcul OPEX sur la durée de vie avec inflation
    let totalOPEXLifetime = 0;
    const yearlyBreakdown: CostCalculationResult['yearlyBreakdown'] = [];
    let cumulative = 0;

    for (let year = 1; year <= projectData.projectDuration; year++) {
      const inflationMultiplier = Math.pow(1 + projectData.inflationRate / 100, year - 1);
      const yearlyOPEX = totalOPEXAnnual * inflationMultiplier;
      totalOPEXLifetime += yearlyOPEX;

      const yearlyCapex = year === 1 ? totalCAPEX : 0;
      const yearlyTotal = yearlyCapex + yearlyOPEX;
      cumulative += yearlyTotal;

      yearlyBreakdown.push({
        year,
        capex: yearlyCapex,
        opex: yearlyOPEX,
        total: yearlyTotal,
        cumulative,
      });
    }

    const subtotal = totalCAPEX + totalOPEXLifetime;
    const contingencyAmount = subtotal * (projectData.contingencyRate / 100);
    const totalProjectCost = subtotal + contingencyAmount;

    const costPerBeneficiary = projectData.targetPopulation > 0
      ? totalProjectCost / projectData.targetPopulation
      : 0;

    // Répartition par catégorie
    const categoryMap = new Map<string, number>();
    
    projectData.capexItems.forEach(item => {
      const current = categoryMap.get(item.category) || 0;
      categoryMap.set(item.category, current + item.quantity * item.unitCost);
    });

    projectData.opexItems.forEach(item => {
      const key = `OPEX - ${item.category}`;
      const current = categoryMap.get(key) || 0;
      // Prendre OPEX annuel moyen pour la répartition
      categoryMap.set(key, current + item.annualCost * projectData.projectDuration);
    });

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalProjectCost > 0 ? (amount / totalProjectCost) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      totalCAPEX,
      totalOPEXAnnual,
      totalOPEXLifetime,
      totalProjectCost,
      costPerBeneficiary,
      contingencyAmount,
      yearlyBreakdown,
      categoryBreakdown,
    };
  }, [projectData]);

  // Simulation du taux de contribution
  const contributionResult = useMemo((): ContributionSimulationResult => {
    const { 
      estimatedInvestmentNeeded, 
      timeHorizon, 
      sectorRevenue,
      coverageTarget,
      currentCoverage,
    } = contributionData;

    if (sectorRevenue <= 0 || timeHorizon <= 0) {
      return {
        requiredRate: 0,
        annualContribution: 0,
        totalContribution: 0,
        coverageGainPerYear: 0,
        priceImpactEstimate: 0,
        scenarios: [],
      };
    }

    const annualInvestmentNeeded = estimatedInvestmentNeeded / timeHorizon;
    const requiredRate = (annualInvestmentNeeded / sectorRevenue) * 100;
    const annualContribution = sectorRevenue * (requiredRate / 100);
    const totalContribution = annualContribution * timeHorizon;
    const coverageGainPerYear = (coverageTarget - currentCoverage) / timeHorizon;
    
    // Estimation de l'impact sur les prix (approximation)
    // Hypothèse: 50% du coût est répercuté sur les consommateurs
    const priceImpactEstimate = requiredRate * 0.5;

    // Scénarios avec différents taux
    const scenarios = [0.5, 1, 1.5, 2, 2.5, 3].map(rate => {
      const annual = sectorRevenue * (rate / 100);
      const yearsToGoal = annual > 0 ? estimatedInvestmentNeeded / annual : Infinity;
      return { rate, annual, yearsToGoal: Math.ceil(yearsToGoal) };
    });

    return {
      requiredRate: Math.round(requiredRate * 100) / 100,
      annualContribution,
      totalContribution,
      coverageGainPerYear: Math.round(coverageGainPerYear * 100) / 100,
      priceImpactEstimate: Math.round(priceImpactEstimate * 100) / 100,
      scenarios,
    };
  }, [contributionData]);

  // Fonctions utilitaires
  const addCAPEXItem = useCallback((item: Omit<CAPEXItem, 'id'>) => {
    setProjectData(prev => ({
      ...prev,
      capexItems: [...prev.capexItems, { ...item, id: crypto.randomUUID() }],
    }));
  }, []);

  const removeCAPEXItem = useCallback((id: string) => {
    setProjectData(prev => ({
      ...prev,
      capexItems: prev.capexItems.filter(item => item.id !== id),
    }));
  }, []);

  const addOPEXItem = useCallback((item: Omit<OPEXItem, 'id'>) => {
    setProjectData(prev => ({
      ...prev,
      opexItems: [...prev.opexItems, { ...item, id: crypto.randomUUID() }],
    }));
  }, []);

  const removeOPEXItem = useCallback((id: string) => {
    setProjectData(prev => ({
      ...prev,
      opexItems: prev.opexItems.filter(item => item.id !== id),
    }));
  }, []);

  const updateProjectData = useCallback((updates: Partial<ProjectCostData>) => {
    setProjectData(prev => ({ ...prev, ...updates }));
  }, []);

  const updateContributionData = useCallback((updates: Partial<ContributionSimulationData>) => {
    setContributionData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetProjectData = useCallback(() => {
    setProjectData({
      projectName: '',
      projectDuration: 8,
      targetPopulation: 0,
      capexItems: [],
      opexItems: [],
      contingencyRate: 10,
      inflationRate: 3,
    });
  }, []);

  const resetContributionData = useCallback(() => {
    setContributionData({
      coverageTarget: 95,
      currentCoverage: 85,
      estimatedInvestmentNeeded: 0,
      timeHorizon: 5,
      sectorRevenue: 0,
      currentContributionRate: 1,
    });
  }, []);

  return {
    // Données
    projectData,
    contributionData,
    // Résultats
    costResult,
    contributionResult,
    // Actions projet
    addCAPEXItem,
    removeCAPEXItem,
    addOPEXItem,
    removeOPEXItem,
    updateProjectData,
    resetProjectData,
    // Actions contribution
    updateContributionData,
    resetContributionData,
    // Constantes
    CAPEX_CATEGORIES,
    OPEX_CATEGORIES,
  };
}

// Fonction utilitaire pour formater les montants
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Fonction utilitaire pour formater les nombres
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num);
}
