import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AtSign } from 'lucide-react';
import { EmailValidation } from '../hooks/useFormValidation';
import { cn } from '@/lib/utils';

interface EmailValidationIndicatorProps {
  validation: EmailValidation;
  className?: string;
}

export const EmailValidationIcon = ({
  validation,
  className,
}: EmailValidationIndicatorProps) => {
  const { isValid, isTouched } = validation;

  return (
    <div className={cn('flex items-center justify-center w-5 h-5', className)}>
      <AnimatePresence mode="wait">
        {!isTouched ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.5, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <AtSign className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        ) : isValid ? (
          <motion.div
            key="valid"
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Check className="w-4 h-4 text-success" />
          </motion.div>
        ) : (
          <motion.div
            key="invalid"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <X className="w-4 h-4 text-destructive" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const EmailValidationMessage = ({
  validation,
  className,
}: EmailValidationIndicatorProps) => {
  const { isValid, isTouched, message } = validation;

  if (!isTouched || !message) return null;

  return (
    <AnimatePresence>
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.15 }}
        className={cn(
          'text-xs mt-1.5 flex items-center gap-1',
          isValid ? 'text-success' : 'text-destructive',
          className
        )}
      >
        {isValid ? (
          <Check className="w-3 h-3" />
        ) : (
          <X className="w-3 h-3" />
        )}
        {message}
      </motion.p>
    </AnimatePresence>
  );
};
