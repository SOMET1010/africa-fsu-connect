import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/utils/logger';

interface DualScreenState {
  isSupported: boolean;
  isPresenterMode: boolean;
  audienceWindow: Window | null;
}

export const useDualScreen = () => {
  const [state, setState] = useState<DualScreenState>({
    isSupported: typeof window !== 'undefined' && 'screen' in window,
    isPresenterMode: false,
    audienceWindow: null,
  });

  const openPresenterMode = useCallback((currentSection: number) => {
    try {
      // Open audience view in new window
      const audienceWin = window.open(
        `/presentation?mode=audience&section=${currentSection}`,
        'audienceView',
        'width=1920,height=1080,menubar=no,toolbar=no,location=no,status=no'
      );

      if (audienceWin) {
        setState(prev => ({
          ...prev,
          isPresenterMode: true,
          audienceWindow: audienceWin,
        }));

        // Setup broadcast channel for sync
        const bc = new BroadcastChannel('presentation-sync');
        bc.postMessage({ type: 'presenter-connected' });

        return bc;
      }
    } catch (error) {
      logger.error('Failed to open presenter mode', error);
    }
  }, []);

  const closePresenterMode = useCallback(() => {
    if (state.audienceWindow && !state.audienceWindow.closed) {
      state.audienceWindow.close();
    }
    setState(prev => ({
      ...prev,
      isPresenterMode: false,
      audienceWindow: null,
    }));
  }, [state.audienceWindow]);

  const syncSection = useCallback((sectionIndex: number) => {
    const bc = new BroadcastChannel('presentation-sync');
    bc.postMessage({ type: 'section-change', section: sectionIndex });
  }, []);

  useEffect(() => {
    // Listen for window close
    const handleBeforeUnload = () => {
      closePresenterMode();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      closePresenterMode();
    };
  }, [closePresenterMode]);

  return {
    isSupported: state.isSupported,
    isPresenterMode: state.isPresenterMode,
    openPresenterMode,
    closePresenterMode,
    syncSection,
  };
};
