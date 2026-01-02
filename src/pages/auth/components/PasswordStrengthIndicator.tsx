import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { PasswordValidation } from '../hooks/useFormValidation';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  validation: PasswordValidation;
  show: boolean;
}

const strengthColors = {
  weak: 'bg-destructive',
  fair: 'bg-orange-500',
  medium: 'bg-warning',
  strong: 'bg-success',
  'very-strong': 'bg-success',
};

const strengthWidths = {
  weak: '20%',
  fair: '40%',
  medium: '60%',
  strong: '80%',
  'very-strong': '100%',
};

const criteriaLabels = [
  { key: 'minLength', label: '8 caractères minimum' },
  { key: 'hasUppercase', label: 'Une lettre majuscule' },
  { key: 'hasLowercase', label: 'Une lettre minuscule' },
  { key: 'hasNumber', label: 'Un chiffre' },
  { key: 'hasSpecial', label: 'Un caractère spécial (!@#$...)' },
] as const;

export const PasswordStrengthIndicator = ({
  validation,
  show,
}: PasswordStrengthIndicatorProps) => {
  const { strength, score, criteria, label } = validation;

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-3 space-y-3"
      >
        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Force du mot de passe</span>
            <span
              className={cn(
                'font-medium',
                strength === 'weak' && 'text-destructive',
                strength === 'fair' && 'text-orange-500',
                strength === 'medium' && 'text-warning',
                (strength === 'strong' || strength === 'very-strong') && 'text-success'
              )}
            >
              {label} ({score}/5)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: strengthWidths[strength] }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={cn('h-full rounded-full transition-colors', strengthColors[strength])}
            />
          </div>
        </div>

        {/* Criteria checklist */}
        <div className="grid grid-cols-1 gap-1.5">
          {criteriaLabels.map(({ key, label: criteriaLabel }, index) => {
            const isValid = criteria[key as keyof typeof criteria];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2 text-xs"
              >
                <motion.div
                  animate={{
                    scale: isValid ? [1, 1.2, 1] : 1,
                    backgroundColor: isValid
                      ? 'hsl(var(--success))'
                      : 'hsl(var(--muted))',
                  }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center w-4 h-4 rounded-full"
                >
                  {isValid ? (
                    <Check className="w-2.5 h-2.5 text-success-foreground" />
                  ) : (
                    <X className="w-2.5 h-2.5 text-muted-foreground" />
                  )}
                </motion.div>
                <span
                  className={cn(
                    'transition-colors',
                    isValid ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {criteriaLabel}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
