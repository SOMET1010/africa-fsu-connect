import { useState, useEffect, useCallback } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';

export interface PersonalizationProfile {
  id: string;
  name: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  dashboard: {
    layout: 'compact' | 'spacious' | 'minimal';
    widgets: string[];
    customOrder: string[];
  };
  shortcuts: Record<string, string>;
  interface: {
    complexity: 'simple' | 'standard' | 'advanced';
    density: 'comfortable' | 'compact' | 'spacious';
    animations: boolean;
  };
  usage: {
    frequentActions: string[];
    preferredSections: string[];
    timeOfDay: 'morning' | 'afternoon' | 'evening';
  };
}

export const useAdvancedPersonalization = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { user } = useAuth();
  const { enabledWidgets, toggleWidget, reorderWidgets } = useDashboardLayout();
  const [profiles, setProfiles] = useState<PersonalizationProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<string>('default');
  const [learningData, setLearningData] = useState<Record<string, any>>({});

  // Apprentissage automatique des habitudes
  const trackUserAction = useCallback((action: string, context: Record<string, any>) => {
    const now = new Date();
    const timeOfDay = now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening';
    
    setLearningData(prev => ({
      ...prev,
      actions: [...(prev.actions || []), { action, context, timestamp: now, timeOfDay }],
      frequency: {
        ...prev.frequency,
        [action]: (prev.frequency?.[action] || 0) + 1
      }
    }));
  }, []);

  // Génération de suggestions intelligentes
  const generateSuggestions = useCallback(() => {
    const actions = learningData.actions || [];
    const frequency = learningData.frequency || {};
    
    const suggestions = [];
    
    // Suggestions basées sur la fréquence
    const frequentActions = Object.entries(frequency)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([action]) => action);

    if (frequentActions.length > 0) {
      suggestions.push({
        type: 'shortcut',
        title: 'Créer des raccourcis pour vos actions fréquentes',
        description: `Créer des raccourcis pour: ${frequentActions.join(', ')}`,
        actions: frequentActions
      });
    }

    // Suggestions basées sur l'heure
    const now = new Date();
    const currentTimeOfDay = now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening';
    
    if (currentTimeOfDay === 'evening' && preferences.theme !== 'dark') {
      suggestions.push({
        type: 'theme',
        title: 'Passer en mode sombre',
        description: 'Il fait sombre, voulez-vous activer le thème sombre?',
        action: () => updatePreferences({ theme: 'dark' })
      });
    }

    return suggestions;
  }, [learningData, preferences, updatePreferences]);

  // Création d'un profil personnalisé
  const createPersonalizationProfile = useCallback((name: string, config: Partial<PersonalizationProfile>) => {
    const newProfile: PersonalizationProfile = {
      id: `profile_${Date.now()}`,
      name,
      theme: {
        primary: 'hsl(221, 83%, 53%)',
        secondary: 'hsl(210, 40%, 98%)',
        accent: 'hsl(221, 83%, 53%)',
        background: 'hsl(0, 0%, 100%)',
        ...config.theme
      },
      dashboard: {
        layout: 'standard',
        widgets: ['stats', 'recent-activity', 'quick-actions'],
        customOrder: [],
        ...config.dashboard
      },
      shortcuts: config.shortcuts || {},
      interface: {
        complexity: 'standard',
        density: 'comfortable',
        animations: true,
        ...config.interface
      },
      usage: {
        frequentActions: [],
        preferredSections: [],
        timeOfDay: 'morning',
        ...config.usage
      }
    };

    setProfiles(prev => [...prev, newProfile]);
    return newProfile;
  }, []);

  // Application d'un profil
  const applyProfile = useCallback(async (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;

    // Appliquer les préférences du profil
    await updatePreferences({
      theme: profile.theme.primary.includes('dark') ? 'dark' : 'light',
      layout: {
        ...preferences.layout,
        compactMode: profile.dashboard.layout === 'compact',
        animationsEnabled: profile.interface.animations
      },
      dashboard: {
        ...preferences.dashboard,
        favoriteWidgets: profile.dashboard.widgets,
        widgetOrder: profile.dashboard.customOrder.length > 0 
          ? profile.dashboard.customOrder 
          : preferences.dashboard.widgetOrder
      }
    });

    setCurrentProfile(profileId);
  }, [profiles, preferences, updatePreferences]);

  // Profils prédéfinis par secteur
  const getPredefinedProfiles = useCallback(() => {
    return [
      {
        id: 'technical',
        name: 'Profil Technique',
        description: 'Optimisé pour les développeurs et analystes',
        theme: { primary: 'hsl(142, 76%, 36%)', accent: 'hsl(142, 76%, 36%)' },
        dashboard: { layout: 'compact', widgets: ['stats', 'indicators', 'projects'] },
        interface: { complexity: 'advanced', density: 'compact' }
      },
      {
        id: 'administrative',
        name: 'Profil Administratif',
        description: 'Interface claire pour la gestion',
        theme: { primary: 'hsl(221, 83%, 53%)', accent: 'hsl(221, 83%, 53%)' },
        dashboard: { layout: 'spacious', widgets: ['stats', 'recent-activity', 'organizations'] },
        interface: { complexity: 'standard', density: 'spacious' }
      },
      {
        id: 'collaborative',
        name: 'Profil Collaboratif',
        description: 'Centré sur les échanges et le travail d\'équipe',
        theme: { primary: 'hsl(262, 83%, 58%)', accent: 'hsl(262, 83%, 58%)' },
        dashboard: { layout: 'standard', widgets: ['forum', 'events', 'collaboration'] },
        interface: { complexity: 'simple', density: 'comfortable' }
      }
    ];
  }, []);

  // Apprentissage adaptatif
  useEffect(() => {
    const suggestions = generateSuggestions();
    
    // Auto-application de certaines suggestions
    suggestions.forEach(suggestion => {
      if (suggestion.type === 'theme' && suggestion.action) {
        // Auto-application des changements de thème selon l'heure
        const lastThemeChange = localStorage.getItem('lastAutoThemeChange');
        const today = new Date().toDateString();
        
        if (lastThemeChange !== today) {
          suggestion.action();
          localStorage.setItem('lastAutoThemeChange', today);
        }
      }
    });
  }, [generateSuggestions]);

  return {
    profiles,
    currentProfile,
    learningData,
    trackUserAction,
    generateSuggestions,
    createPersonalizationProfile,
    applyProfile,
    getPredefinedProfiles,
    enabledWidgets,
    toggleWidget,
    reorderWidgets
  };
};