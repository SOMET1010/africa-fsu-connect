import { ModernButton } from '@/components/ui/modern-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ResetPasswordFormProps {
  mode: 'request' | 'update';
  email?: string;
  onEmailChange?: (value: string) => void;
  newPassword?: string;
  onNewPasswordChange?: (value: string) => void;
  confirmPassword?: string;
  onConfirmPasswordChange?: (value: string) => void;
  showPassword?: boolean;
  error: string | null;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export const ResetPasswordForm = ({
  mode,
  email,
  onEmailChange,
  newPassword,
  onNewPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  error,
  isSubmitting,
  onSubmit,
  onBack,
}: ResetPasswordFormProps) => {
  if (mode === 'update') {
    return (
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="new-password" className="font-medium">Nouveau mot de passe</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => onNewPasswordChange?.(e.target.value)}
            placeholder="Votre nouveau mot de passe"
            required
            minLength={6}
            className="h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary pr-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="font-medium">Confirmer le mot de passe</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange?.(e.target.value)}
            placeholder="Confirmez le mot de passe"
            required
            minLength={6}
            className="h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary pr-12"
          />
        </div>

        {error && (
          <Alert variant="destructive" className="border-destructive/20 bg-destructive/10 backdrop-blur-sm">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <ModernButton
            type="button"
            variant="ghost"
            onClick={onBack}
          >
            Retour à la connexion
          </ModernButton>
          <ModernButton
            type="submit"
            className="h-12"
            variant="default"
            disabled={isSubmitting}
            loading={isSubmitting}
            loadingText="Mise à jour..."
          >
            Mettre à jour
          </ModernButton>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="reset-email" className="font-medium">Email</Label>
        <Input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange?.(e.target.value)}
          placeholder="votre@email.com"
          required
          className="h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary"
        />
      </div>

      {error && (
        <Alert variant="destructive" className="border-destructive/20 bg-destructive/10 backdrop-blur-sm">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <ModernButton
          type="button"
          variant="ghost"
          onClick={onBack}
        >
          Retour à la connexion
        </ModernButton>
        <ModernButton 
          type="submit" 
          className="h-12"
          variant="default"
          disabled={isSubmitting}
          loading={isSubmitting}
          loadingText="Envoi..."
        >
          Envoyer le lien
        </ModernButton>
      </div>
    </form>
  );
};
