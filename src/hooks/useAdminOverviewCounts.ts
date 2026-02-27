import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const COUNT_TABLES = [
  "admin_activity_stream",
  "admin_alerts",
  "admin_account_validations",
  "admin_watch_sources",
  "admin_alert_rules",
  "training_courses",
  "training_participants",
  "training_certifications",
  "presentation_sessions",
  "admin_support_tickets",
  "admin_export_jobs",
  "admin_calendar_deadlines",
  "admin_calendar_reminders",
  "admin_map_configurations",
  "admin_connectors",
  "admin_internal_messages",
  "admin_security_policies",
  "admin_backups",
  "admin_data_requests",
  "admin_support_faq",
  "agency_projects",
  "documents",
  "document_versions",
  "document_comments",
  "forum_posts",
  "forum_replies",
  "profiles",
  "role_permissions",
  "focal_points",
  "events",
  "performance_metrics",
];

export const useAdminOverviewCounts = () => {
  return useQuery({
    queryKey: ["admin-overview-counts"],
    queryFn: async () => {
      const entries = await Promise.all(
        COUNT_TABLES.map(async (table) => {
          const { count, error } = await supabase
            .from(table)
            .select("id", { count: "exact", head: true });
          if (error) {
            console.error(`Unable to count ${table}`, error);
            return { table, count: 0 };
          }
          return { table, count: count ?? 0 };
        })
      );

      return entries.reduce<Record<string, number>>((acc, { table, count }) => {
        acc[table] = count;
        return acc;
      }, {});
    },
    staleTime: 2 * 60 * 1000,
  });
};
