import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useAuthPage } from './auth/hooks/useAuthPage';
import { AuthHeader } from './auth/components/AuthHeader';
import { LoginForm } from './auth/components/LoginForm';
import { SignupForm } from './auth/components/SignupForm';
import { ResetPasswordForm } from './auth/components/ResetPasswordForm';

const Auth = () => {
  const {
    loading,
    isSubmitting,
    showPassword,
    setShowPassword,
    error,
    setError,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    handleLogin,
    signupEmail,
    setSignupEmail,
    signupPassword,
    setSignupPassword,
    signupFirstName,
    setSignupFirstName,
    signupLastName,
    setSignupLastName,
    signupCountry,
    setSignupCountry,
    signupOrganization,
    setSignupOrganization,
    handleSignup,
    forgotMode,
    setForgotMode,
    resetMode,
    resetEmail,
    setResetEmail,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleRequestReset,
    handleUpdatePassword,
    exitResetMode,
  } = useAuthPage();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B3C5D] via-[#0F4C6D] to-[#1F7A63] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glow Effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="w-full max-w-md relative z-10">
        <AuthHeader />

        {/* Auth Forms */}
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
                <ResetPasswordForm
                  mode="update"
                  newPassword={newPassword}
                  onNewPasswordChange={setNewPassword}
                  confirmPassword={confirmPassword}
                  onConfirmPasswordChange={setConfirmPassword}
                  error={error}
                  isSubmitting={isSubmitting}
                  onSubmit={handleUpdatePassword}
                  onBack={exitResetMode}
                />
              ) : forgotMode ? (
                <ResetPasswordForm
                  mode="request"
                  email={resetEmail}
                  onEmailChange={setResetEmail}
                  error={error}
                  isSubmitting={isSubmitting}
                  onSubmit={handleRequestReset}
                  onBack={() => setForgotMode(false)}
                />
              ) : (
                <LoginForm
                  email={loginEmail}
                  onEmailChange={setLoginEmail}
                  password={loginPassword}
                  onPasswordChange={setLoginPassword}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  error={error}
                  isSubmitting={isSubmitting}
                  onSubmit={handleLogin}
                  onForgotPassword={() => { setForgotMode(true); setError(null); }}
                />
              )}

              <p className="text-center text-gray-400 text-xs mt-4 pb-2">
                En vous connectant, vous acceptez les conditions d'utilisation.
              </p>
            </TabsContent>

            <TabsContent value="signup" className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground font-poppins">Créer un compte</h2>
                <p className="text-muted-foreground font-inter">
                  Rejoignez la communauté NEXUS
                </p>
              </div>
              
              <SignupForm
                firstName={signupFirstName}
                onFirstNameChange={setSignupFirstName}
                lastName={signupLastName}
                onLastNameChange={setSignupLastName}
                email={signupEmail}
                onEmailChange={setSignupEmail}
                password={signupPassword}
                onPasswordChange={setSignupPassword}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                error={error}
                isSubmitting={isSubmitting}
                onSubmit={handleSignup}
                country={signupCountry}
                onCountryChange={setSignupCountry}
                organization={signupOrganization}
                onOrganizationChange={setSignupOrganization}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
