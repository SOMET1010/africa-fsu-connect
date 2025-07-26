import React from 'react';
import { AdaptiveInterface } from '@/components/layout/AdaptiveInterface';
import { AnalyticsPage } from '@/components/analytics/AnalyticsPage';
import { SimplifiedAnalytics } from '@/components/analytics/SimplifiedAnalytics';
import { AdvancedAnalyticsControls } from '@/components/analytics/AdvancedAnalyticsControls';

export default function Analytics() {
  return (
    <AdaptiveInterface
      title="Analytics"
      description="Surveillance des performances de l'application"
      advancedContent={<AdvancedAnalyticsControls />}
      expertContent={<AnalyticsPage />}
    >
      <SimplifiedAnalytics />
    </AdaptiveInterface>
  );
}