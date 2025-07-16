import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const { signIn, signUp, user, loading } = useAuth();
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

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error } = await signIn(loginEmail, loginPassword);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Veuillez confirmer votre email avant de vous connecter');
        } else {
          setError(error.message);
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
        if (error.message.includes('User already registered')) {
          setError('Un compte existe déjà avec cette adresse email');
        } else if (error.message.includes('Password should be at least')) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
        } else {
          setError(error.message);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--fsu-blue))] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-white/80 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
          
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">FSU</span>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            Plateforme FSU Afrique
          </h1>
          <p className="text-white/80">
            Union Africaine des Télécommunications
          </p>
        </div>

        {/* Auth Forms */}
        <Card className="border-0 shadow-2xl">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Se connecter</CardTitle>
                <CardDescription>
                  Accédez à votre compte FSU
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Votre mot de passe"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Se connecter
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle>Créer un compte</CardTitle>
                <CardDescription>
                  Rejoignez la communauté FSU Afrique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-firstname">Prénom</Label>
                      <Input
                        id="signup-firstname"
                        type="text"
                        value={signupFirstName}
                        onChange={(e) => setSignupFirstName(e.target.value)}
                        placeholder="Prénom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-lastname">Nom</Label>
                      <Input
                        id="signup-lastname"
                        type="text"
                        value={signupLastName}
                        onChange={(e) => setSignupLastName(e.target.value)}
                        placeholder="Nom de famille"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Au moins 6 caractères"
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Créer mon compte
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-white/80 text-sm">
          <p>En vous connectant, vous acceptez nos conditions d'utilisation</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;