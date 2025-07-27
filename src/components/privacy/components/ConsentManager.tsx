import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Cookie } from 'lucide-react';
import { ConsentSettings } from '../hooks/usePrivacyConsent';

interface ConsentManagerProps {
  consent: ConsentSettings;
  onUpdateConsent: (key: keyof ConsentSettings, value: boolean) => void;
}

export function ConsentManager({ consent, onUpdateConsent }: ConsentManagerProps) {
  return (
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
            onCheckedChange={(checked) => onUpdateConsent('functional', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Analytics Cookies</h4>
            <p className="text-sm text-muted-foreground">Help us understand how you use our site</p>
          </div>
          <Switch 
            checked={consent.analytics} 
            onCheckedChange={(checked) => onUpdateConsent('analytics', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Marketing Cookies</h4>
            <p className="text-sm text-muted-foreground">Personalized content and advertisements</p>
          </div>
          <Switch 
            checked={consent.marketing} 
            onCheckedChange={(checked) => onUpdateConsent('marketing', checked)}
          />
        </div>
      </div>
    </Card>
  );
}