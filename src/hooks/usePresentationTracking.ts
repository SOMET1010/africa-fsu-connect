import { useEffect, useRef } from 'react';
import { createAnalyticsTracker } from '@/lib/analytics-tracker';

export const usePresentationTracking = () => {
  const trackerRef = useRef(createAnalyticsTracker());

  useEffect(() => {
    const tracker = trackerRef.current;

    return () => {
      tracker.destroy();
    };
  }, []);

  const trackSectionView = (sectionIndex: number) => {
    trackerRef.current.trackSectionView(sectionIndex);
  };

  const trackInteraction = (type: string, data?: any) => {
    trackerRef.current.trackInteraction(type, data);
  };

  const trackExport = (format: string) => {
    trackerRef.current.trackExport(format);
  };

  const trackShare = () => {
    trackerRef.current.trackShare();
  };

  const trackCompletion = () => {
    trackerRef.current.trackCompletion();
  };

  return {
    trackSectionView,
    trackInteraction,
    trackExport,
    trackShare,
    trackCompletion,
  };
};
