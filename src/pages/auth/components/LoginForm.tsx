import { Eye, EyeOff } from 'lucide-react';
import { ModernButton } from '@/components/ui/modern-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEmailValidation } from '../hooks/useFormValidation';
import { EmailValidationIcon, EmailValidationMessage } from './EmailValidationIndicator';
import { cn } from '@/lib/utils';

interface LoginFormProps {
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  error: string | null;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
}

export const LoginForm = ({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  showPassword,
  onTogglePassword,
  error,
  isSubmitting,
  onSubmit,
  onForgotPassword,
}: LoginFormProps) => {
  const emailValidation = useEmailValidation(email);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="login-email" className="font-medium text-foreground">Email</Label>
        <div className="relative">
          <Input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="votre@email.com"
            required
            className={cn(
              "h-12 bg-muted/50 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pr-10",
              emailValidation.isTouched && emailValidation.isValid && "border-success focus:border-success focus:ring-success/20",
              emailValidation.isTouched && !emailValidation.isValid && "border-destructive focus:border-destructive focus:ring-destructive/20"
            )}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <EmailValidationIcon validation={emailValidation} />
          </div>
        </div>
        <EmailValidationMessage validation={emailValidation} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="login-password" className="font-medium text-foreground">Mot de passe</Label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Votre mot de passe"
            required
            className="h-12 bg-muted/50 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pr-12"
          />
          <ModernButton
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
            onClick={onTogglePassword}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </ModernButton>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="border-destructive/20 bg-destructive/10 backdrop-blur-sm">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ModernButton 
        type="submit" 
        className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl text-primary-foreground"
        disabled={isSubmitting}
        loading={isSubmitting}
        loadingText="Connexion en cours..."
      >
        Se connecter
      </ModernButton>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
          onClick={onForgotPassword}
        >
          Mot de passe oublié ?
        </button>
      </div>
    </form>
  );
};
