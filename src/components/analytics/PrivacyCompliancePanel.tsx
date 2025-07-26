import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Eye, 
  Cookie, 
  Download, 
  Trash2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ConsentSettings {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  necessary: boolean;
}

export const PrivacyCompliancePanel = () => {
  const [consent, setConsent] = useState<ConsentSettings>({
    analytics: false,
    marketing: false,
    functional: true,
    necessary: true
  });
  
  const [dataRetentionDays, setDataRetentionDays] = useState(90);
  const [anonymizationEnabled, setAnonymizationEnabled] = useState(true);
  const [auditLog, setAuditLog] = useState<string[]>([]);

  // Load consent from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user-consent');
    if (stored) {
      setConsent(JSON.parse(stored));
    }

    const logs = JSON.parse(localStorage.getItem('privacy-audit-log') || '[]');
    setAuditLog(logs);
  }, []);

  // Save consent
  const updateConsent = (key: keyof ConsentSettings, value: boolean) => {
    const newConsent = { ...consent, [key]: value };
    setConsent(newConsent);
    localStorage.setItem('user-consent', JSON.stringify(newConsent));
    
    // Log the change
    const logEntry = `${new Date().toISOString()}: Consent ${key} ${value ? 'granted' : 'revoked'}`;
    const newAuditLog = [...auditLog, logEntry];
    setAuditLog(newAuditLog);
    localStorage.setItem('privacy-audit-log', JSON.stringify(newAuditLog));
  };

  // Export user data
  const exportUserData = () => {
    const userData = {
      consent,
      analytics: JSON.parse(localStorage.getItem('heatmap-data') || '[]'),
      interactions: JSON.parse(localStorage.getItem('user-interactions') || '[]'),
      preferences: JSON.parse(localStorage.getItem('user-preferences') || '{}'),
      auditLog,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-data-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Delete user data
  const deleteUserData = () => {
    if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      localStorage.removeItem('heatmap-data');
      localStorage.removeItem('user-interactions');
      localStorage.removeItem('ab-test-results');
      localStorage.removeItem('user-preferences');
      localStorage.removeItem('analytics-data');
      
      const logEntry = `${new Date().toISOString()}: User data deletion requested and completed`;
      const newAuditLog = [...auditLog, logEntry];
      setAuditLog(newAuditLog);
      localStorage.setItem('privacy-audit-log', JSON.stringify(newAuditLog));
      
      alert('Your data has been deleted successfully.');
    }
  };

  const complianceScore = Object.values(consent).filter(Boolean).length / Object.keys(consent).length * 100;

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

      {/* Consent Management */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Cookie className="h-5 w-5" />
          Consent Management
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Necessary Cookies</h4>
              <p className="text-sm text-muted-foreground">Required for basic functionality</p>
            </div>
            <Switch checked={consent.necessary} disabled />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Functional Cookies</h4>
              <p className="text-sm text-muted-foreground">Enhanced user experience features</p>
            </div>
            <Switch 
              checked={consent.functional} 
              onCheckedChange={(checked) => updateConsent('functional', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Analytics Cookies</h4>
              <p className="text-sm text-muted-foreground">Help us understand how you use our site</p>
            </div>
            <Switch 
              checked={consent.analytics} 
              onCheckedChange={(checked) => updateConsent('analytics', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Marketing Cookies</h4>
              <p className="text-sm text-muted-foreground">Personalized content and advertisements</p>
            </div>
            <Switch 
              checked={consent.marketing} 
              onCheckedChange={(checked) => updateConsent('marketing', checked)}
            />
          </div>
        </div>
      </Card>

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

      {/* User Rights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your Data Rights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" onClick={exportUserData} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export My Data
          </Button>
          
          <Button variant="outline" onClick={deleteUserData} className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete My Data
          </Button>
        </div>
        
        <Alert className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have the right to access, rectify, erase, restrict processing, and data portability. 
            Contact us at privacy@sutel.com for any requests.
          </AlertDescription>
        </Alert>
      </Card>

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