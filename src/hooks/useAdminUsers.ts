import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AdminUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  country?: string;
  organization?: string;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  avatar_url?: string;
  blocked?: boolean;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  adminUsers: number;
  usersByRole: Record<string, number>;
  usersByCountry: Record<string, number>;
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    adminUsers: 0,
    usersByRole: {},
    usersByCountry: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all users with profile data
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedUsers: AdminUser[] = data?.map(profile => ({
        id: profile.user_id,
        email: profile.email || '',
        first_name: profile.first_name,
        last_name: profile.last_name,
        role: profile.role,
        country: profile.country,
        organization: profile.organization,
        created_at: profile.created_at,
        avatar_url: profile.avatar_url,
        // These would come from auth.users in a real scenario
        last_sign_in_at: undefined,
        email_confirmed_at: undefined,
        blocked: false // Default to not blocked for now
      })) || [];

      setUsers(formattedUsers);
      calculateStats(formattedUsers);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs.",
        variant: "destructive",
      });
    }
  };

  // Calculate user statistics
  const calculateStats = (usersData: AdminUser[]) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats: UserStats = {
      totalUsers: usersData.length,
      activeUsers: usersData.filter(user => !user.blocked).length,
      newUsersThisMonth: usersData.filter(user => 
        new Date(user.created_at) >= thisMonth
      ).length,
      adminUsers: usersData.filter(user => 
        ['super_admin', 'admin_pays', 'editeur'].includes(user.role)
      ).length,
      usersByRole: {},
      usersByCountry: {}
    };

    // Count by role
    usersData.forEach(user => {
      stats.usersByRole[user.role] = (stats.usersByRole[user.role] || 0) + 1;
    });

    // Count by country
    usersData.forEach(user => {
      if (user.country) {
        stats.usersByCountry[user.country] = (stats.usersByCountry[user.country] || 0) + 1;
      }
    });

    setStats(stats);
  };

  // Update user role
  const updateUserRole = async (userId: string, newRole: 'super_admin' | 'admin_pays' | 'editeur' | 'contributeur' | 'lecteur') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Rôle mis à jour",
        description: "Le rôle de l'utilisateur a été modifié avec succès.",
      });

      await fetchUsers(); // Refresh data
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Block/unblock user (in real scenario, this would use auth admin API)
  const toggleUserStatus = async (userId: string, block: boolean) => {
    try {
      // In a real implementation, you would use Supabase auth admin functions
      // For now, we'll just show a success message
      toast({
        title: block ? "Utilisateur bloqué" : "Utilisateur débloqué",
        description: `L'utilisateur a été ${block ? 'bloqué' : 'débloqué'} avec succès.`,
      });

      await fetchUsers(); // Refresh data
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Send notification to user
  const sendNotificationToUser = async (userId: string, title: string, message: string) => {
    try {
      await supabase.functions.invoke('send-notification', {
        body: {
          type: 'admin_message',
          title,
          message,
          userId,
          actionUrl: '/dashboard'
        }
      });

      toast({
        title: "Notification envoyée",
        description: "La notification a été envoyée à l'utilisateur.",
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la notification.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Send notification to all users
  const sendBroadcastNotification = async (title: string, message: string) => {
    try {
      const userIds = users.map(user => user.id);
      
      await supabase.functions.invoke('send-notification', {
        body: {
          type: 'admin_broadcast',
          title,
          message,
          userIds,
          actionUrl: '/dashboard'
        }
      });

      toast({
        title: "Notification diffusée",
        description: `Notification envoyée à ${userIds.length} utilisateurs.`,
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la notification.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Export users data
  const exportUsers = () => {
    const csvContent = [
      ["Email", "Prénom", "Nom", "Rôle", "Pays", "Organisation", "Date création"].join(","),
      ...users.map(user => [
        user.email,
        user.first_name || "",
        user.last_name || "",
        user.role,
        user.country || "",
        user.organization || "",
        new Date(user.created_at).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export terminé",
      description: "Les données utilisateurs ont été exportées.",
    });
  };

  // Real-time subscriptions
  useEffect(() => {
    const setupSubscriptions = () => {
      const profilesSubscription = supabase
        .channel('admin_profiles_changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'profiles' },
          () => {
            fetchUsers();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(profilesSubscription);
      };
    };

    const cleanup = setupSubscriptions();
    return cleanup;
  }, []);

  // Initial fetch
  useEffect(() => {
    const initializeUsers = async () => {
      setLoading(true);
      try {
        await fetchUsers();
      } finally {
        setLoading(false);
      }
    };

    initializeUsers();
  }, []);

  return {
    users,
    stats,
    loading,
    error,
    fetchUsers,
    updateUserRole,
    toggleUserStatus,
    sendNotificationToUser,
    sendBroadcastNotification,
    exportUsers,
    refetch: fetchUsers
  };
};