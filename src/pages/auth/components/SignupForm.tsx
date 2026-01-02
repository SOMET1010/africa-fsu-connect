import { Eye, EyeOff } from 'lucide-react';
import { ModernButton } from '@/components/ui/modern-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEmailValidation, usePasswordValidation } from '../hooks/useFormValidation';
import { EmailValidationIcon, EmailValidationMessage } from './EmailValidationIndicator';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { cn } from '@/lib/utils';

interface SignupFormProps {
  firstName: string;
  onFirstNameChange: (value: string) => void;
  lastName: string;
  onLastNameChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  error: string | null;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const SignupForm = ({
  firstName,
  onFirstNameChange,
  lastName,
  onLastNameChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  showPassword,
  onTogglePassword,
  error,
  isSubmitting,
  onSubmit,
}: SignupFormProps) => {
  const emailValidation = useEmailValidation(email);
  const passwordValidation = usePasswordValidation(password);
  
  // Form is valid when email is valid and password has at least 3 criteria met
  const isFormValid = emailValidation.isValid && passwordValidation.score >= 3 && firstName.trim() && lastName.trim();

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="signup-firstname" className="font-medium text-foreground">Prénom</Label>
          <Input
            id="signup-firstname"
            type="text"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            placeholder="Prénom"
            required
            className="h-12 bg-muted/50 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-lastname" className="font-medium text-foreground">Nom</Label>
          <Input
            id="signup-lastname"
            type="text"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            placeholder="Nom"
            required
            className="h-12 bg-muted/50 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="font-medium text-foreground">Email</Label>
        <div className="relative">
          <Input
            id="signup-email"
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
        <Label htmlFor="signup-password" className="font-medium text-foreground">Mot de passe</Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Créez un mot de passe sécurisé"
            required
            minLength={6}
            className={cn(
              "h-12 bg-muted/50 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pr-12",
              password.length > 0 && passwordValidation.score >= 4 && "border-success focus:border-success focus:ring-success/20",
              password.length > 0 && passwordValidation.score < 3 && "border-warning focus:border-warning focus:ring-warning/20"
            )}
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
        
        <PasswordStrengthIndicator 
          validation={passwordValidation}
          show={password.length > 0}
        />
      </div>

      {error && (
        <Alert variant="destructive" className="border-destructive/20 bg-destructive/10 backdrop-blur-sm">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ModernButton 
        type="submit" 
        className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting || !isFormValid}
        loading={isSubmitting}
        loadingText="Création en cours..."
      >
        Créer mon compte
      </ModernButton>

      <p className="text-center text-muted-foreground text-xs mt-4">
        En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
      </p>
    </form>
  );
};
