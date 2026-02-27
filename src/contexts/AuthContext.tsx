import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { logger } from '@/utils/logger';
import type { SecurityEventDetails, ApiResponse } from '@/types/common';
import type { UserRole } from '@/types/userRole';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Tables<'profiles'> | null;
  loading: boolean;
  profileLoading: boolean;
  signIn: (email: string, password: string) => Promise<ApiResponse<Session | null>>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string, country?: string, organization?: string, role?: UserRole) => Promise<ApiResponse>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<ApiResponse>;
  updatePassword: (newPassword: string) => Promise<ApiResponse>;
  updateProfile: (updates: Partial<Tables<'profiles'>>) => Promise<void>;
  isAdmin: () => boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchProfile = async (userId: string) => {
    logger.debug('Fetching profile', { userId, component: 'AuthContext', action: 'fetchProfile' });
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        logger.error('Error fetching profile:', error, { component: 'AuthContext', action: 'fetchProfile', userId });
        return;
      }

      logger.debug('Profile fetched successfully', {
        userId,
        role: data?.role,
        email: data?.email,
        component: 'AuthContext',
        action: 'fetchProfile',
      });
      setProfile(data);
    } catch (error) {
      logger.error('Error fetching profile:', error, { component: 'AuthContext', action: 'fetchProfile', userId });
    }
    finally {
      setProfileLoading(false);
    }
  };

  const logSecurityEvent = async (userId: string, actionType: string, details?: SecurityEventDetails, success: boolean = true) => {
    try {
      await supabase.rpc('log_security_event', {
        p_user_id: userId,
        p_action_type: actionType,
        p_details: details ? JSON.stringify(details) : null,
        p_success: success,
      });
    } catch (error) {
      logger.error('Failed to log security event:', error, { component: 'AuthContext', action: 'logSecurityEvent' });
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Defer profile fetching to prevent deadlocks
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setProfileLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      } else {
        setProfileLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    logger.debug('Supabase signIn executed', { email });

    // Log security event
    if (data.user) {
      await logSecurityEvent(
        data.user.id, 
        error ? 'login_failed' : 'login', 
        { email }, 
        !error
      );
    }
    logger.debug('Supabase signIn result', {
      userId: data.user?.id,
      success: !error,
      error: error ? error.message : undefined,
      metadataRole: data.user?.user_metadata?.role,
    });

    return { data, error };
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string, country?: string, organization?: string, role?: UserRole) => {
    const redirectUrl = `${window.location.origin}/`;
    const normalizedRole = role ?? 'reader';
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
          country: country,
          organization: organization,
          role: normalizedRole,
        }
      }
    });

    // Log security event
    if (data.user) {
      await logSecurityEvent(
        data.user.id, 
        error ? 'signup_failed' : 'signup', 
        { email }, 
        !error
      );
    }

    if (!error && data.user) {
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(
            {
              user_id: data.user.id,
              first_name: firstName,
              last_name: lastName,
              email,
              country,
              organization,
              role: normalizedRole,
            },
            { onConflict: 'user_id' }
          );

        if (profileError) {
          logger.error('Failed to sync profile after signup', profileError, { component: 'AuthContext', action: 'signUp' });
        }
      } catch (profileError) {
        logger.error('Unexpected profile sync error', profileError, { component: 'AuthContext', action: 'signUp' });
      }
    }

    return { error };
  };

  const signOut = async () => {
    // Log security event before signing out
    if (user) {
      await logSecurityEvent(user.id, 'logout');
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      logger.error('Error signing out:', error, { component: 'AuthContext', action: 'signOut' });
    }
  };
  
  const requestPasswordReset = async (email: string) => {
    const redirectUrl = `${window.location.origin}/auth?reset=true`;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    if (error) {
      logger.error('Error requesting password reset:', error, { component: 'AuthContext', action: 'requestPasswordReset' });
    }
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (user) {
      await logSecurityEvent(user.id, error ? 'password_reset_failed' : 'password_reset', undefined, !error);
    }
    if (error) {
      logger.error('Error updating password:', error, { component: 'AuthContext', action: 'updatePassword' });
    }
    return { error };
  };

  const updateProfile = async (updates: Partial<Tables<'profiles'>>) => {
    if (!user || !profile) return;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(data);
  };

  const isAdmin = () => {
    if (!profile) return false;
    return ['super_admin', 'country_admin', 'editor'].includes(profile.role);
  };

  const hasRole = (roles: UserRole[]) => {
    if (!profile) return false;
    return roles.includes(profile.role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      profileLoading,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      updatePassword,
      updateProfile,
      isAdmin,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export type { UserRole } from '@/types/userRole';
