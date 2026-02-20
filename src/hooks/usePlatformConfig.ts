import { useState, useCallback } from 'react';
import { PlatformConfiguration, DEFAULT_PLATFORM_CONFIG } from '@/types/platformConfig';

export const usePlatformConfig = () => {
  const [config, setConfig] = useState<PlatformConfiguration>(() => {
    // Charger depuis localStorage si disponible
    const saved = localStorage.getItem('udc_platform_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_PLATFORM_CONFIG;
      }
    }
    return DEFAULT_PLATFORM_CONFIG;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const updateConfig = useCallback(<K extends keyof PlatformConfiguration>(
    section: K,
    value: PlatformConfiguration[K]
  ) => {
    setConfig(prev => ({
      ...prev,
      [section]: value,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const saveConfig = useCallback(async () => {
    setIsSaving(true);
    try {
      // Sauvegarder dans localStorage
      localStorage.setItem('udc_platform_config', JSON.stringify(config));
      setLastSaved(new Date());
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [config]);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_PLATFORM_CONFIG);
    localStorage.removeItem('udc_platform_config');
  }, []);

  const exportToJSON = useCallback(() => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportName = `udc-config-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
  }, [config]);

  const importFromJSON = useCallback((jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString);
      setConfig(imported);
      return true;
    } catch {
      return false;
    }
  }, []);

  const getCompletionPercentage = useCallback(() => {
    let completed = 0;
    let total = 0;

    // Identity
    total += 4;
    if (config.identity.platformName) completed++;
    if (config.identity.url) completed++;
    if (config.identity.logoUrl) completed++;
    if (config.identity.slogan) completed++;

    // Partners
    config.partners.forEach(p => {
      total += 3;
      if (p.contactName) completed++;
      if (p.contactEmail) completed++;
      if (p.contactPhone) completed++;
    });

    // Admins
    config.admins.forEach(a => {
      total += 4;
      if (a.firstName) completed++;
      if (a.lastName) completed++;
      if (a.email) completed++;
      if (a.phone) completed++;
    });

    // Countries
    total += 1;
    if (config.countries.length > 0) completed++;

    // Milestones
    config.milestones.forEach(m => {
      total += 1;
      if (m.targetDate) completed++;
    });

    return Math.round((completed / total) * 100);
  }, [config]);

  return {
    config,
    updateConfig,
    saveConfig,
    resetConfig,
    exportToJSON,
    importFromJSON,
    getCompletionPercentage,
    isSaving,
    lastSaved,
  };
};
