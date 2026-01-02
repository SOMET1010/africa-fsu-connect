import { Eye, EyeOff } from 'lucide-react';
import { ModernButton } from '@/components/ui/modern-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="login-email" className="font-medium text-gray-700">Email</Label>
        <Input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="votre@email.com"
          required
          className="h-12 bg-gray-50 border-gray-200 focus:border-[#0B3C5D] focus:ring-2 focus:ring-[#0B3C5D]/20 transition-all"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="login-password" className="font-medium text-gray-700">Mot de passe</Label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Votre mot de passe"
            required
            className="h-12 bg-gray-50 border-gray-200 focus:border-[#0B3C5D] focus:ring-2 focus:ring-[#0B3C5D]/20 transition-all pr-12"
          />
          <ModernButton
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
            onClick={onTogglePassword}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
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
        className="w-full h-12 bg-gradient-to-r from-[#0B3C5D] to-[#1F7A63] hover:from-[#0A3350] hover:to-[#1A6B56] transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl text-white"
        disabled={isSubmitting}
        loading={isSubmitting}
        loadingText="Connexion en cours..."
      >
        Se connecter
      </ModernButton>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-[#0B3C5D] hover:text-[#1F7A63] hover:underline transition-colors"
          onClick={onForgotPassword}
        >
          Mot de passe oublié ?
        </button>
      </div>
    </form>
  );
};
