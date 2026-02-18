import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { toErrorMessage } from '@/utils/errors';

export const useAuthPage = () => {
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
  const [signupCountry, setSignupCountry] = useState('');
  const [signupOrganization, setSignupOrganization] = useState('');

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
        const errorMessage = toErrorMessage(error);
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

    try {
      const { error } = await signUp(signupEmail, signupPassword, signupFirstName, signupLastName, signupCountry, signupOrganization);
      
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
    handleSignup,
    
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
