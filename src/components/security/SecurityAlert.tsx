import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';
import { useSecurity } from '@/hooks/useSecurity';

interface SecurityAlertProps {
  type: 'suspicious_login' | 'new_device' | 'multiple_sessions' | 'security_setting_changed';
  message: string;
  details?: any;
  onDismiss?: () => void;
}

const SecurityAlert = ({ type, message, details, onDismiss }: SecurityAlertProps) => {
  const { logSecurityEvent } = useSecurity();
  const [isVisible, setIsVisible] = useState(true);

  const getAlertVariant = () => {
    switch (type) {
      case 'suspicious_login':
        return 'destructive' as const;
      case 'multiple_sessions':
        return 'default' as const;
      default:
        return 'default' as const;
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    logSecurityEvent.mutate({
      actionType: 'security_alert_dismissed',
      details: { type, message },
    });
    onDismiss?.();
  };

  const handleViewDetails = () => {
    // Navigate to security page
    window.location.href = '/security';
  };

  if (!isVisible) return null;

  return (
    <Alert variant={getAlertVariant()} className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          <p className="font-medium mb-1">Alerte de sécurité</p>
          <p className="text-sm">{message}</p>
          {details && (
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewDetails}
                className="mr-2"
              >
                Voir les détails
              </Button>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-auto p-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default SecurityAlert;