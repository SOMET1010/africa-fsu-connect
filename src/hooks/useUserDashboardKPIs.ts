import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface DashboardKPI {
  label: string;
  value: number;
  trend: number | null; // percentage change vs previous period
  loading: boolean;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  type: "submission" | "document" | "event";
  date: string;
  authorName?: string;
}

export function useUserDashboardKPIs() {
  const { user } = useAuth();

  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ["user-dashboard-kpis", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const [projectsRes, docsRes, docsPrevRes, eventsRes, subsRes, subsPrevRes] = await Promise.all([
        // Projects count (via agency membership)
        supabase
          .from("agency_members")
          .select("agency_id", { count: "exact", head: false })
          .eq("user_id", user!.id)
          .eq("active", true)
          .then(async ({ data: memberships }) => {
            if (!memberships?.length) return { count: 0, prevCount: 0 };
            const agencyIds = memberships.map((m) => m.agency_id);
            const [current, prev] = await Promise.all([
              supabase.from("agency_projects").select("id", { count: "exact", head: true }).in("agency_id", agencyIds),
              supabase
                .from("agency_projects")
                .select("id", { count: "exact", head: true })
                .in("agency_id", agencyIds)
                .lt("created_at", thirtyDaysAgo.toISOString()),
            ]);
            return { count: current.count || 0, prevCount: prev.count || 0 };
          }),

        // Documents current period
        supabase.from("documents").select("id", { count: "exact", head: true }),

        // Documents previous period
        supabase.from("documents").select("id", { count: "exact", head: true }).lt("created_at", thirtyDaysAgo.toISOString()),

        // Upcoming events
        supabase.from("events").select("id", { count: "exact", head: true }).gte("start_date", now.toISOString()),

        // Submissions current
        supabase.from("submissions").select("id", { count: "exact", head: true }).eq("submitted_by", user!.id),

        // Submissions previous period
        supabase
          .from("submissions")
          .select("id", { count: "exact", head: true })
          .eq("submitted_by", user!.id)
          .lt("created_at", thirtyDaysAgo.toISOString()),
      ]);

      const calcTrend = (current: number, prev: number): number | null => {
        if (prev === 0) return current > 0 ? 100 : null;
        return Math.round(((current - prev) / prev) * 100);
      };

      return {
        projects: {
          label: "Mes projets",
          value: projectsRes.count,
          trend: calcTrend(projectsRes.count, projectsRes.prevCount),
          loading: false,
        },
        documents: {
          label: "Documents",
          value: docsRes.count || 0,
          trend: calcTrend(docsRes.count || 0, docsPrevRes.count || 0),
          loading: false,
        },
        events: {
          label: "Événements à venir",
          value: eventsRes.count || 0,
          trend: null,
          loading: false,
        },
        submissions: {
          label: "Soumissions",
          value: subsRes.count || 0,
          trend: calcTrend(subsRes.count || 0, subsPrevRes.count || 0),
          loading: false,
        },
      };
    },
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ["user-recent-activity", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [subsRes, docsRes] = await Promise.all([
        supabase
          .from("submissions")
          .select("id, title, created_at, submitted_by")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("documents")
          .select("id, title, created_at, uploaded_by")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const items: RecentActivityItem[] = [];

      (subsRes.data || []).forEach((s) =>
        items.push({ id: s.id, title: s.title, type: "submission", date: s.created_at })
      );
      (docsRes.data || []).forEach((d) =>
        items.push({ id: d.id, title: d.title, type: "document", date: d.created_at })
      );

      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return items.slice(0, 8);
    },
  });

  return {
    kpis: kpis || null,
    kpisLoading,
    recentActivity: recentActivity || [],
    activityLoading,
  };
}
