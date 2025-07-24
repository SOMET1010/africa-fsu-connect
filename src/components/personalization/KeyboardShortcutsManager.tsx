import { useEffect, useCallback } from 'react';
import { useAdvancedPersonalization } from '@/hooks/useAdvancedPersonalization';
import { toast } from 'sonner';

interface ShortcutAction {
  [key: string]: () => void;
}

export const KeyboardShortcutsManager = () => {
  const { learningData, trackUserAction } = useAdvancedPersonalization();

  // Actions disponibles pour les raccourcis
  const shortcutActions: ShortcutAction = {
    'ctrl+d': () => {
      window.location.href = '/dashboard';
      trackUserAction('shortcut_used', { shortcut: 'ctrl+d', action: 'navigate_dashboard' });
    },
    'ctrl+o': () => {
      window.location.href = '/organizations';
      trackUserAction('shortcut_used', { shortcut: 'ctrl+o', action: 'navigate_organizations' });
    },
    'ctrl+p': () => {
      window.location.href = '/projects';
      trackUserAction('shortcut_used', { shortcut: 'ctrl+p', action: 'navigate_projects' });
    },
    'ctrl+i': () => {
      window.location.href = '/indicators';
      trackUserAction('shortcut_used', { shortcut: 'ctrl+i', action: 'navigate_indicators' });
    },
    'ctrl+m': () => {
      window.location.href = '/map';
      trackUserAction('shortcut_used', { shortcut: 'ctrl+m', action: 'navigate_map' });
    },
    'ctrl+shift+p': () => {
      window.location.href = '/preferences/advanced';
      trackUserAction('shortcut_used', { shortcut: 'ctrl+shift+p', action: 'navigate_preferences' });
    }
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const combination = [];
    
    if (event.ctrlKey) combination.push('ctrl');
    if (event.shiftKey) combination.push('shift');
    if (event.altKey) combination.push('alt');
    combination.push(event.key.toLowerCase());
    
    const shortcut = combination.join('+');
    
    if (shortcutActions[shortcut]) {
      event.preventDefault();
      shortcutActions[shortcut]();
      
      // Afficher une notification
      toast.success(`Raccourci utilisé: ${shortcut}`);
    }
  }, [shortcutActions, trackUserAction]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return null; // Ce composant n'a pas d'interface visuelle
};