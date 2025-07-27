import { useState } from 'react';

export function useDataManagement() {
  const [dataRetentionDays, setDataRetentionDays] = useState(90);
  const [anonymizationEnabled, setAnonymizationEnabled] = useState(true);

  // Export user data
  const exportUserData = () => {
    const userData = {
      consent: JSON.parse(localStorage.getItem('user-consent') || '{}'),
      analytics: JSON.parse(localStorage.getItem('heatmap-data') || '[]'),
      interactions: JSON.parse(localStorage.getItem('user-interactions') || '[]'),
      preferences: JSON.parse(localStorage.getItem('user-preferences') || '{}'),
      auditLog: JSON.parse(localStorage.getItem('privacy-audit-log') || '[]'),
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
  const deleteUserData = (auditLog: string[], setAuditLog: (log: string[]) => void) => {
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

  return {
    dataRetentionDays,
    anonymizationEnabled,
    setDataRetentionDays,
    setAnonymizationEnabled,
    exportUserData,
    deleteUserData,
  };
}