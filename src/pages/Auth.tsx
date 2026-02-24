import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useAuthPage } from './auth/hooks/useAuthPage';
import { AuthHeader } from './auth/components/AuthHeader';
import { LoginForm } from './auth/components/LoginForm';
import { SignupForm } from './auth/components/SignupForm';
import { ResetPasswordForm } from './auth/components/ResetPasswordForm';
import { SignupConfirmation } from './auth/components/SignupConfirmation';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || searchParams.get('mode') || 'login';
  const [activeTab, setActiveTab] = useState(initialTab === 'signup' ? 'signup' : 'login');

  useEffect(() => {
    const tab = searchParams.get('tab') || searchParams.get('mode');
    if (tab === 'signup') setActiveTab('signup');
  }, [searchParams]);

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
    signupConfirmPassword,
    setSignupConfirmPassword,
    handleSignup,
    signupSuccess,
    signupData,
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
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <AuthHeader />

        {/* Auth Forms */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-[calc(100%-2rem)] grid-cols-2 gap-2 rounded-2xl border border-border bg-white/90 p-1.5 m-4 shadow-sm">
              {['login', 'signup'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-xl py-3 text-sm font-semibold transition-all data-[state=active]:bg-primary/90 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-muted-foreground"
                >
                  {tab === 'login' ? 'Connexion' : 'Inscription'}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="login" className="space-y-6 p-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground font-poppins">
                  {resetMode ? 'Définir un nouveau mot de passe' : forgotMode ? 'Réinitialiser votre mot de passe' : 'Se connecter'}
                </h2>
                <p className="text-muted-foreground font-inter">
                  {resetMode
                    ? 'Choisissez un nouveau mot de passe pour votre compte'
                    : forgotMode
                      ? 'Entrez votre email pour recevoir un lien de réinitialisation'
                      : 'Accédez à votre compte UDC'}
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

            <TabsContent value="signup" className="space-y-6 p-8">
              {signupSuccess ? (
                <SignupConfirmation
                  firstName={signupData.firstName}
                  lastName={signupData.lastName}
                  country={signupData.country}
                  organization={signupData.organization}
                />
              ) : (
                <>
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-foreground font-poppins">Créer un compte</h2>
                    <p className="text-muted-foreground font-inter">
                      Rejoignez la communauté UDC
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
                    confirmPassword={signupConfirmPassword}
                    onConfirmPasswordChange={setSignupConfirmPassword}
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
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
