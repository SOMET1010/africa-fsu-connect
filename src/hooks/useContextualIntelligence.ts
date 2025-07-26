import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface ContextualSuggestion {
  id: string;
  type: 'action' | 'navigation' | 'content' | 'workflow';
  title: string;
  description: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  metadata?: Record<string, any>;
}

export interface UserActivity {
  page: string;
  action: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export const useContextualIntelligence = () => {
  const [suggestions, setSuggestions] = useState<ContextualSuggestion[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(false);
  // Safe auth usage with fallback
  const auth = (() => {
    try {
      return useAuth();
    } catch (error) {
      return { user: null, profile: null };
    }
  })();
  const { user, profile } = auth;

  // Track user activity
  const trackActivity = useCallback((activity: Omit<UserActivity, 'timestamp'>) => {
    const newActivity = { ...activity, timestamp: new Date() };
    setActivities(prev => [newActivity, ...prev.slice(0, 99)]); // Keep last 100 activities
    
    // Store in localStorage for persistence
    const stored = JSON.parse(localStorage.getItem('userActivities') || '[]');
    localStorage.setItem('userActivities', JSON.stringify([newActivity, ...stored.slice(0, 99)]));
  }, []);

  // Load stored activities
  useEffect(() => {
    const stored = localStorage.getItem('userActivities');
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp)
        }));
        setActivities(parsed);
      } catch (error) {
        console.error('Error loading stored activities:', error);
      }
    }
  }, []);

  // Generate contextual suggestions based on user role and activity
  const generateSuggestions = () => {
    if (!profile) return [];

    const suggestions: ContextualSuggestion[] = [];
    const recentPages = activities.slice(0, 10).map(a => a.page);
    const frequentPages = getFrequentPages();

    // Role-based suggestions
    if (profile.role === 'super_admin' || profile.role === 'admin_pays') {
      suggestions.push({
        id: 'admin-dashboard',
        type: 'navigation',
        title: 'Gérer les utilisateurs',
        description: 'Accédez au panneau d\'administration pour gérer les comptes utilisateur',
        actionUrl: '/admin/users',
        priority: 'medium',
        category: 'administration'
      });

      if (!recentPages.includes('/admin')) {
        suggestions.push({
          id: 'admin-reminder',
          type: 'navigation',
          title: 'Tableau de bord administrateur',
          description: 'Consultez les statistiques et métriques de la plateforme',
          actionUrl: '/admin',
          priority: 'low',
          category: 'administration'
        });
      }
    }

    // Activity-based suggestions
    if (recentPages.includes('/forum') && !recentPages.includes('/forum/new')) {
      suggestions.push({
        id: 'create-post',
        type: 'action',
        title: 'Créer un nouveau post',
        description: 'Partager vos idées avec la communauté',
        actionUrl: '/forum/new',
        priority: 'medium',
        category: 'engagement'
      });
    }

    if (recentPages.includes('/events') && activities.some(a => a.action === 'view_event')) {
      suggestions.push({
        id: 'register-event',
        type: 'action',
        title: 'Événements à venir',
        description: 'Découvrez les prochains événements et inscrivez-vous',
        actionUrl: '/events',
        priority: 'high',
        category: 'events'
      });
    }

    if (!recentPages.includes('/profile') && profile.first_name && !profile.avatar_url) {
      suggestions.push({
        id: 'complete-profile',
        type: 'action',
        title: 'Compléter votre profil',
        description: 'Ajoutez une photo de profil et vos informations',
        actionUrl: '/profile',
        priority: 'medium',
        category: 'profile'
      });
    }

    // Workflow suggestions
    if (profile.role !== 'lecteur' && !recentPages.includes('/submit')) {
      suggestions.push({
        id: 'new-submission',
        type: 'workflow',
        title: 'Nouvelle soumission',
        description: 'Soumettez votre travail pour révision',
        actionUrl: '/submit',
        priority: 'low',
        category: 'workflow'
      });
    }

    // Time-based suggestions
    const hour = new Date().getHours();
    if (hour >= 9 && hour <= 17 && !recentPages.includes('/dashboard')) {
      suggestions.push({
        id: 'dashboard-check',
        type: 'navigation',
        title: 'Consulter le tableau de bord',
        description: 'Restez informé des dernières activités',
        actionUrl: '/dashboard',
        priority: 'low',
        category: 'productivity'
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const getFrequentPages = () => {
    const pageCount: Record<string, number> = {};
    activities.forEach(activity => {
      pageCount[activity.page] = (pageCount[activity.page] || 0) + 1;
    });
    return Object.entries(pageCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([page]) => page);
  };

  // Update suggestions when activities or profile change
  useEffect(() => {
    if (profile) {
      const newSuggestions = generateSuggestions();
      setSuggestions(newSuggestions);
    }
  }, [activities, profile]);

  // Smart notifications based on patterns
  const getSmartNotifications = () => {
    const notifications = [];
    const now = new Date();
    const lastActivity = activities[0]?.timestamp;

    if (lastActivity && (now.getTime() - lastActivity.getTime()) > 24 * 60 * 60 * 1000) {
      notifications.push({
        type: 'engagement',
        message: 'Vous n\'avez pas visité la plateforme depuis 24h. Découvrez les nouveautés !',
        action: '/dashboard'
      });
    }

    // Check if user frequently uses certain features
    const actionCounts = activities.reduce((acc, activity) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    if (actionCounts.view_forum > 10 && !actionCounts.create_post) {
      notifications.push({
        type: 'engagement',
        message: 'Vous consultez souvent le forum. Pourquoi ne pas participer à la discussion ?',
        action: '/forum/new'
      });
    }

    return notifications;
  };

  return {
    suggestions,
    activities,
    loading,
    trackActivity,
    getSmartNotifications,
    getFrequentPages,
  };
};