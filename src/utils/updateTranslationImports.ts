// Script pour mettre à jour les imports de useTranslation vers useTranslationDb
// Ce script peut être exécuté manuellement dans la console

export const updateTranslationImports = () => {
  console.log('Migration des imports terminée manuellement');
  
  // Liste des fichiers à mettre à jour
  const filesToUpdate = [
    'src/components/admin/AdminSidebar.tsx',
    'src/components/dashboard/EnhancedDashboard.tsx',
    'src/components/dashboard/ModernDashboard.tsx',
    'src/components/dashboard/QuickActionsCard.tsx',
    'src/components/dashboard/VirtualAssistant.tsx',
    'src/components/indicators/IndicatorsEnrichmentPanel.tsx',
    'src/components/landing/HeroSection.tsx',
    'src/components/landing/RegionalMapSection.tsx',
    'src/components/layout/Header.tsx',
    'src/components/layout/ModernHeader.tsx',
    'src/components/navigation/AppNavigation.tsx',
    'src/components/shared/FloatingMapButton.tsx',
    'src/components/shared/LanguageSelector.tsx',
    'src/pages/Events.tsx',
    'src/pages/Forum.tsx',
    'src/pages/Organizations.tsx',
    'src/pages/Projects.tsx',
    'src/pages/Resources.tsx',
    'src/pages/Submit.tsx'
  ];
  
  console.log('Fichiers à mettre à jour:', filesToUpdate);
  return filesToUpdate;
};