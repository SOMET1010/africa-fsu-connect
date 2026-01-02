import { useMemo } from 'react';

export type PasswordStrength = 'weak' | 'fair' | 'medium' | 'strong' | 'very-strong';

export interface PasswordCriteria {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export interface PasswordValidation {
  strength: PasswordStrength;
  score: number;
  criteria: PasswordCriteria;
  label: string;
}

export interface EmailValidation {
  isValid: boolean;
  isTouched: boolean;
  message: string;
}

export const useFormValidation = () => {
  const validateEmail = (email: string): EmailValidation => {
    const isTouched = email.length > 0;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    
    let message = '';
    if (isTouched) {
      if (isValid) {
        message = 'Email valide';
      } else if (email.includes('@') && !email.includes('.')) {
        message = 'Domaine incomplet (ex: .com)';
      } else if (!email.includes('@')) {
        message = 'Ajoutez @ suivi du domaine';
      } else {
        message = 'Format email invalide';
      }
    }
    
    return { isValid, isTouched, message };
  };

  const getPasswordStrength = (password: string): PasswordValidation => {
    const criteria: PasswordCriteria = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~]/.test(password),
    };

    const score = Object.values(criteria).filter(Boolean).length;
    
    let strength: PasswordStrength;
    let label: string;
    
    if (score <= 1) {
      strength = 'weak';
      label = 'Faible';
    } else if (score === 2) {
      strength = 'fair';
      label = 'Insuffisant';
    } else if (score === 3) {
      strength = 'medium';
      label = 'Moyen';
    } else if (score === 4) {
      strength = 'strong';
      label = 'Fort';
    } else {
      strength = 'very-strong';
      label = 'Très fort';
    }

    return { strength, score, criteria, label };
  };

  return { validateEmail, getPasswordStrength };
};

// Utility hook for real-time validation state
export const usePasswordValidation = (password: string) => {
  const { getPasswordStrength } = useFormValidation();
  return useMemo(() => getPasswordStrength(password), [password]);
};

export const useEmailValidation = (email: string) => {
  const { validateEmail } = useFormValidation();
  return useMemo(() => validateEmail(email), [email]);
};
