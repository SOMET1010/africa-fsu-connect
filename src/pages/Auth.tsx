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

  const accessNotes = [
    {
      title: 'espace public',
      summary: 'Consultez les actualités, ressources et temps forts du réseau sans engagement.',
      detail: 'Idéal pour découvrir les initiatives, télécharger les documents publics et suivre les événements.'
    },
    {
      title: 'espace privé',
      summary: 'Gérez vos projets, soumissions et collaborations avec des droits réservés aux membres authentifiés.',
      detail: 'Sécurisé par Supabase, il permet de consulter les tableaux de bord personnalisés et les communications internes.'
    }
  ];

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-6xl relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
                  <section className="rounded-[36px] border border-white/30 bg-gradient-to-br from-primary to-primary-dark p-6 shadow-[0_20px_60px_rgba(15,23,42,0.45)] backdrop-blur-3xl text-white">
            <AuthHeader />
            <div className="space-y-5 text-sm font-inter">
              <p className="uppercase tracking-[0.5em] text-white/60 text-xs">espaces &amp; accès</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {accessNotes.map((note) => (
                  <div key={note.title} className="rounded-2xl border border-white/30 bg-white/10 p-4">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">{note.title}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{note.summary}</p>
                    <p className="mt-2 text-xs text-white/70 leading-relaxed">{note.detail}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/70">
                Les contenus publics sont accessibles sans authentification. L&apos;espace privé, quant à lui, est protégé par des politiques de sécurité et permet d&apos;interagir avec le réseau (projets, soumissions, rapports).
              </p>
            </div>
          </section>

          <section className="rounded-[32px] border border-border bg-white/95 shadow-xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 gap-1.5 rounded-[999px] border border-border bg-white p-[0.2rem] shadow-sm">
                {['login', 'signup'].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="flex h-12 w-full items-center justify-center rounded-[calc(999px-0.4rem)] border border-transparent text-sm font-semibold transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent"
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
          </section>
        </div>
      </div>
    </div>
  );
};

export default Auth;
