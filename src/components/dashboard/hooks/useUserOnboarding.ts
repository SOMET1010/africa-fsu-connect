import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useUserOnboarding() {
  const [searchParams] = useSearchParams();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (searchParams.get('onboarding') === 'completed') {
      setShowWelcome(true);
      // Remove the parameter from URL
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [searchParams]);

  const dismissWelcome = () => {
    setShowWelcome(false);
  };

  return {
    showWelcome,
    dismissWelcome
  };
}