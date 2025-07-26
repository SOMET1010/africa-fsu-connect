import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvancedAnalyticsDashboard } from '@/components/analytics/AdvancedAnalyticsDashboard';
import { ABTestingDashboard } from '@/components/analytics/ABTestingDashboard';
import { PrivacyCompliancePanel } from '@/components/analytics/PrivacyCompliancePanel';
import { AnalyticsPage } from '@/components/analytics/AnalyticsPage';

export default function AdvancedAnalytics() {
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="behavioral">Behavioral Analytics</TabsTrigger>
          <TabsTrigger value="abtesting">A/B Testing</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AnalyticsPage />
        </TabsContent>

        <TabsContent value="behavioral">
          <AdvancedAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="abtesting">
          <ABTestingDashboard />
        </TabsContent>

        <TabsContent value="privacy">
          <PrivacyCompliancePanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}