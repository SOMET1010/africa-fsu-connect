import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, CheckCircle2 } from 'lucide-react';
import { usePrivacyConsent } from '../privacy/hooks/usePrivacyConsent';
import { useDataManagement } from '../privacy/hooks/useDataManagement';
import { ConsentManager } from '../privacy/components/ConsentManager';
import { DataRightsPanel } from '../privacy/components/DataRightsPanel';

export const PrivacyCompliancePanel = () => {
  const { consent, auditLog, updateConsent, complianceScore } = usePrivacyConsent();
  const { 
    dataRetentionDays, 
    anonymizationEnabled, 
    setAnonymizationEnabled,
    exportUserData,
    deleteUserData 
  } = useDataManagement();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6" />
        <h2 className="text-2xl font-semibold">Privacy & Compliance</h2>
        <Badge variant={complianceScore > 50 ? "default" : "secondary"}>
          {complianceScore.toFixed(0)}% Compliant
        </Badge>
      </div>

      {/* GDPR Compliance Status */}
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          This application is GDPR compliant. All data collection requires explicit consent and can be exported or deleted at any time.
        </AlertDescription>
      </Alert>

      <ConsentManager 
        consent={consent} 
        onUpdateConsent={updateConsent} 
      />

      {/* Data Management */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Data Management
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Data Anonymization</h4>
              <p className="text-sm text-muted-foreground">Personal identifiers are automatically removed</p>
            </div>
            <Switch 
              checked={anonymizationEnabled} 
              onCheckedChange={setAnonymizationEnabled}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Data Retention</h4>
              <p className="text-sm text-muted-foreground">Data automatically deleted after {dataRetentionDays} days</p>
            </div>
            <Badge variant="outline">{dataRetentionDays} days</Badge>
          </div>
        </div>
      </Card>

      <DataRightsPanel 
        onExportData={exportUserData}
        onDeleteData={() => deleteUserData(auditLog, () => {})}
      />

      {/* Audit Log */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Privacy Audit Log</h3>
        
        <div className="max-h-40 overflow-y-auto space-y-2">
          {auditLog.length === 0 ? (
            <p className="text-sm text-muted-foreground">No audit entries yet</p>
          ) : (
            auditLog.slice(-10).reverse().map((entry, index) => (
              <div key={index} className="text-xs font-mono bg-muted p-2 rounded">
                {entry}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};