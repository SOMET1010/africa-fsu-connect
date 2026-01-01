import { supabase } from "@/integrations/supabase/client";
import { logger } from '@/utils/logger';

interface SessionData {
  sessionId: string;
  startTime: number;
  sectionTimes: Record<number, number>;
  interactions: Array<{ type: string; timestamp: number; data?: any }>;
  currentSection: number;
}

class PresentationAnalytics {
  private sessionData: SessionData;
  private flushInterval: NodeJS.Timeout | null = null;
  private sectionStartTime: number = Date.now();

  constructor() {
    this.sessionData = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      sectionTimes: {},
      interactions: [],
      currentSection: 0,
    };
    this.startFlushInterval();
    this.setupBeforeUnload();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private startFlushInterval() {
    // Flush every 10 seconds
    this.flushInterval = setInterval(() => {
      this.flush();
    }, 10000);
  }

  private setupBeforeUnload() {
    window.addEventListener('beforeunload', () => {
      this.flush(true);
    });
  }

  trackSectionView(sectionIndex: number) {
    // Save time for previous section
    if (this.sessionData.currentSection !== sectionIndex) {
      const timeSpent = Math.floor((Date.now() - this.sectionStartTime) / 1000);
      this.sessionData.sectionTimes[this.sessionData.currentSection] =
        (this.sessionData.sectionTimes[this.sessionData.currentSection] || 0) + timeSpent;
      
      this.sessionData.currentSection = sectionIndex;
      this.sectionStartTime = Date.now();
      
      this.trackInteraction('section_view', { sectionIndex });
    }
  }

  trackInteraction(type: string, data?: any) {
    this.sessionData.interactions.push({
      type,
      timestamp: Date.now(),
      data,
    });
  }

  trackExport(format: string) {
    this.trackInteraction('export', { format });
  }

  trackShare() {
    this.trackInteraction('share');
  }

  trackCompletion() {
    this.trackInteraction('completion');
  }

  private getDeviceType(): string {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  async flush(isFinal: boolean = false) {
    try {
      const totalDuration = Math.floor((Date.now() - this.sessionData.startTime) / 1000);
      const visitedSections = Object.keys(this.sessionData.sectionTimes).map(Number);
      const completionRate = (visitedSections.length / 8) * 100;

      const interactionCounts = this.sessionData.interactions.reduce((acc, int) => {
        acc[int.type] = (acc[int.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const sessionRecord = {
        session_id: this.sessionData.sessionId,
        started_at: new Date(this.sessionData.startTime).toISOString(),
        ended_at: isFinal ? new Date().toISOString() : null,
        total_duration: totalDuration,
        user_agent: navigator.userAgent,
        sections_visited: visitedSections,
        section_durations: this.sessionData.sectionTimes,
        interactions: interactionCounts,
        completed: completionRate === 100,
        completion_rate: completionRate,
        device_type: this.getDeviceType(),
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
      };

      const { error } = await supabase
        .from('presentation_sessions')
        .upsert(sessionRecord, {
          onConflict: 'session_id',
        });

      if (error) {
        logger.error('Failed to save analytics', error);
      }
    } catch (error) {
      logger.error('Analytics flush error', error);
    }
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flush(true);
  }
}

export const createAnalyticsTracker = () => new PresentationAnalytics();
