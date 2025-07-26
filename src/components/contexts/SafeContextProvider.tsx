import React, { ReactNode } from 'react';
import { ErrorBoundary, AuthErrorBoundary, PreferencesErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingProvider } from '@/contexts/LoadingContext';

interface SafeContextProviderProps {
  children: ReactNode;
}

/**
 * Wraps all contexts with error boundaries for maximum stability
 * Ensures graceful degradation when individual contexts fail
 */
export const SafeContextProvider = ({ children }: SafeContextProviderProps) => {
  return (
    <ErrorBoundary>
      <LoadingProvider>
        <AuthErrorBoundary>
          <PreferencesErrorBoundary>
            {children}
          </PreferencesErrorBoundary>
        </AuthErrorBoundary>
      </LoadingProvider>
    </ErrorBoundary>
  );
};

export default SafeContextProvider;