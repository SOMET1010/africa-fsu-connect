import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/utils/logger';

interface ABTest {
  id: string;
  name: string;
  description: string;
  variants: {
    id: string;
    name: string;
    traffic: number; // percentage
    config: Record<string, any>;
  }[];
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate?: Date;
  endDate?: Date;
  metrics: {
    conversionRate: number;
    confidenceLevel: number;
    sampleSize: number;
  };
}

interface ABTestResult {
  testId: string;
  variantId: string;
  userId: string;
  timestamp: number;
  converted: boolean;
  metrics: Record<string, any>;
}

export const useABTesting = () => {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [userVariants, setUserVariants] = useState<Record<string, string>>({});
  const [results, setResults] = useState<ABTestResult[]>([]);

  // Generate user ID if not exists
  const getUserId = useCallback(() => {
    let userId = localStorage.getItem('ab-test-user-id');
    if (!userId) {
      userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('ab-test-user-id', userId);
    }
    return userId;
  }, []);

  // Get variant for user in a specific test
  const getVariant = useCallback((testId: string) => {
    const test = tests.find(t => t.id === testId && t.status === 'running');
    if (!test) return null;

    const userId = getUserId();
    const existingVariant = userVariants[testId];
    
    if (existingVariant) {
      return test.variants.find(v => v.id === existingVariant);
    }

    // Assign user to variant based on hash
    const hash = hashCode(userId + testId);
    const hashPercent = Math.abs(hash) % 100;
    
    let cumulativeTraffic = 0;
    for (const variant of test.variants) {
      cumulativeTraffic += variant.traffic;
      if (hashPercent < cumulativeTraffic) {
        setUserVariants(prev => ({ ...prev, [testId]: variant.id }));
        
        // Store assignment
        const assignments = JSON.parse(localStorage.getItem('ab-test-assignments') || '{}');
        assignments[testId] = variant.id;
        localStorage.setItem('ab-test-assignments', JSON.stringify(assignments));
        
        logger.info('A/B test assignment', { testId, variantId: variant.id, userId });
        
        return variant;
      }
    }
    
    return test.variants[0]; // fallback
  }, [tests, userVariants, getUserId]);

  // Record conversion for A/B test
  const recordConversion = useCallback((testId: string, metrics: Record<string, any> = {}) => {
    const variant = getVariant(testId);
    if (!variant) return;

    const userId = getUserId();
    const result: ABTestResult = {
      testId,
      variantId: variant.id,
      userId,
      timestamp: Date.now(),
      converted: true,
      metrics
    };

    setResults(prev => [...prev, result]);
    
    // Store result
    const storedResults = JSON.parse(localStorage.getItem('ab-test-results') || '[]');
    storedResults.push(result);
    localStorage.setItem('ab-test-results', JSON.stringify(storedResults));

    logger.info('A/B test conversion', { testId, variantId: variant.id, userId, metrics });
  }, [getVariant, getUserId]);

  // Create new A/B test
  const createTest = useCallback((test: Omit<ABTest, 'metrics'>) => {
    const newTest: ABTest = {
      ...test,
      metrics: {
        conversionRate: 0,
        confidenceLevel: 0,
        sampleSize: 0
      }
    };

    setTests(prev => [...prev, newTest]);
    
    // Store test
    const storedTests = JSON.parse(localStorage.getItem('ab-tests') || '[]');
    storedTests.push(newTest);
    localStorage.setItem('ab-tests', JSON.stringify(storedTests));

    logger.info('A/B test created', { testId: newTest.id, variants: newTest.variants.length });
  }, []);

  // Start test
  const startTest = useCallback((testId: string) => {
    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { ...test, status: 'running' as const, startDate: new Date() }
        : test
    ));

    logger.info('A/B test started', { testId });
  }, []);

  // Stop test
  const stopTest = useCallback((testId: string) => {
    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { ...test, status: 'completed' as const, endDate: new Date() }
        : test
    ));

    logger.info('A/B test stopped', { testId });
  }, []);

  // Calculate test statistics
  const getTestStatistics = useCallback((testId: string) => {
    const test = tests.find(t => t.id === testId);
    if (!test) return null;

    const testResults = results.filter(r => r.testId === testId);
    const variantStats = test.variants.map(variant => {
      const variantResults = testResults.filter(r => r.variantId === variant.id);
      const conversions = variantResults.filter(r => r.converted).length;
      const totalUsers = variantResults.length;
      
      return {
        variantId: variant.id,
        name: variant.name,
        users: totalUsers,
        conversions,
        conversionRate: totalUsers > 0 ? conversions / totalUsers : 0,
        confidence: calculateConfidence(conversions, totalUsers)
      };
    });

    return {
      testId,
      testName: test.name,
      status: test.status,
      variants: variantStats,
      totalUsers: testResults.length,
      totalConversions: testResults.filter(r => r.converted).length
    };
  }, [tests, results]);

  // Load stored data on mount
  useEffect(() => {
    const storedTests = JSON.parse(localStorage.getItem('ab-tests') || '[]');
    const storedAssignments = JSON.parse(localStorage.getItem('ab-test-assignments') || '{}');
    const storedResults = JSON.parse(localStorage.getItem('ab-test-results') || '[]');

    setTests(storedTests);
    setUserVariants(storedAssignments);
    setResults(storedResults);
  }, []);

  return {
    tests,
    getVariant,
    recordConversion,
    createTest,
    startTest,
    stopTest,
    getTestStatistics,
    userVariants
  };
};

// Utility functions
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

function calculateConfidence(conversions: number, totalUsers: number): number {
  // Simplified confidence calculation
  if (totalUsers < 30) return 0;
  
  const conversionRate = conversions / totalUsers;
  const standardError = Math.sqrt((conversionRate * (1 - conversionRate)) / totalUsers);
  const zScore = 1.96; // 95% confidence
  
  const marginOfError = zScore * standardError;
  return Math.max(0, 1 - (marginOfError / conversionRate)) * 100;
}