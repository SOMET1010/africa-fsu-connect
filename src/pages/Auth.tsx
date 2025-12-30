import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ModernButton } from '@/components/ui/modern-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// GlassCard removed - using solid white card for better contrast
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { NexusLogo } from '@/components/shared/NexusLogo';

const Auth = () => {
  const { signIn, signUp, user, loading, requestPasswordReset, updatePassword } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');

  // Password reset state
  const [forgotMode, setForgotMode] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Detect reset mode from URL
  useEffect(() => {
    const isReset = searchParams.get('reset') === 'true';
    setResetMode(isReset);
    if (isReset) setForgotMode(false);
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error } = await signIn(loginEmail, loginPassword);
      
      if (error) {
        const errorMessage = error && typeof error === 'object' && 'message' in error ? (error as { message: string }).message : String(error);
        if (errorMessage.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect');
        } else if (errorMessage.includes('Email not confirmed')) {
          setError('Veuillez confirmer votre email avant de vous connecter');
        } else {
          setError(errorMessage);
        }
      } else {
        toast.success('Connexion réussie !');
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Une erreur inattendue s\'est produite');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error } = await signUp(signupEmail, signupPassword, signupFirstName, signupLastName);
      
      if (error) {
        const errorMessage = error && typeof error === 'object' && 'message' in error ? (error as { message: string }).message : String(error);
        if (errorMessage.includes('User already registered')) {
          setError('Un compte existe déjà avec cette adresse email');
        } else if (errorMessage.includes('Password should be at least')) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
        } else {
          setError(errorMessage);
        }
      } else {
        toast.success('Compte créé ! Vérifiez votre email pour confirmer votre inscription.');
      }
    } catch (error) {
      setError('Une erreur inattendue s\'est produite');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { error } = await requestPasswordReset(resetEmail);
      if (error) {
        const msg = (error as any)?.message || 'Une erreur est survenue';
        setError(msg);
      } else {
        toast.success('Si un compte existe, un email de réinitialisation a été envoyé.');
        setForgotMode(false);
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await updatePassword(newPassword);
      if (error) {
        const msg = (error as any)?.message || 'Impossible de mettre à jour le mot de passe';
        setError(msg);
      } else {
        toast.success('Mot de passe mis à jour.');
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B3C5D] via-[#0F4C6D] to-[#1F7A63] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glow Effects - Soft emerald/cyan */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl flex items-center justify-center border border-white/50">
              <NexusLogo size="lg" variant="icon" animated={false} />
            </div>
          </div>
          
          <h1 className="text-4xl font-black text-white mb-2 font-poppins tracking-tight">
            NEXUS
          </h1>
          <p className="text-white/90 font-medium text-lg font-inter">
            Plateforme panafricaine du Service Universel
          </p>
          <p className="text-white/70 text-sm mt-2 font-inter tracking-wide">
            UAT • ANSUT • Réseau SUTEL
          </p>
        </div>

        {/* Auth Forms - Glass Card with solid readability */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 p-1.5 m-4 w-[calc(100%-2rem)] rounded-xl">
              <TabsTrigger 
                value="login" 
                className="rounded-lg py-3 font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-[#0B3C5D] data-[state=active]:shadow-md data-[state=inactive]:text-gray-500"
              >
                Connexion
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="rounded-lg py-3 font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-[#0B3C5D] data-[state=active]:shadow-md data-[state=inactive]:text-gray-500"
              >
                Inscription
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground font-poppins">
                  {resetMode ? 'Définir un nouveau mot de passe' : forgotMode ? 'Réinitialiser votre mot de passe' : 'Se connecter'}
                </h2>
                <p className="text-muted-foreground font-inter">
                  {resetMode
                    ? 'Choisissez un nouveau mot de passe pour votre compte'
                    : forgotMode
                      ? 'Entrez votre email pour recevoir un lien de réinitialisation'
                      : 'Accédez à votre compte NEXUS'}
                </p>
              </div>

              {resetMode ? (
                <form onSubmit={handleUpdatePassword} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="font-medium">Nouveau mot de passe</Label>
                    <Input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                      onClick={() => { setResetMode(false); setSearchParams({}); }}
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
              ) : forgotMode ? (
                <form onSubmit={handleRequestReset} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="font-medium">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
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
                      onClick={() => setForgotMode(false)}
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
              ) : (
              <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="font-medium text-gray-700">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
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
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Votre mot de passe"
                        required
                        className="h-12 bg-gray-50 border-gray-200 focus:border-[#0B3C5D] focus:ring-2 focus:ring-[#0B3C5D]/20 transition-all pr-12"
                      />
                      <ModernButton
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
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
                      onClick={() => { setForgotMode(true); setError(null); }}
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                </form>
              )}

              {/* Footer note */}
              <p className="text-center text-gray-400 text-xs mt-4 pb-2">
                En vous connectant, vous acceptez les conditions d'utilisation.
              </p>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup" className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground font-poppins">Créer un compte</h2>
                <p className="text-muted-foreground font-inter">
                  Rejoignez la communauté NEXUS
                </p>
              </div>
              
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-firstname" className="font-medium">Prénom</Label>
                    <Input
                      id="signup-firstname"
                      type="text"
                      value={signupFirstName}
                      onChange={(e) => setSignupFirstName(e.target.value)}
                      placeholder="Prénom"
                      className="h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-lastname" className="font-medium">Nom</Label>
                    <Input
                      id="signup-lastname"
                      type="text"
                      value={signupLastName}
                      onChange={(e) => setSignupLastName(e.target.value)}
                      placeholder="Nom de famille"
                      className="h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="font-medium">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="font-medium">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Au moins 6 caractères"
                      required
                      minLength={6}
                      className="h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary pr-12"
                    />
                    <ModernButton
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
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
                  loadingText="Création en cours..."
                >
                  Créer mon compte
                </ModernButton>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/80 text-sm font-inter">
          <p>En vous connectant, vous acceptez nos conditions d'utilisation</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;