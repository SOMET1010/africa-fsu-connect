import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { toErrorMessage } from '@/utils/errors';
import { PUBLIC_SIGNUP_ROLE_OPTIONS, type UserRole } from '@/types/userRole';
import { getRoleHomePath } from '@/utils/roleRedirect';

export const useAuthPage = () => {
  const { signIn, signUp, user, profile, loading, requestPasswordReset, updatePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupCountry, setSignupCountry] = useState('');
  const [signupOrganization, setSignupOrganization] = useState('');
  const defaultSignupRole = PUBLIC_SIGNUP_ROLE_OPTIONS[0]?.value ?? 'reader';
  const [signupRole, setSignupRole] = useState<UserRole>(defaultSignupRole);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupData, setSignupData] = useState({ firstName: '', lastName: '', country: '', organization: '', role: defaultSignupRole });
  // Password reset state
  const [forgotMode, setForgotMode] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const redirectState = useRef<{ userId: string | null; redirected: boolean }>({
    userId: null,
    redirected: false,
  });

  const getPersistedRole = async (userId?: string) => {
    if (!userId) return undefined;
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Failed to fetch persisted role', error);
      return undefined;
    }

    return data?.role as UserRole | undefined;
  };

  // Attend que le profil soit chargé dans le contexte Auth
  const waitForProfile = async (userId: string, maxRetries = 10, delay = 100): Promise<UserRole | null> => {
    logger.debug('waitForProfile: starting', { userId, maxRetries, delay });
    for (let i = 0; i < maxRetries; i++) {
      const role = await getPersistedRole(userId);
      logger.debug('waitForProfile: attempt', {
        userId,
        attempt: i + 1,
        roleFound: !!role,
        role: role ?? 'null',
      });
      if (role) {
        logger.debug('Profile role found', { userId, role, attempt: i + 1 });
        return role;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    logger.warn('Profile role not found after retries', { userId, maxRetries });
    return null;
  };

  useEffect(() => {
    if (!user || !profile) {
      redirectState.current = { userId: null, redirected: false };
      return;
    }

    if (redirectState.current.userId === user.id && redirectState.current.redirected) {
      return;
    }

    if (!profile.role) {
      logger.debug('Auth redirect paused - profile role pending', {
        userId: user.id,
        currentPath: location.pathname,
      });
      return;
    }

    const targetPath = getRoleHomePath(profile.role);
    logger.debug('Auth redirect candidate', {
      userId: user.id,
      currentPath: location.pathname,
      targetPath,
      role: profile.role,
    });
    if (location.pathname !== targetPath) {
      logger.debug('Auth redirect executing', {
        userId: user.id,
        targetPath,
        role: profile.role,
      });
      navigate(targetPath, { replace: true });
    }

    redirectState.current = { userId: user.id, redirected: true };
  }, [user, profile, navigate, location.pathname]);

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
    logger.debug('Attempting login', { email: loginEmail });

    try {
      const { data, error } = await signIn(loginEmail, loginPassword);

      if (error) {
        const errorMessage = toErrorMessage(error);
        if (errorMessage.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect');
        } else if (errorMessage.includes('Email not confirmed')) {
          setError('Veuillez confirmer votre email avant de vous connecter');
        } else {
          setError(errorMessage);
        }
      } else {
        const userId = data.user?.id;
        if (!userId) {
          setError('Impossible de récupérer votre identifiant utilisateur');
          return;
        }

        // Attendre que le profil soit chargé
        const storedRole = await waitForProfile(userId);
        const metadataRole = data?.user?.user_metadata?.role as UserRole | undefined;
        const fallbackRole = storedRole ?? metadataRole ?? profile?.role ?? 'reader';
        const targetPath = getRoleHomePath(fallbackRole);
        logger.debug('Login success, resolving redirect', {
          userId,
          storedRole,
          metadataRole,
          profileRole: profile?.role,
          fallbackRole,
          targetPath,
        });
        toast.success('Connexion réussie !');
        if (location.pathname !== targetPath) {
          logger.debug('Login redirect navigation', { targetPath });
          navigate(targetPath, { replace: true });
        } else {
          logger.debug('Login redirect no-op', { targetPath });
        }
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (signupPassword !== signupConfirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await signUp(signupEmail, signupPassword, signupFirstName, signupLastName, signupCountry, signupOrganization, signupRole);
      
      if (error) {
        const errorMessage = toErrorMessage(error);
        if (errorMessage.includes('User already registered')) {
          setError('Un compte existe déjà avec cette adresse email');
        } else if (errorMessage.includes('Password should be at least')) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
        } else {
          setError(errorMessage);
        }
      } else {
        setSignupData({ firstName: signupFirstName, lastName: signupLastName, country: signupCountry, organization: signupOrganization, role: signupRole });
        setSignupSuccess(true);
        toast.success('Compte créé ! Vérifiez votre email pour confirmer votre inscription.');
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite");
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
        setError(toErrorMessage(error));
      } else {
        toast.success('Si un compte existe, un email de réinitialisation a été envoyé.');
        setForgotMode(false);
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite");
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
        setError(toErrorMessage(error));
      } else {
        toast.success('Mot de passe mis à jour.');
        navigate('/dashboard');
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite");
    } finally {
      setIsSubmitting(false);
    }
  };

  const exitResetMode = () => {
    setResetMode(false);
    setSearchParams({});
  };

  return {
    // Auth state
    loading,
    isSubmitting,
    showPassword,
    setShowPassword,
    error,
    setError,
    
    // Login
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    handleLogin,
    
    // Signup
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
    signupRole,
    setSignupRole,
    signupConfirmPassword,
    setSignupConfirmPassword,
    handleSignup,
    signupSuccess,
    signupData,
    
    // Password reset
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
  };
};
