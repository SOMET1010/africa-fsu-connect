import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useLiferay } from '@/LiferayApp';
import { logger } from '@/utils/logger';

export type UserRole = 'super_admin' | 'admin_pays' | 'editeur' | 'contributeur' | 'lecteur' | 'point_focal';

interface LiferayAuthContextType {
  user: User | null;
  session: Session | null;
  profile: Tables<'profiles'> | null;
  loading: boolean;
  liferayUserId: string;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const LiferayAuthContext = createContext<LiferayAuthContextType | undefined>(undefined);

interface LiferayAuthProviderProps {
  children: ReactNode;
}

export const LiferayAuthProvider = ({ children }: LiferayAuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);
  const [loading, setLoading] = useState(true);
  const { userId: liferayUserId } = useLiferay();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        logger.error('Failed to fetch user profile', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      logger.error('Failed to fetch user profile', error);
    }
  };

  const logSecurityEvent = async (userId: string, actionType: string, details?: any, success: boolean = true) => {
    try {
      await supabase.rpc('log_security_event', {
        p_user_id: userId,
        p_action_type: actionType,
        p_details: details,
        p_success: success,
      });
    } catch (error) {
      logger.error('Failed to log security event', error);
    }
  };

  useEffect(() => {
    // Configuration pour environnement Liferay
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }

        // Log les événements pour Liferay
        if (event === 'SIGNED_IN' && session?.user) {
          logSecurityEvent(session.user.id, 'liferay_portlet_login', { 
            liferay_user_id: liferayUserId,
            portlet_namespace: window.LIFERAY_PORTLET_NAMESPACE
          });
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [liferayUserId]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.user) {
      await logSecurityEvent(
        data.user.id, 
        error ? 'liferay_login_failed' : 'liferay_login', 
        { 
          email, 
          liferay_user_id: liferayUserId,
          portlet_namespace: window.LIFERAY_PORTLET_NAMESPACE
        }, 
        !error
      );
    }

    return { error };
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    const redirectUrl = window.LIFERAY_CURRENT_URL || `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
          liferay_user_id: liferayUserId,
        }
      }
    });

    if (data.user) {
      await logSecurityEvent(
        data.user.id, 
        error ? 'liferay_signup_failed' : 'liferay_signup', 
        { 
          email,
          liferay_user_id: liferayUserId
        }, 
        !error
      );
    }

    return { error };
  };

  const signOut = async () => {
    if (user) {
      await logSecurityEvent(user.id, 'liferay_logout', {
        liferay_user_id: liferayUserId
      });
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      logger.error('Failed to sign out', error);
    }
  };

  const isAdmin = () => {
    if (!profile) return false;
    return ['super_admin', 'admin_pays', 'editeur'].includes(profile.role);
  };

  const hasRole = (roles: UserRole[]) => {
    if (!profile) return false;
    return roles.includes(profile.role);
  };

  return (
    <LiferayAuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      liferayUserId,
      signIn,
      signUp,
      signOut,
      isAdmin,
      hasRole
    }}>
      {children}
    </LiferayAuthContext.Provider>
  );
};

export const useLiferayAuth = () => {
  const context = useContext(LiferayAuthContext);
  if (context === undefined) {
    throw new Error('useLiferayAuth must be used within a LiferayAuthProvider');
  }
  return context;
};
