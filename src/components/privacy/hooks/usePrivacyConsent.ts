import { useState, useEffect } from 'react';

export interface ConsentSettings {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  necessary: boolean;
}

export function usePrivacyConsent() {
  const [consent, setConsent] = useState<ConsentSettings>({
    analytics: false,
    marketing: false,
    functional: true,
    necessary: true
  });
  
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

  const complianceScore = Object.values(consent).filter(Boolean).length / Object.keys(consent).length * 100;

  return {
    consent,
    auditLog,
    updateConsent,
    complianceScore,
  };
}